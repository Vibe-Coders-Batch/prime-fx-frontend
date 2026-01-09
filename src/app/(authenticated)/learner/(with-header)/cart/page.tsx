"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useCart,
  useRemoveFromCart,
  useClearCart,
} from "@/features/cart/hooks/use-cart";
import { useCreatePayment, useCreateBulkPayment } from "@/features/payments/hooks/use-payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  ShoppingCart,
  X,
  Sparkles,
  Gift,
  Truck,
  Shield,
  ArrowRight,
  Loader2,
  Tag,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.8,
    transition: {
      duration: 0.4,
      ease: "easeInOut" as const,
    },
  },
};

export default function CartPage() {
  const router = useRouter();
  const { data: cartData, isLoading } = useCart();
  const removeMutation = useRemoveFromCart();
  const clearMutation = useClearCart();
  const createPayment = useCreatePayment();
  const createBulkPayment = useCreateBulkPayment();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);
  const [isBulkCheckingOut, setIsBulkCheckingOut] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const cartItems = cartData || [];
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0),
    0
  );
  const totalPrice = subtotal - discountAmount;
  const currency = cartItems[0]?.currency || "USD";

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const discountPercent = 10;
    const calculatedDiscount = (subtotal * discountPercent) / 100;
    setDiscountAmount(calculatedDiscount);
    setAppliedCoupon(couponCode.toUpperCase());
    toast.success(
      `Coupon "${couponCode.toUpperCase()}" applied! ${discountPercent}% discount`
    );
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.success("Coupon removed");
  };

  const getItemTitle = (item: any) => {
    if (item.itemType === "COURSE") {
      return item.course?.title || "Course";
    }
    return item.section?.title || item.course?.title || "Section";
  };

  const getItemThumbnail = (item: any) => {
    if (item.itemType === "COURSE") {
      return item.course?.thumbnail;
    }
    return item.section?.course?.thumbnail || item.course?.thumbnail;
  };

  const handleRemove = async (itemId: string) => {
    if (removingIds.has(itemId)) return; // Prevent duplicate clicks
    
    setRemovingIds((prev) => new Set(prev).add(itemId));
    try {
      await removeMutation.mutateAsync(itemId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleCheckout = async (item: any) => {
    setIsCheckingOut(item.cartItemId);
    try {
      const payload =
        item.itemType === "COURSE"
          ? { courseId: item.courseId }
          : { courseId: item.courseId, sectionId: item.sectionId };
      const payment = await createPayment.mutateAsync({
        gateway: "STRIPE_US",
        itemType: item.itemType as any,
        ...payload,
        metadata: { cartItemId: item.cartItemId },
        successUrl: `${window.location.origin}/learner/payment/success`,
        cancelUrl: `${window.location.origin}/learner/payment/failure`,
      });
      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setIsCheckingOut(null);
    }
  };

  const handleBulkCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsBulkCheckingOut(true);
    try {
      const cartItemIds = cartItems.map((item) => item.cartItemId);

      const payment = await createBulkPayment.mutateAsync({
        gateway: "STRIPE_US",
        cartItemIds,
        successUrl: `${window.location.origin}/learner/payment/success?bulk=true`,
        cancelUrl: `${window.location.origin}/learner/payment/failure`,
      });

      if (payment.checkoutUrl) {
        window.location.href = payment.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate checkout");
      setIsBulkCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 py-8 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-md w-full"
        >
          <EmptyState
            title="Your bag is empty"
            description="Start adding courses to your cart to begin your learning journey."
            icon={<ShoppingCart className="h-16 w-16" />}
            action={{
              label: "Browse Courses",
              onClick: () => router.push("/learner/courses"),
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Your Bag
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => {
                const itemTitle = getItemTitle(item);
                const itemThumbnail = getItemThumbnail(item);
                const isRemoving = removingIds.has(item.cartItemId);
                const isCheckingOutItem = isCheckingOut === item.cartItemId;

                return (
                  <motion.div
                    key={item.cartItemId}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className={cn(
                      "relative",
                      isRemoving && "opacity-50 pointer-events-none"
                    )}
                  >
                    <Card className="overflow-hidden border hover:border-primary/50 transition-all duration-200 hover:shadow-md bg-card">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-32 md:w-40 h-32 sm:h-40 bg-muted rounded-xl overflow-hidden flex-shrink-0 relative group cursor-pointer"
                            onClick={() => {
                              if (item.itemType === "COURSE" && item.courseId) {
                                router.push(
                                  `/learner/courses/${item.courseId}`
                                );
                              }
                            }}
                          >
                            {itemThumbnail ? (
                              <img
                                src={itemThumbnail}
                                alt={itemTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                                <ShoppingCart className="h-12 w-12 text-primary/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </motion.div>

                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-lg sm:text-xl mb-1 line-clamp-2 hover:text-primary transition-colors">
                                    {itemTitle}
                                  </h3>
                                  {item.itemType === "SECTION" && item.course?.title && (
                                    <p className="text-xs text-muted-foreground mb-1">
                                      From: {item.course.title}
                                    </p>
                                  )}
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {item.itemType === "SECTION" ? "Course Section" : "Full Course"}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                                  onClick={() => handleRemove(item.cartItemId)}
                                  disabled={isRemoving}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                              <div className="text-xl font-semibold text-foreground">
                                {item.currency}{" "}
                                {parseFloat(String(item.price || 0)).toFixed(2)}
                              </div>
                              <Button
                                onClick={() => handleCheckout(item)}
                                disabled={
                                  isCheckingOutItem ||
                                  isRemoving ||
                                  isBulkCheckingOut
                                }
                                className="gap-2 font-medium"
                                variant="default"
                              >
                                {isCheckingOutItem ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing
                                  </>
                                ) : (
                                  <>
                                    Checkout
                                    <ArrowRight className="h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {cartItems.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                  onClick={() => setShowClearDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Items
                </Button>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:sticky lg:top-20 h-fit"
          >
            <Card className="border bg-card shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        {currency} {subtotal.toFixed(2)}
                      </span>
                    </div>
                    {appliedCoupon && discountAmount > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Discount ({appliedCoupon})
                          </span>
                          <span className="font-medium text-green-600">
                            -{currency} {discountAmount.toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-primary font-bold text-xl">
                        {currency} {totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Coupon Code
                    </label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            {appliedCoupon}
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Applied
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          onClick={handleRemoveCoupon}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleApplyCoupon();
                            }
                          }}
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleApplyCoupon}
                          className="shrink-0"
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {cartItems.length > 1 && (
                  <Button
                    onClick={handleBulkCheckout}
                    disabled={isBulkCheckingOut || createBulkPayment.isPending}
                    className="w-full font-semibold"
                    size="lg"
                  >
                    {isBulkCheckingOut || createBulkPayment.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Checkout All ({cartItems.length} items)
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-start gap-2 text-xs">
                    <Shield className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Secure checkout
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <Gift className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Instant access
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/learner/courses" className="block">
                    <Button variant="outline" className="w-full" size="sm">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Cart</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear your cart? This will remove all{" "}
              {cartItems.length} items and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearMutation.mutate();
                setShowClearDialog(false);
              }}
            >
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
