"use client";
import { useState } from "react";
import { Layers, MoreHorizontal, Pencil, Plus, Power, PowerOff, Search, Trash2 } from "lucide-react";
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
import {
    useAdminCategories,
    useDeleteCategory,
    useToggleCategoryStatus,
} from "@/features/categories/admin/hooks";
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

    const columns: OpsColumn<AdminCategory>[] = [
        { key: "name", header: "Name", primary: true, cell: (c) => c.name },
        {
            key: "slug",
            header: "Slug",
            secondary: true,
            cell: (c) => <span className="font-mono text-xs">{c.slug}</span>,
        },
        { key: "courses", header: "Courses", numeric: true, cell: (c) => c.coursesCount ?? 0 },
        { key: "order", header: "Order", numeric: true, cell: (c) => c.displayOrder ?? 0 },
        {
            key: "status",
            header: "Status",
            badge: true,
            cell: (c) =>
                c.isActive ? (
                    <StatusPill tone="ok">Active</StatusPill>
                ) : (
                    <StatusPill tone="neutral">Inactive</StatusPill>
                ),
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Categories"
                description="Manage dynamic categories used across courses and coupons"
                actions={
                    <Button onClick={handleCreate}>
                        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                        Create Category
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
                                aria-label="Search categories"
                                placeholder="Search categories..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 pl-8"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger
                                aria-label="Filter categories by status"
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
                    shown={categories.length}
                    noun="category"
                    plural="categories"
                />

                {isLoading ? (
                    <DataTableSkeleton columnCount={6} rowCount={10} />
                ) : categories.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No categories found"
                            description="Create your first category to organize courses."
                            icon={<Layers className="h-12 w-12" />}
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption={`Course categories, page ${pagination?.page ?? 1} of ${pagination?.totalPages ?? 1}`}
                        columns={columns}
                        rows={categories}
                        getRowKey={(c) => c.categoryId}
                        isFetching={isFetching}
                        renderActions={(c) => (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                                        <span className="sr-only">Actions for {c.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(c)}>
                                        <Pencil aria-hidden="true" className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            toggleStatus.mutate({
                                                categoryId: c.categoryId,
                                                activate: !c.isActive,
                                            })
                                        }
                                    >
                                        {c.isActive ? (
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
                                        onClick={() => handleDelete(c)}
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

            <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} />
        </LearningSurface>
    );
}
