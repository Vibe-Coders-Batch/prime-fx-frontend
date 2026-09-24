"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Gift, Loader2, Shield, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SecureImage } from "@/components/ui/secure-image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { useCart, useClearCart, useRemoveFromCart } from "@/features/cart/hooks/use-cart";
import { useCreateBulkPayment, useCreatePayment } from "@/features/payments/hooks/use-payments";
import { useValidateBulkCoupon, useValidateCoupon } from "@/features/coupons/hooks";
import type { BulkCouponValidationResult, CouponValidationResult } from "@/features/coupons/types";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const router = useRouter();
    const { data: cartData, isLoading } = useCart();
    const removeMutation = useRemoveFromCart();
    const clearMutation = useClearCart();
    const createPayment = useCreatePayment();
    const createBulkPayment = useCreateBulkPayment();
    const validateBulkCoupon = useValidateBulkCoupon();
    const validateCoupon = useValidateCoupon();

    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
    const [isCheckingOut, setIsCheckingOut] = useState<string | null>(null);
    const [isBulkCheckingOut, setIsBulkCheckingOut] = useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const debouncedCoupon = useDebounce(couponInput.trim(), 400);
    const [couponApplied, setCouponApplied] = useState<string | null>(null);
    const [bulkDiscountAmount, setBulkDiscountAmount] = useState(0);
    const [bulkCouponMeta, setBulkCouponMeta] = useState<{
        appliedCount: number;
        totalItems: number;
    } | null>(null);
    const [itemCouponInputs, setItemCouponInputs] = useState<Record<string, string>>({});
    const [itemCoupons, setItemCoupons] = useState<Record<string, CouponValidationResult>>({});

    const cartItems = cartData || [];
    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
    const currency = "AED";
    const perItemDiscountAmount = couponApplied
        ? 0
        : Object.values(itemCoupons).reduce((sum, r) => sum + Number(r.discountAmount || 0), 0);
    const totalDiscount = couponApplied ? bulkDiscountAmount : perItemDiscountAmount;
    const total = Math.max(subtotal - totalDiscount, 0.01);

    useEffect(() => {
        setCouponApplied(null);
        setBulkDiscountAmount(0);
        setBulkCouponMeta(null);
        setCouponInput("");
        setItemCouponInputs({});
        setItemCoupons({});
    }, [cartItems.length]);

    useEffect(() => {
        let cancelled = false;
        async function run() {
            if (!debouncedCoupon || cartItems.length < 2) return;
            try {
                const res = await validateBulkCoupon.mutateAsync({
                    couponCode: debouncedCoupon,
                    cartItemIds: cartItems.map((c) => c.cartItemId),
                });
                if (cancelled) return;
                if (couponApplied && couponApplied === debouncedCoupon.toUpperCase() && res.valid) {
                    setBulkDiscountAmount(Number(res.totals.discountAmount));
                    setBulkCouponMeta({
                        appliedCount: res.appliedCount,
                        totalItems: res.totalItems,
                    });
                }
            } catch {
                // Validation failures surface through the explicit Apply action.
            }
        }
        run();
        return () => {
            cancelled = true;
        };
    }, [cartItems, couponApplied, debouncedCoupon, validateBulkCoupon]);

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
        if (removingIds.has(itemId)) return;
        setRemovingIds((prev) => new Set(prev).add(itemId));
        try {
            await removeMutation.mutateAsync(itemId);
            toast.success("Item removed from cart");
        } catch {
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
            const applied = itemCoupons[item.cartItemId];
            const couponCode = applied?.valid ? applied.couponCode : undefined;
            const payment = await createPayment.mutateAsync({
                gateway: "STRIPE_UAE",
                itemType: item.itemType,
                courseId: item.itemType === "COURSE" ? item.courseId : undefined,
                sectionId: item.itemType === "SECTION" ? item.sectionId : undefined,
                couponCode,
                metadata: { cartItemId: item.cartItemId },
                successUrl: `${window.location.origin}/learner/payment/success`,
                cancelUrl: `${window.location.origin}/learner/payment/failure`,
            } as any);
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
                gateway: "STRIPE_UAE",
                cartItemIds,
                couponCode: couponApplied || undefined,
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
            <LearningSurface width="wide">
                <Skeleton className="mb-6 h-10 w-48" />
                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-lg" />
                        ))}
                    </div>
                    <Skeleton className="mt-4 h-96 rounded-lg lg:mt-0" />
                </div>
            </LearningSurface>
        );
    }

    if (cartItems.length === 0) {
        return (
            <LearningSurface>
                <LearningPageHeader title="Your bag" />
                <Panel>
                    <EmptyState
                        title="Your bag is empty"
                        description="Start adding courses to your cart to begin your learning journey."
                        icon={<ShoppingCart className="h-12 w-12" />}
                        action={{
                            label: "Browse Courses",
                            onClick: () => router.push("/learner/courses"),
                        }}
                    />
                </Panel>
            </LearningSurface>
        );
    }

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Your bag"
                description={`${cartItems.length} ${cartItems.length === 1 ? "item" : "items"}`}
            />

            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
                {/* Order summary. Read first on narrow screens, alongside the
                    items from the large breakpoint up. */}
                <aside
                    aria-label="Order summary"
                    className="mb-6 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:sticky lg:top-6"
                >
                    <Panel className="p-5">
                        <h2 className="text-base font-semibold text-[var(--ls-ink)]">
                            Order summary
                        </h2>

                        <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-[var(--ls-ink-quiet)]">Subtotal</dt>
                                <dd className="ls-nums font-medium text-[var(--ls-ink)]">
                                    {currency} {subtotal.toFixed(2)}
                                </dd>
                            </div>
                            {couponApplied && bulkDiscountAmount > 0 ? (
                                <div className="flex justify-between">
                                    <dt className="text-[var(--ls-ink-quiet)]">
                                        Discount ({couponApplied})
                                    </dt>
                                    <dd className="ls-nums font-medium text-[var(--ls-ok)]">
                                        -{currency} {bulkDiscountAmount.toFixed(2)}
                                    </dd>
                                </div>
                            ) : null}
                            {!couponApplied && perItemDiscountAmount > 0 ? (
                                <div className="flex justify-between">
                                    <dt className="text-[var(--ls-ink-quiet)]">
                                        Discount (item coupons)
                                    </dt>
                                    <dd className="ls-nums font-medium text-[var(--ls-ok)]">
                                        -{currency} {perItemDiscountAmount.toFixed(2)}
                                    </dd>
                                </div>
                            ) : null}
                            <div className="flex justify-between border-t border-[var(--ls-divider)] pt-2">
                                <dt className="font-semibold text-[var(--ls-ink)]">Total</dt>
                                <dd className="ls-nums text-lg font-semibold text-[var(--ls-ink)]">
                                    {currency} {total.toFixed(2)}
                                </dd>
                            </div>
                        </dl>

                        {cartItems.length > 1 ? (
                            <div className="mt-4 space-y-2 border-t border-[var(--ls-divider)] pt-3">
                                <label
                                    htmlFor="bulk-coupon"
                                    className="text-sm font-medium text-[var(--ls-ink)]"
                                >
                                    Coupon code (bulk)
                                </label>
                                {couponApplied ? (
                                    <>
                                        <div className="flex items-center justify-between rounded-md border border-[var(--ls-divider)] p-2">
                                            <span className="text-sm font-medium text-[var(--ls-ink)]">
                                                {couponApplied}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setCouponApplied(null);
                                                    setBulkDiscountAmount(0);
                                                    setBulkCouponMeta(null);
                                                    toast.success("Coupon removed");
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        {bulkCouponMeta ? (
                                            <p className="ls-nums text-xs text-[var(--ls-ink-quiet)]">
                                                Applied to {bulkCouponMeta.appliedCount} of{" "}
                                                {bulkCouponMeta.totalItems} items
                                            </p>
                                        ) : null}
                                    </>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            id="bulk-coupon"
                                            placeholder="Enter coupon code"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            className="text-sm"
                                            disabled={Object.keys(itemCoupons).length > 0}
                                        />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={
                                                !couponInput.trim() || validateBulkCoupon.isPending
                                            }
                                            onClick={async () => {
                                                try {
                                                    if (Object.keys(itemCoupons).length > 0) {
                                                        toast.error(
                                                            "Remove item coupons before applying a bulk coupon",
                                                        );
                                                        return;
                                                    }
                                                    const res: BulkCouponValidationResult =
                                                        await validateBulkCoupon.mutateAsync({
                                                            couponCode: couponInput,
                                                            cartItemIds: cartItems.map(
                                                                (c) => c.cartItemId,
                                                            ),
                                                        });
                                                    if (!res.valid) {
                                                        toast.error(res.message);
                                                        return;
                                                    }
                                                    setItemCoupons({});
                                                    setCouponApplied(res.couponCode);
                                                    setBulkDiscountAmount(
                                                        Number(res.totals.discountAmount),
                                                    );
                                                    setBulkCouponMeta({
                                                        appliedCount: res.appliedCount,
                                                        totalItems: res.totalItems,
                                                    });
                                                    toast.success(res.message);
                                                    setCouponInput("");
                                                } catch (e: any) {
                                                    toast.error(
                                                        e?.response?.data?.message ||
                                                            "Failed to validate coupon",
                                                    );
                                                }
                                            }}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        {cartItems.length > 1 ? (
                            <Button
                                onClick={handleBulkCheckout}
                                disabled={
                                    isBulkCheckingOut ||
                                    createBulkPayment.isPending ||
                                    Object.keys(itemCoupons).length > 0
                                }
                                className="mt-4 w-full"
                                size="lg"
                            >
                                {isBulkCheckingOut || createBulkPayment.isPending ? (
                                    <>
                                        <Loader2
                                            aria-hidden="true"
                                            className="mr-2 h-4 w-4 animate-spin"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Checkout All ({cartItems.length} items)
                                        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        ) : null}
                        {cartItems.length > 1 && Object.keys(itemCoupons).length > 0 ? (
                            <p className="mt-2 text-xs text-[var(--ls-ink-quiet)]">
                                Bulk checkout is disabled while item coupons are applied (checkout
                                items individually).
                            </p>
                        ) : null}

                        <ul className="mt-4 space-y-1.5 border-t border-[var(--ls-divider)] pt-3 text-xs text-[var(--ls-ink-quiet)]">
                            <li className="flex items-start gap-2">
                                <Shield aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                                Secure checkout
                            </li>
                            <li className="flex items-start gap-2">
                                <Gift aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                                Instant access
                            </li>
                        </ul>

                        <Link href="/learner/courses" className="mt-4 block">
                            <Button variant="outline" className="w-full" size="sm">
                                Continue Shopping
                            </Button>
                        </Link>
                    </Panel>
                </aside>

                <div className="space-y-4 lg:col-start-1 lg:row-start-1">
                    <ul className="space-y-4">
                        {cartItems.map((item) => {
                            const itemTitle = getItemTitle(item);
                            const itemThumbnail = getItemThumbnail(item);
                            const isRemoving = removingIds.has(item.cartItemId);
                            const isCheckingOutItem = isCheckingOut === item.cartItemId;
                            return (
                                <li
                                    key={item.cartItemId}
                                    className={cn(isRemoving && "pointer-events-none opacity-50")}
                                >
                                    <Panel className="overflow-hidden">
                                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                                            <button
                                                type="button"
                                                className="h-32 w-full shrink-0 overflow-hidden rounded-md border border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)] sm:h-24 sm:w-36"
                                                onClick={() => {
                                                    if (item.itemType === "COURSE" && item.courseId) {
                                                        router.push(
                                                            `/learner/courses/${item.courseId}`,
                                                        );
                                                    }
                                                }}
                                            >
                                                {itemThumbnail ? (
                                                    <SecureImage
                                                        src={itemThumbnail}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-full w-full items-center justify-center">
                                                        <ShoppingCart
                                                            aria-hidden="true"
                                                            className="h-8 w-8 text-[var(--ls-ink-quiet)]"
                                                        />
                                                    </span>
                                                )}
                                                <span className="sr-only">View {itemTitle}</span>
                                            </button>

                                            <div className="flex min-w-0 flex-1 flex-col gap-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <h2 className="line-clamp-2 text-base font-semibold text-[var(--ls-ink)]">
                                                            {itemTitle}
                                                        </h2>
                                                        {item.itemType === "SECTION" &&
                                                        item.course?.title ? (
                                                            <p className="text-xs text-[var(--ls-ink-quiet)]">
                                                                From: {item.course.title}
                                                            </p>
                                                        ) : null}
                                                        <p className="text-sm text-[var(--ls-ink-quiet)]">
                                                            {item.itemType === "SECTION"
                                                                ? "Course Section"
                                                                : "Full Course"}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 shrink-0"
                                                        onClick={() => handleRemove(item.cartItemId)}
                                                        disabled={isRemoving}
                                                    >
                                                        <X aria-hidden="true" className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Remove {itemTitle}
                                                        </span>
                                                    </Button>
                                                </div>

                                                <div className="ls-nums text-lg font-semibold text-[var(--ls-ink)]">
                                                    {item.currency}{" "}
                                                    {parseFloat(String(item.price || 0)).toFixed(2)}
                                                </div>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    {cartItems.length > 1 && couponApplied ? (
                                                        <p className="text-xs text-[var(--ls-ink-quiet)]">
                                                            Bulk coupon applied (per-item coupons
                                                            disabled)
                                                        </p>
                                                    ) : itemCoupons[item.cartItemId]?.valid ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="ls-nums text-xs text-[var(--ls-ink-quiet)]">
                                                                Coupon:{" "}
                                                                <span className="font-medium">
                                                                    {
                                                                        itemCoupons[item.cartItemId]
                                                                            .couponCode
                                                                    }
                                                                </span>{" "}
                                                                (-{item.currency}{" "}
                                                                {parseFloat(
                                                                    String(
                                                                        itemCoupons[item.cartItemId]
                                                                            .discountAmount || 0,
                                                                    ),
                                                                ).toFixed(2)}
                                                                )
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setItemCoupons((prev) => {
                                                                        const next = { ...prev };
                                                                        delete next[item.cartItemId];
                                                                        return next;
                                                                    });
                                                                    toast.success("Coupon removed");
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex w-full gap-2 sm:w-auto">
                                                            <Input
                                                                aria-label={`Coupon code for ${itemTitle}`}
                                                                placeholder="Coupon"
                                                                value={
                                                                    itemCouponInputs[
                                                                        item.cartItemId
                                                                    ] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    setItemCouponInputs((prev) => ({
                                                                        ...prev,
                                                                        [item.cartItemId]:
                                                                            e.target.value,
                                                                    }))
                                                                }
                                                                className="h-9 w-full text-sm sm:w-40"
                                                                disabled={
                                                                    cartItems.length > 1 &&
                                                                    !!couponApplied
                                                                }
                                                            />
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-9"
                                                                disabled={
                                                                    !(
                                                                        itemCouponInputs[
                                                                            item.cartItemId
                                                                        ] || ""
                                                                    ).trim() ||
                                                                    validateCoupon.isPending ||
                                                                    (cartItems.length > 1 &&
                                                                        !!couponApplied)
                                                                }
                                                                onClick={async () => {
                                                                    try {
                                                                        if (couponApplied) {
                                                                            setCouponApplied(null);
                                                                            setBulkDiscountAmount(0);
                                                                            setBulkCouponMeta(null);
                                                                        }
                                                                        const couponCode = (
                                                                            itemCouponInputs[
                                                                                item.cartItemId
                                                                            ] || ""
                                                                        ).trim();
                                                                        const anyItem = item as any;
                                                                        const courseIdForCoupon =
                                                                            anyItem.courseId ||
                                                                            anyItem.section
                                                                                ?.courseId ||
                                                                            anyItem.section?.course
                                                                                ?.courseId ||
                                                                            anyItem.course?.courseId;
                                                                        if (!courseIdForCoupon) {
                                                                            toast.error(
                                                                                "Course not found for this item",
                                                                            );
                                                                            return;
                                                                        }
                                                                        const res =
                                                                            await validateCoupon.mutateAsync(
                                                                                {
                                                                                    couponCode,
                                                                                    courseId:
                                                                                        courseIdForCoupon,
                                                                                    sectionId:
                                                                                        item.itemType ===
                                                                                        "SECTION"
                                                                                            ? item.sectionId
                                                                                            : undefined,
                                                                                    itemType:
                                                                                        item.itemType,
                                                                                },
                                                                            );
                                                                        if (!res.valid) {
                                                                            toast.error(res.message);
                                                                            return;
                                                                        }
                                                                        setItemCoupons((prev) => ({
                                                                            ...prev,
                                                                            [item.cartItemId]: res,
                                                                        }));
                                                                        toast.success(
                                                                            "Coupon applied",
                                                                        );
                                                                    } catch (e: any) {
                                                                        toast.error(
                                                                            e?.response?.data
                                                                                ?.message ||
                                                                                "Failed to validate coupon",
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                Apply
                                                            </Button>
                                                        </div>
                                                    )}

                                                    <Button
                                                        onClick={() => handleCheckout(item)}
                                                        disabled={
                                                            isCheckingOutItem ||
                                                            isRemoving ||
                                                            isBulkCheckingOut
                                                        }
                                                        className="gap-2"
                                                    >
                                                        {isCheckingOutItem ? (
                                                            <>
                                                                <Loader2
                                                                    aria-hidden="true"
                                                                    className="h-4 w-4 animate-spin"
                                                                />
                                                                Processing
                                                            </>
                                                        ) : (
                                                            <>
                                                                Checkout
                                                                <ArrowRight
                                                                    aria-hidden="true"
                                                                    className="h-4 w-4"
                                                                />
                                                                <span className="sr-only">
                                                                    {" "}
                                                                    {itemTitle}
                                                                </span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Panel>
                                </li>
                            );
                        })}
                    </ul>

                    {cartItems.length > 1 ? (
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-[var(--ls-risk)]"
                            onClick={() => setShowClearDialog(true)}
                        >
                            <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
                            Clear All Items
                        </Button>
                    ) : null}
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
        </LearningSurface>
    );
}
