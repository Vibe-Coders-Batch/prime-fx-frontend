"use client";
import { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { OpsList, ResultCount, type OpsColumn } from "@/components/learning/ops-list";
import { StatusPill } from "@/components/learning/status-pill";
import { sentenceCaseEnum } from "@/components/learning/format";
import { useUsers } from "@/features/users/hooks/use-users";
import { useAuthStore } from "@/lib/store/auth-store";

/** The row shape this list actually receives, taken from the hook. */
type UserRow = NonNullable<ReturnType<typeof useUsers>["data"]>["data"][number];

function displayName(user: UserRow) {
    if (!user.firstName && !user.lastName) return "N/A";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
}

export default function CorporateUserManagementPage() {
    const { user } = useAuthStore();
    const [search, setSearch] = useState("");

    const { data: usersData, isLoading } = useUsers({
        enabled: true,
        filters: {
            search: search || undefined,
            companyId: user?.companyId ?? undefined,
            page: 1,
            limit: 100,
        },
    });

    const rows = usersData?.data ?? [];

    const columns: OpsColumn<UserRow>[] = [
        { key: "name", header: "Name", primary: true, cell: displayName },
        { key: "email", header: "Email", secondary: true, cell: (u) => u.email },
        {
            key: "role",
            header: "Role",
            badge: true,
            cell: (u) => <StatusPill tone="neutral">{sentenceCaseEnum(u.role)}</StatusPill>,
        },
        {
            key: "status",
            header: "Status",
            badge: true,
            cell: (u) =>
                u.emailVerified ? (
                    <StatusPill tone="ok">Active</StatusPill>
                ) : (
                    <StatusPill tone="neutral">Pending</StatusPill>
                ),
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                eyebrow="Corporate"
                title="User management"
                description="Manage your company's users and their course access."
                actions={
                    <Button
                        onClick={() => {
                            toast.info(
                                "Add users feature coming soon. You'll be able to add users via CSV upload or manual entry.",
                            );
                        }}
                    >
                        <UserPlus aria-hidden="true" className="mr-2 h-4 w-4" />
                        Add Users
                    </Button>
                }
            />

            <div className="space-y-4">
                <Panel className="p-4">
                    <div className="relative">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ls-ink-quiet)]"
                        />
                        <Input
                            aria-label="Search users by email"
                            placeholder="Search by email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </Panel>

                <ResultCount
                    isLoading={isLoading}
                    total={rows.length}
                    shown={rows.length}
                    noun="user"
                />

                {isLoading ? (
                    <DataTableSkeleton columnCount={5} rowCount={10} />
                ) : rows.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No users found"
                            description="Add users to your company account to get started."
                            icon={<Users className="h-12 w-12" />}
                            action={{ label: "Add Users", onClick: () => {} }}
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption="Company users"
                        columns={columns}
                        rows={rows}
                        getRowKey={(u) => u.id}
                        renderActions={(u) => (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    toast.info(
                                        `User management for ${u.email}: feature coming soon`,
                                    );
                                }}
                            >
                                Manage
                                <span className="sr-only"> {displayName(u)}</span>
                            </Button>
                        )}
                    />
                )}
            </div>
        </LearningSurface>
    );
}
