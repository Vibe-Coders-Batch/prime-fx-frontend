"use client";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Power, PowerOff, Layers } from "lucide-react";
import { useState } from "react";
import { useAdminCategories, useDeleteCategory, useToggleCategoryStatus } from "@/features/categories/admin/hooks";
import type { AdminCategory } from "@/features/categories/admin/types";
import { CategoryFormDialog } from "@/features/categories/admin/category-form-dialog";
export default function AdminCategoriesPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<AdminCategory | null>(null);
    const { data, isLoading, isFetching } = useAdminCategories({
        search: debouncedSearch || undefined,
        isActive: statusFilter === "all" ? undefined : statusFilter === "active",
        page,
        limit: 50,
    });
    const toggleStatus = useToggleCategoryStatus();
    const deleteCategory = useDeleteCategory();
    const categories = data?.data || [];
    const pagination = data?.pagination;
    const handleEdit = (c: AdminCategory) => {
        setEditing(c);
        setFormOpen(true);
    };
    const handleCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };
    const handleDelete = (c: AdminCategory) => {
        if (confirm(`Delete category "${c.name}"? This is a soft delete.`)) {
            deleteCategory.mutate(c.categoryId);
        }
    };
    return (<PageLayout header="Categories" description="Manage dynamic categories used across courses and coupons">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"/>
              <Input placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9"/>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} className="h-9">
            <Plus className="h-4 w-4 mr-2"/>
            Create Category
          </Button>
        </div>

        {isLoading ? (<DataTableSkeleton columnCount={6} rowCount={10}/>) : categories.length === 0 ? (<EmptyState title="No categories found" description="Create your first category to organize courses." icon={<Layers className="h-12 w-12"/>}/>) : (<Card>
            <CardContent className="p-0">
              <div className={cn("overflow-x-auto", isFetching && "opacity-50")}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((c) => (<TableRow key={c.categoryId}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{c.slug}</TableCell>
                        <TableCell>{c.coursesCount ?? 0}</TableCell>
                        <TableCell>{c.displayOrder ?? 0}</TableCell>
                        <TableCell>
                          {c.isActive ? (<Badge className="bg-green-500">Active</Badge>) : (<Badge variant="secondary">Inactive</Badge>)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4"/>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(c)}>
                                <Pencil className="h-4 w-4 mr-2"/>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleStatus.mutate({
                    categoryId: c.categoryId,
                    activate: !c.isActive,
                })}>
                                {c.isActive ? (<>
                                    <PowerOff className="h-4 w-4 mr-2"/>
                                    Deactivate
                                  </>) : (<>
                                    <Power className="h-4 w-4 mr-2"/>
                                    Activate
                                  </>)}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(c)}>
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {pagination && pagination.totalPages > 1 && (<div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pagination.page === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={pagination.page === pagination.totalPages}>
                    Next
                  </Button>
                </div>
              </div>)}
          </Card>)}
      </div>

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing}/>
    </PageLayout>);
}
