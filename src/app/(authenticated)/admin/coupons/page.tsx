"use client";
import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Power, PowerOff, Search, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { OpsList, OpsPager, ResultCount, type OpsColumn } from "@/components/learning/ops-list";
import { StatusPill } from "@/components/learning/status-pill";
import { useDebounce } from "@/hooks/use-debounce";
import { useCoupons, useDeleteCoupon, useToggleCouponStatus } from "@/features/coupons/hooks";
import { CouponFormDialog } from "@/features/coupons/components/coupon-form-dialog";
import type { Coupon } from "@/features/coupons/types";

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
const isExpired = (validTill: string) => new Date(validTill) < new Date();

export default function AdminCouponsPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    const { data, isLoading, isFetching } = useCoupons({
        search: debouncedSearch || undefined,
        isActive: statusFilter === "all" ? undefined : statusFilter === "active",
        page,
        limit: 20,
    });
    const toggleStatus = useToggleCouponStatus();
    const deleteCoupon = useDeleteCoupon();

    const coupons = data?.data || [];
    const pagination = data?.pagination;

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormOpen(true);
    };
    const handleCreate = () => {
        setEditingCoupon(null);
        setFormOpen(true);
    };
    const handleDelete = (coupon: Coupon) => {
        if (confirm(`Delete coupon "${coupon.couponCode}"? This action cannot be undone.`)) {
            deleteCoupon.mutate(coupon.couponId);
        }
    };

    const columns: OpsColumn<Coupon>[] = [
        {
            key: "code",
            header: "Code",
            primary: true,
            cell: (coupon) => <span className="font-mono">{coupon.couponCode}</span>,
        },
        {
            key: "discount",
            header: "Discount",
            numeric: true,
            cell: (coupon) => (
                <>
                    {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    {coupon.maxDiscountAmount ? (
                        <span className="ml-1 text-xs text-[var(--ls-ink-quiet)]">
                            (max ${coupon.maxDiscountAmount})
                        </span>
                    ) : null}
                </>
            ),
        },
        {
            key: "valid",
            header: "Valid period",
            numeric: true,
            cell: (coupon) => `${formatDate(coupon.validFrom)} – ${formatDate(coupon.validTill)}`,
        },
        {
            key: "usage",
            header: "Usage",
            numeric: true,
            cell: (coupon) => (
                <>
                    {coupon.usageCount}
                    {coupon.usageLimit ? (
                        <span className="text-[var(--ls-ink-quiet)]"> / {coupon.usageLimit}</span>
                    ) : null}
                </>
            ),
        },
        {
            key: "applies",
            header: "Applies to",
            cell: (coupon) =>
                coupon.categories.length > 0 || coupon.courses.length > 0 ? (
                    <span className="flex flex-wrap gap-1">
                        {coupon.categories.slice(0, 2).map((c) => (
                            <StatusPill key={c.categoryId} tone="neutral">
                                {c.name}
                            </StatusPill>
                        ))}
                        {coupon.categories.length > 2 ? (
                            <StatusPill tone="neutral">+{coupon.categories.length - 2}</StatusPill>
                        ) : null}
                    </span>
                ) : (
                    "All courses"
                ),
        },
        {
            key: "status",
            header: "Status",
            badge: true,
            cell: (coupon) =>
                isExpired(coupon.validTill) ? (
                    <StatusPill tone="neutral">Expired</StatusPill>
                ) : coupon.isActive ? (
                    <StatusPill tone="ok">Active</StatusPill>
                ) : (
                    <StatusPill tone="neutral">Inactive</StatusPill>
                ),
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Coupon management"
                description="Create and manage discount coupons for your courses"
                actions={
                    <Button onClick={handleCreate}>
                        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                        Create Coupon
                    </Button>
                }
            />

            <div className="space-y-4">
                <Panel className="p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="relative">
                            <Search
                                aria-hidden="true"
                                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ls-ink-quiet)]"
                            />
                            <Input
                                aria-label="Search coupons by code"
                                placeholder="Search by coupon code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 pl-8"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger
                                aria-label="Filter coupons by status"
                                className="h-9 w-full md:w-[170px]"
                            >
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </Panel>

                <ResultCount
                    isLoading={isLoading}
                    total={pagination?.total}
                    shown={coupons.length}
                    noun="coupon"
                />

                {isLoading ? (
                    <DataTableSkeleton columnCount={7} rowCount={10} />
                ) : coupons.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No coupons found"
                            description="Create your first coupon to offer discounts."
                            icon={<Tag className="h-12 w-12" />}
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption={`Discount coupons, page ${pagination?.page ?? 1} of ${pagination?.totalPages ?? 1}`}
                        columns={columns}
                        rows={coupons}
                        getRowKey={(coupon) => coupon.couponId}
                        isFetching={isFetching}
                        breakpoint="lg"
                        renderActions={(coupon) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                                        <span className="sr-only">
                                            Actions for {coupon.couponCode}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                                        <Pencil aria-hidden="true" className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            toggleStatus.mutate({
                                                couponId: coupon.couponId,
                                                activate: !coupon.isActive,
                                            })
                                        }
                                    >
                                        {coupon.isActive ? (
                                            <>
                                                <PowerOff
                                                    aria-hidden="true"
                                                    className="mr-2 h-4 w-4"
                                                />
                                                Deactivate
                                            </>
                                        ) : (
                                            <>
                                                <Power aria-hidden="true" className="mr-2 h-4 w-4" />
                                                Activate
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive"
                                        onClick={() => handleDelete(coupon)}
                                    >
                                        <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        footer={
                            pagination ? (
                                <OpsPager
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={setPage}
                                    disabled={isFetching}
                                />
                            ) : null
                        }
                    />
                )}
            </div>

            <CouponFormDialog open={formOpen} onOpenChange={setFormOpen} coupon={editingCoupon} />
        </LearningSurface>
    );
}
