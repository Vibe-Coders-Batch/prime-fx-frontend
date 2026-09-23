"use client";
import { useState } from "react";
import { CreditCard, Download, Search } from "lucide-react";
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
import { StatusPill, type StatusTone } from "@/components/learning/status-pill";
import { sentenceCaseEnum } from "@/components/learning/format";
import { usePayments } from "@/features/payments/hooks/use-payments";
import { useDebounce } from "@/hooks/use-debounce";

type PaymentRow = NonNullable<ReturnType<typeof usePayments>["data"]>["data"][number];

/** Settled reads as resolved, pending as in-hand, anything else as a problem. */
function paymentTone(status: string): StatusTone {
    if (status === "SUCCESS" || status === "COMPLETED") return "ok";
    if (status === "PENDING") return "warn";
    return "risk";
}

function amount(payment: PaymentRow) {
    return `${payment.currency} ${parseFloat(String(payment.amount)).toFixed(2)}`;
}

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

    const columns: OpsColumn<PaymentRow>[] = [
        {
            key: "paymentId",
            header: "Payment ID",
            primary: true,
            cell: (payment) => (
                <span className="font-mono text-xs">{payment.paymentId}</span>
            ),
        },
        { key: "amount", header: "Amount", numeric: true, cell: amount },
        {
            key: "gateway",
            header: "Gateway",
            cell: (payment) => (
                <StatusPill tone="neutral">{sentenceCaseEnum(String(payment.gateway))}</StatusPill>
            ),
        },
        {
            key: "status",
            header: "Status",
            badge: true,
            cell: (payment) => (
                <StatusPill tone={paymentTone(payment.status)}>
                    {sentenceCaseEnum(payment.status)}
                </StatusPill>
            ),
        },
        {
            key: "date",
            header: "Date",
            numeric: true,
            cell: (payment) => new Date(payment.createdAt).toLocaleDateString(),
        },
    ];

    return (
        <LearningSurface width="wide">
            <LearningPageHeader
                title="Payment management"
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
                                "payments_export",
                            );
                            toast.success("Payment data exported successfully");
                        }}
                    >
                        <Download aria-hidden="true" className="mr-2 h-4 w-4" />
                        Export CSV
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
                            aria-label="Search payments by payment ID"
                            placeholder="Search by payment ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </Panel>

                <ResultCount
                    isLoading={isLoading}
                    shown={filteredPayments.length}
                    total={filteredPayments.length}
                    noun="payment"
                />

                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16" />
                        ))}
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <Panel>
                        <EmptyState
                            title="No payments found"
                            description="Payment transactions will appear here once users make purchases."
                            icon={<CreditCard className="h-12 w-12" />}
                        />
                    </Panel>
                ) : (
                    <OpsList
                        caption="Platform payments"
                        columns={columns}
                        rows={filteredPayments}
                        getRowKey={(payment) => payment.paymentId}
                        renderActions={(payment) => (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    toast.info(
                                        `Payment details for ${payment.paymentId}: feature coming soon`,
                                    );
                                }}
                            >
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">View</span>
                            </Button>
                        )}
                    />
                )}
            </div>
        </LearningSurface>
    );
}
