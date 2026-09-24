"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { OpsList, OpsPager, ResultCount, type OpsColumn } from "@/components/learning/ops-list";
import { StatusPill } from "@/components/learning/status-pill";
import { sentenceCaseEnum } from "@/components/learning/format";
import { useUsers } from "@/features/users/hooks/use-users";
import type { User } from "@/features/users/types";
import { EditUserDialog } from "@/features/users/components/edit-user-dialog";
import { useDebounce } from "@/hooks/use-debounce";

function displayName(user: User) {
    if (!user.firstName && !user.lastName) return "N/A";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
}

export default function AdminUserManagementPage() {
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 20;
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: usersData, isLoading, isFetching } = useUsers({
        enabled: true,
        filters: {
            search: debouncedSearch || undefined,
            role: roleFilter === "all" ? undefined : roleFilter,
            page,
            limit,
        },
    });

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsEditOpen(true);
    };
    const handleRoleChange = (value: string) => {
        setRoleFilter(value);
        setPage(1);
    };

    const usersArray: User[] = Array.isArray(usersData)
        ? usersData
        : (usersData as any)?.data || [];
    const totalPages = (usersData as any)?.pagination?.totalPages || 1;
    const currentPage = (usersData as any)?.pagination?.page || 1;
    const total = (usersData as any)?.pagination?.total;

    const columns: OpsColumn<User>[] = [
        { key: "name", header: "Name", primary: true, cell: displayName },
        { key: "email", header: "Email", secondary: true, cell: (user) => user.email },
        {
            key: "role",
            header: "Role",
            badge: true,
            cell: (user) => <StatusPill tone="neutral">{sentenceCaseEnum(user.role)}</StatusPill>,
        },
        {
            key: "status",
            header: "Status",
            badge: true,
            cell: (user) =>
                user.emailVerified ? (
                    <StatusPill tone="ok">Verified</StatusPill>
                ) : (
                    <StatusPill tone="neutral">Unverified</StatusPill>
                ),
        },
        {
            key: "created",
            header: "Created",
            numeric: true,
            cell: (user) => (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"),
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="User management"
                description="Manage all platform users, roles, and permissions."
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
                                aria-label="Search users"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9 pl-8 text-sm"
                            />
                        </div>
                        {mounted ? (
                            <Select value={roleFilter} onValueChange={handleRoleChange}>
                                <SelectTrigger
                                    aria-label="Filter users by role"
                                    className="h-9 w-full text-sm md:w-[200px]"
                                >
                                    <SelectValue placeholder="All roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All roles</SelectItem>
                                    <SelectItem value="LEARNER">Learner</SelectItem>
                                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                    <SelectItem value="CORPORATE_ADMIN">Corporate admin</SelectItem>
                                    <SelectItem value="PLATFORM_ADMIN">Platform admin</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <Skeleton className="h-9 w-full md:w-[200px]" />
                        )}
                    </div>
                </Panel>

                <ResultCount
                    isLoading={isLoading}
                    total={total}
                    shown={usersArray.length}
                    noun="user"
                />

                {isLoading && !isFetching ? (
                    <DataTableSkeleton columnCount={6} rowCount={10} />
                ) : usersArray.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No users found"
                            description="Users will appear here once they register."
                            illustration="/illustrations/engineering_team.svg"
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption={`Platform users, page ${currentPage} of ${totalPages}`}
                        columns={columns}
                        rows={usersArray}
                        getRowKey={(user) => user.id}
                        isFetching={isFetching}
                        renderActions={(user) => (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => handleEditClick(user)}
                            >
                                Edit
                                <span className="sr-only"> {displayName(user)}</span>
                            </Button>
                        )}
                        footer={
                            <OpsPager
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                disabled={isFetching}
                            />
                        }
                    />
                )}

                <EditUserDialog open={isEditOpen} onOpenChange={setIsEditOpen} user={editingUser} />
            </div>
        </LearningSurface>
    );
}
