"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { Search, Download, CreditCard } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { toast } from "sonner";

import { useDebounce } from "@/hooks/use-debounce";

export default function PaymentManagementPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: paymentsData, isLoading } = usePayments({
    enabled: true,
    filters: {
      search: debouncedSearch || undefined,
      limit: 100,
    },
  });

  const payments = paymentsData?.data
    ? Array.isArray(paymentsData.data)
      ? paymentsData.data
      : []
    : [];
  const filteredPayments = payments.filter((payment) => {
    if (search) {
      return payment.paymentId.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <PageLayout
      header="Payment Management"
      description="Track platform revenue, transactions, and payment status."
      actions={
        <Button
          variant="outline"
          onClick={() => {
            if (filteredPayments.length === 0) {
              toast.warning("No payment data available to export");
              return;
            }
            const { exportToCSV } = require("@/lib/utils/export");
            exportToCSV(
              filteredPayments.map((p) => ({
                "Payment ID": p.paymentId,
                Amount: `${p.currency} ${p.amount.toFixed(2)}`,
                Gateway: p.gateway,
                Status: p.status,
                Date: new Date(p.createdAt).toLocaleDateString(),
              })),
              "payments_export"
            );
            toast.success("Payment data exported successfully");
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by payment ID..."
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
        ) : filteredPayments.length === 0 ? (
          <EmptyState
            title="No payments found"
            description="Payment transactions will appear here once users make purchases."
            icon={<CreditCard className="h-12 w-12" />}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.paymentId}>
                      <TableCell className="font-mono text-xs">
                        {payment.paymentId}
                      </TableCell>
                      <TableCell>
                        {payment.currency} {parseFloat(String(payment.amount)).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded bg-muted">
                          {payment.gateway}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            payment.status === "SUCCESS" ||
                            payment.status === "COMPLETED"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : payment.status === "PENDING"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.info(
                              `Payment details for ${payment.paymentId} - Feature coming soon`
                            );
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
