"use client";
import { useState } from "react";
import { Building2, Search } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";
import { OpsList, ResultCount, type OpsColumn } from "@/components/learning/ops-list";
import { useCompanies, useDeleteCompany } from "@/features/companies/hooks/use-companies";
import type { Company } from "@/features/companies/types";
import { EditCompanyDialog } from "@/features/companies/components/edit-company-dialog";
import { useDebounce } from "@/hooks/use-debounce";

export default function CompanyManagementPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: companiesData, isLoading } = useCompanies({
        enabled: true,
        filters: {
            search: debouncedSearch || undefined,
            page: 1,
            limit: 50,
        },
    });
    const deleteCompany = useDeleteCompany();

    const handleEditClick = (company: Company) => {
        setEditingCompany(company);
        setIsEditOpen(true);
    };

    const companies: Company[] = Array.isArray(companiesData) ? companiesData : [];
    const isEmpty = !companiesData || companies.length === 0;

    const columns: OpsColumn<Company>[] = [
        { key: "name", header: "Name", primary: true, cell: (company) => company.name },
        {
            key: "email",
            header: "Email",
            secondary: true,
            cell: (company) => company.email || "N/A",
        },
        { key: "phone", header: "Phone", cell: (company) => company.phone || "N/A" },
        {
            key: "created",
            header: "Created",
            numeric: true,
            cell: (company) => new Date(company.createdAt).toLocaleDateString(),
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Company management"
                description="Manage corporate accounts and their enrollments."
                actions={
                    <Button
                        onClick={() => {
                            toast.info(
                                "Add company feature coming soon. You'll be able to create new corporate accounts.",
                            );
                        }}
                    >
                        <Building2 aria-hidden="true" className="mr-2 h-4 w-4" />
                        Add Company
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
                            aria-label="Search companies by name"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </Panel>

                <ResultCount
                    isLoading={isLoading}
                    shown={companies.length}
                    total={companies.length}
                    noun="company"
                    plural="companies"
                />

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                    </div>
                ) : isEmpty ? (
                    <Panel>
                        <EmptyState
                            title="No companies found"
                            description="Corporate accounts will appear here once created."
                            icon={<Building2 className="h-12 w-12" />}
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption="Corporate accounts"
                        columns={columns}
                        rows={companies}
                        getRowKey={(company) => company.id}
                        renderActions={(company) => (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditClick(company)}
                                >
                                    Edit
                                    <span className="sr-only"> {company.name}</span>
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={deleteCompany.isPending}
                                    onClick={async () => {
                                        if (
                                            confirm(
                                                `Are you sure you want to delete ${company.name}?`,
                                            )
                                        ) {
                                            try {
                                                await deleteCompany.mutateAsync(company.id);
                                            } catch {
                                                // Surfaced through the mutation's error state.
                                            }
                                        }
                                    }}
                                >
                                    <span className="hidden sm:inline">
                                        {deleteCompany.isPending ? "Deleting..." : "Delete"}
                                    </span>
                                    <span className="sm:hidden">Del</span>
                                    <span className="sr-only"> {company.name}</span>
                                </Button>
                            </>
                        )}
                    />
                )}

                <EditCompanyDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    company={editingCompany}
                />
            </div>
        </LearningSurface>
    );
}
