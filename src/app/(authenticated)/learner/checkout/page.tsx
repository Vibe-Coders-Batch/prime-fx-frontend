"use client";
import { PageLayout } from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { useCreatePayment } from "@/features/payments/hooks/use-payments";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useState, Suspense, useMemo, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useDebounce } from "@/hooks/use-debounce";
import { useValidateCoupon } from "@/features/coupons/hooks";
import type { CouponValidationResult } from "@/features/coupons/types";
import { toast } from "sonner";
function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = searchParams.get("courseId");
    const sectionId = searchParams.get("sectionId");
    const itemTypeParam = searchParams.get("itemType");
    const itemType: "COURSE" | "SECTION" = itemTypeParam === "SECTION" && sectionId ? "SECTION" : "COURSE";
    const { data: course, isLoading } = useCourse({
        enabled: true,
        courseId: courseId || undefined,
    });
    const createPayment = useCreatePayment();
    const validateCoupon = useValidateCoupon();
    const { user } = useAuthStore();
    const [gateway, setGateway] = useState<"RAZORPAY" | "STRIPE_US" | "STRIPE_UAE">("STRIPE_US");
    const [billingInfo, setBillingInfo] = useState({
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        email: user?.email || "",
        address: "",
        city: "",
        country: "",
    });
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const targetSection = useMemo(() => course?.sections?.find((s) => s.sectionId === sectionId), [course?.sections, sectionId]);
    const [couponInput, setCouponInput] = useState("");
    const debouncedCoupon = useDebounce(couponInput.trim(), 400);
    const [couponPreview, setCouponPreview] = useState<CouponValidationResult | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
    const baseAmount = useMemo(() => {
        const coursePrice = course ? parseFloat(course.price) : 0;
        if (itemType === "SECTION" && targetSection?.sectionPrice) {
            return parseFloat(String(targetSection.sectionPrice));
        }
        return coursePrice;
    }, [course, itemType, targetSection?.sectionPrice]);
    const currency = course?.currency || "USD";
    useEffect(() => {
        setAppliedCoupon(null);
        setCouponPreview(null);
        setCouponInput("");
    }, [courseId, sectionId, itemType]);
    useEffect(() => {
        let cancelled = false;
        async function run() {
            if (!course || !debouncedCoupon) {
                setCouponPreview(null);
                return;
            }
            try {
                const res = await validateCoupon.mutateAsync({
                    couponCode: debouncedCoupon,
                    courseId: course.courseId,
                    sectionId: itemType === "SECTION" ? sectionId || undefined : undefined,
                    itemType,
                });
                if (!cancelled)
                    setCouponPreview(res);
            }
            catch (e: any) {
                if (!cancelled) {
                    setCouponPreview({
                        valid: false,
                        couponCode: debouncedCoupon.toUpperCase(),
                        reason: "ERROR",
                        message: e?.response?.data?.message || "Failed to validate coupon",
                    });
                }
            }
        }
        run();
        return () => {
            cancelled = true;
        };
    }, [course, debouncedCoupon, itemType, sectionId, validateCoupon]);
    const effectiveCoupon = appliedCoupon?.valid ? appliedCoupon : null;
    const finalAmount = effectiveCoupon?.valid
        ? parseFloat(String(effectiveCoupon.finalAmount))
        : baseAmount;
    if (isLoading) {
        return (<PageLayout header="Loading...">
        <Skeleton className="h-64 w-full"/>
      </PageLayout>);
    }
    if (!course) {
        return (<PageLayout header="Course Not Found">
        <EmptyState title="Course not found" description="The course you're looking for doesn't exist." icon={<ShoppingCart className="h-12 w-12"/>}/>
      </PageLayout>);
    }
    const handlePayment = async () => {
        try {
            const payment = await createPayment.mutateAsync({
                gateway,
                itemType,
                courseId: course.courseId,
                sectionId: itemType === "SECTION" ? sectionId || undefined : undefined,
                couponCode: effectiveCoupon?.valid ? effectiveCoupon.couponCode : undefined,
                successUrl: `${window.location.origin}/learner/payment/success`,
                cancelUrl: `${window.location.origin}/learner/payment/failure`,
            });
            if (payment && "checkoutUrl" in payment && payment.checkoutUrl) {
                window.location.href = payment.checkoutUrl;
            }
            else {
                router.push(`/learner/payment/success?paymentId=${payment.paymentId}`);
            }
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Payment error:", error.message);
            }
        }
    };
    return (<PageLayout header="Checkout" subtitle="Complete Your Purchase" description="Review your order and complete payment">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={billingInfo.name} onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={billingInfo.email} onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={billingInfo.address} onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}/>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={billingInfo.city} onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={billingInfo.country} onChange={(e) => setBillingInfo({
            ...billingInfo,
            country: e.target.value,
        })}/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Payment Gateway</Label>
                  {mounted ? (<Select value={gateway} onValueChange={(value: "RAZORPAY" | "STRIPE_US" | "STRIPE_UAE") => setGateway(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RAZORPAY">Razorpay (India)</SelectItem>
                        <SelectItem value="STRIPE_US">Stripe (USA)</SelectItem>
                        <SelectItem value="STRIPE_UAE">Stripe (UAE)</SelectItem>
                      </SelectContent>
                    </Select>) : (<div className="h-10 w-full bg-muted animate-pulse rounded-md"/>)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4"/>
                  <span>Secure payment processing</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                {itemType === "SECTION" && targetSection && (<p className="text-xs text-muted-foreground mt-2">
                    Purchasing section: {targetSection.title}
                  </p>)}
              </div>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>
                    {itemType === "SECTION" ? "Section Price" : "Course Price"}
                  </span>
                  <span>
                    {currency} {baseAmount.toFixed(2)}
                  </span>
                </div>

                
                <div className="pt-3">
                  <Label>Coupon</Label>
                  {effectiveCoupon ? (<div className="mt-2 flex items-center justify-between rounded-md border p-2">
                      <div className="text-sm">
                        <span className="font-medium">{effectiveCoupon.couponCode}</span>
                        <span className="text-muted-foreground"> applied</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => {
                setAppliedCoupon(null);
                toast.success("Coupon removed");
            }}>
                        Remove
                      </Button>
                    </div>) : (<div className="mt-2 space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="Enter coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)}/>
                        <Button variant="outline" onClick={() => {
                if (!couponPreview) {
                    toast.error("Enter a coupon code");
                    return;
                }
                if (!couponPreview.valid) {
                    toast.error(couponPreview.message);
                    return;
                }
                setAppliedCoupon(couponPreview);
                toast.success("Coupon applied");
            }} disabled={validateCoupon.isPending || !couponInput.trim()}>
                          Apply
                        </Button>
                      </div>
                      {couponPreview && (<div className={`text-xs ${couponPreview.valid ? "text-green-600" : "text-destructive"}`}>
                          {couponPreview.message}
                        </div>)}
                    </div>)}
                </div>

                {effectiveCoupon && (<div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Discount ({effectiveCoupon.couponCode})
                    </span>
                    <span className="text-green-600 font-medium">
                      -{currency}{" "}
                      {parseFloat(String(effectiveCoupon.discountAmount)).toFixed(2)}
                    </span>
                  </div>)}

                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {currency} {finalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button className="w-full" onClick={handlePayment} disabled={createPayment.isPending}>
                {createPayment.isPending ? "Processing..." : "Complete Payment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>);
}
export default function CheckoutPage() {
    return (<Suspense fallback={<PageLayout header="Loading...">
          <Skeleton className="h-64 w-full"/>
        </PageLayout>}>
      <CheckoutContent />
    </Suspense>);
}
