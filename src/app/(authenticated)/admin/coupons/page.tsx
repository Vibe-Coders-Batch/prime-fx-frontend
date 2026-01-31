"use client";

import { PageLayout } from "@/components/layout/page-layout";
import {
  Tag,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useCoupons,
  useToggleCouponStatus,
  useDeleteCoupon,
} from "@/features/coupons/hooks";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CouponFormDialog } from "@/features/coupons/components/coupon-form-dialog";
import { cn } from "@/lib/utils";
import type { Coupon } from "@/features/coupons/types";

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const isExpired = (validTill: string) => {
    return new Date(validTill) < new Date();
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setFormOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    if (
      confirm(`Delete coupon "${coupon.couponCode}"? This action cannot be undone.`)
    ) {
      deleteCoupon.mutate(coupon.couponId);
    }
  };

  return (
    <PageLayout
      header="Coupon Management"
      description="Create and manage discount coupons for your courses"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by coupon code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Create Coupon
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <DataTableSkeleton columnCount={7} rowCount={10} />
        ) : coupons.length === 0 ? (
          <EmptyState
            title="No coupons found"
            description="Create your first coupon to offer discounts."
            icon={<Tag className="h-12 w-12" />}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className={cn("overflow-x-auto", isFetching && "opacity-50")}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Applies To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.couponId}>
                        <TableCell className="font-mono font-medium">
                          {coupon.couponCode}
                        </TableCell>
                        <TableCell>
                          {coupon.discountType === "PERCENTAGE" ? (
                            <span>{coupon.discountValue}%</span>
                          ) : (
                            <span>${coupon.discountValue}</span>
                          )}
                          {coupon.maxDiscountAmount && (
                            <span className="text-xs text-muted-foreground ml-1">
                              (max ${coupon.maxDiscountAmount})
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>{formatDate(coupon.validFrom)}</div>
                          <div className="text-muted-foreground">
                            to {formatDate(coupon.validTill)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{coupon.usageCount}</span>
                          {coupon.usageLimit && (
                            <span className="text-muted-foreground">
                              {" "}
                              / {coupon.usageLimit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {coupon.categories.length > 0 ||
                          coupon.courses.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {coupon.categories.slice(0, 2).map((c) => (
                                <Badge
                                  key={c.categoryId}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {c.name}
                                </Badge>
                              ))}
                              {coupon.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{coupon.categories.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              All courses
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isExpired(coupon.validTill) ? (
                            <Badge variant="secondary">Expired</Badge>
                          ) : coupon.isActive ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                                <Pencil className="h-4 w-4 mr-2" />
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
                                    <PowerOff className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Power className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(coupon)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      <CouponFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        coupon={editingCoupon}
      />
    </PageLayout>
  );
}
