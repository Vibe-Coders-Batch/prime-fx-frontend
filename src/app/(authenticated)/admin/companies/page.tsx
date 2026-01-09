"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Building2 as BuildingIcon, Building2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useCompanies } from "@/features/companies/hooks/use-companies";
import type { Company } from "@/features/companies/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDeleteCompany } from "@/features/companies/hooks/use-companies";
import { EditCompanyDialog } from "@/features/companies/components/edit-company-dialog";

import { useDebounce } from "@/hooks/use-debounce";

export default function CompanyManagementPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  // Edit Dialog State
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

  return (
    <PageLayout
      header="Company Management"
      description="Manage corporate accounts and their enrollments."
      actions={
        <Button
          onClick={() => {
            toast.info(
              "Add company feature coming soon. You'll be able to create new corporate accounts."
            );
          }}
        >
          <BuildingIcon className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : !companiesData ||
          (Array.isArray(companiesData) && companiesData.length === 0) ? (
          <EmptyState
            title="No companies found"
            description="Corporate accounts will appear here once created."
            icon={<Building2 className="h-12 w-12" />}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="min-w-[150px] hidden sm:table-cell">Email</TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell">Phone</TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell">Created</TableHead>
                      <TableHead className="text-right min-w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(Array.isArray(companiesData) ? companiesData : []).map(
                      (company: Company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">
                            {company.name}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell truncate max-w-[200px]">{company.email || "N/A"}</TableCell>
                          <TableCell className="hidden md:table-cell">{company.phone || "N/A"}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {new Date(company.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(company)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={deleteCompany.isPending}
                                onClick={async () => {
                                  if (
                                    confirm(
                                      `Are you sure you want to delete ${company.name}?`
                                    )
                                  ) {
                                    try {
                                      await deleteCompany.mutateAsync(company.id);
                                    } catch (error: any) {
                                      // Error handled by hook
                                    }
                                  }
                                }}
                              >
                                <span className="hidden sm:inline">{deleteCompany.isPending ? "Deleting..." : "Delete"}</span>
                                <span className="sm:hidden">Del</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <EditCompanyDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          company={editingCompany}
        />
      </div>
    </PageLayout>
  );
}
