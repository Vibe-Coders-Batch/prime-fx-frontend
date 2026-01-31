"use client";
import { PageLayout } from "@/components/layout/page-layout";
import { Users, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { useUsers } from "@/features/users/hooks/use-users";
import type { User } from "@/features/users/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { EditUserDialog } from "@/features/users/components/edit-user-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
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
    const usersArray = Array.isArray(usersData)
        ? usersData
        : (usersData as any)?.data || [];
    const totalPages = (usersData as any)?.pagination?.totalPages || 1;
    const currentPage = (usersData as any)?.pagination?.page || 1;
    return (<PageLayout header="User Management" description="Manage all platform users, roles, and permissions.">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none"/>
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 text-sm"/>
            </div>
            {mounted ? (<Select value={roleFilter} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                  <SelectValue placeholder="All Roles"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="LEARNER">Learner</SelectItem>
                  <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                  <SelectItem value="CORPORATE_ADMIN">
                    Corporate Admin
                  </SelectItem>
                  <SelectItem value="PLATFORM_ADMIN">Platform Admin</SelectItem>
                </SelectContent>
              </Select>) : (<Skeleton className="w-full sm:w-[160px] h-9"/>)}
          </div>
          <Button onClick={() => {
            toast.info("User creation feature coming soon. This will allow you to add new users to the platform.");
        }} className="w-full sm:w-auto h-9">
            <UserPlus className="h-4 w-4 mr-2"/>
            Add User
          </Button>
        </div>

        {isLoading && !isFetching ? (<DataTableSkeleton columnCount={6} rowCount={10}/>) : usersArray.length === 0 ? (<EmptyState title="No users found" description="Users will appear here once they register." illustration="/illustrations/engineering_team.svg"/>) : (<Card>
            <CardContent className="p-0">
              <div className={cn("overflow-x-auto", isFetching && "opacity-50 pointer-events-none")}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[100px]">Role</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell">
                        Created
                      </TableHead>
                      <TableHead className="text-right min-w-[100px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersArray.map((user: User) => (<TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName || user.lastName
                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                    : "N/A"}
                        </TableCell>
                        <TableCell className="truncate max-w-[200px]">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs rounded bg-muted">
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.emailVerified ? (<span className="text-green-600">Verified</span>) : (<span className="text-muted-foreground">
                              Unverified
                            </span>)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => handleEditClick(user)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            {totalPages > 1 && (<div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isFetching}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || isFetching}>
                    Next
                  </Button>
                </div>
              </div>)}
          </Card>)}

        <EditUserDialog open={isEditOpen} onOpenChange={setIsEditOpen} user={editingUser}/>
      </div>
    </PageLayout>);
}
