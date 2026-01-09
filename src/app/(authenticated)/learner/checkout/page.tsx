"use client";

import { PageLayout } from "@/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import { useCourse } from "@/features/courses/hooks/use-courses";
import { useCreatePayment } from "@/features/payments/hooks/use-payments";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, Suspense, useMemo, useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const sectionId = searchParams.get("sectionId");
  const itemTypeParam = searchParams.get("itemType");
  const itemType: "COURSE" | "SECTION" =
    itemTypeParam === "SECTION" && sectionId ? "SECTION" : "COURSE";
  const { data: course, isLoading } = useCourse({
    enabled: true,
    courseId: courseId || undefined,
  });
  const createPayment = useCreatePayment();
  const { user } = useAuthStore();
  const [gateway, setGateway] = useState<
    "RAZORPAY" | "STRIPE_US" | "STRIPE_UAE"
  >("STRIPE_US");
  const [billingInfo, setBillingInfo] = useState({
    name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    email: user?.email || "",
    address: "",
    city: "",
    country: "",
  });
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const targetSection = useMemo(
    () => course?.sections?.find((s) => s.sectionId === sectionId),
    [course?.sections, sectionId]
  );

  if (isLoading) {
    return (
      <PageLayout header="Loading...">
        <Skeleton className="h-64 w-full" />
      </PageLayout>
    );
  }

  if (!course) {
    return (
      <PageLayout header="Course Not Found">
        <EmptyState
          title="Course not found"
          description="The course you're looking for doesn't exist."
          icon={<ShoppingCart className="h-12 w-12" />}
        />
      </PageLayout>
    );
  }

  const handlePayment = async () => {
    try {
      const payment = await createPayment.mutateAsync({
        gateway,
        itemType,
        courseId: course.courseId,
        sectionId: itemType === "SECTION" ? sectionId || undefined : undefined,
        successUrl: `${window.location.origin}/learner/payment/success`,
        cancelUrl: `${window.location.origin}/learner/payment/failure`,
      });

      if (payment && "checkoutUrl" in payment && payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
      } else {
        router.push(`/learner/payment/success?paymentId=${payment.paymentId}`);
      }
    } catch (error: unknown) {
      // Error handled by hook
      if (error instanceof Error) {
        console.error("Payment error:", error.message);
      }
    }
  };

  return (
    <PageLayout
      header="Checkout"
      subtitle="Complete Your Purchase"
      description="Review your order and complete payment"
    >
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
                  <Input
                    id="name"
                    value={billingInfo.name}
                    onChange={(e) =>
                      setBillingInfo({ ...billingInfo, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) =>
                      setBillingInfo({ ...billingInfo, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={billingInfo.address}
                  onChange={(e) =>
                    setBillingInfo({ ...billingInfo, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingInfo.city}
                    onChange={(e) =>
                      setBillingInfo({ ...billingInfo, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={billingInfo.country}
                    onChange={(e) =>
                      setBillingInfo({
                        ...billingInfo,
                        country: e.target.value,
                      })
                    }
                  />
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
                  {mounted ? (
                    <Select
                      value={gateway}
                      onValueChange={(
                        value: "RAZORPAY" | "STRIPE_US" | "STRIPE_UAE"
                      ) => setGateway(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RAZORPAY">Razorpay (India)</SelectItem>
                        <SelectItem value="STRIPE_US">Stripe (USA)</SelectItem>
                        <SelectItem value="STRIPE_UAE">Stripe (UAE)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
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
                {itemType === "SECTION" && targetSection && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Purchasing section: {targetSection.title}
                  </p>
                )}
              </div>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>
                    {itemType === "SECTION" ? "Section Price" : "Course Price"}
                  </span>
                  <span>
                    {course.currency}{" "}
                    {itemType === "SECTION" && targetSection?.sectionPrice
                      ? parseFloat(String(targetSection.sectionPrice)).toFixed(2)
                      : parseFloat(course.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {course.currency}{" "}
                    {itemType === "SECTION" && targetSection?.sectionPrice
                      ? parseFloat(String(targetSection.sectionPrice)).toFixed(2)
                      : parseFloat(course.price).toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handlePayment}
                disabled={createPayment.isPending}
              >
                {createPayment.isPending ? "Processing..." : "Complete Payment"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <PageLayout header="Loading...">
          <Skeleton className="h-64 w-full" />
        </PageLayout>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
