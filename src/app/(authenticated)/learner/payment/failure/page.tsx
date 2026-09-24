"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningSurface, Panel } from "@/components/learning/learning-surface";

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <LearningSurface>
            <Panel className="mx-auto max-w-lg p-8 text-center">
                <AlertTriangle
                    aria-hidden="true"
                    className="mx-auto mb-5 h-12 w-12 text-[var(--ls-risk)]"
                    strokeWidth={1.5}
                />
                <h1 className="text-2xl font-semibold text-[var(--ls-ink)]">Payment cancelled</h1>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ls-ink-quiet)]">
                    The transaction was declined or cancelled. Don&apos;t worry, you haven&apos;t
                    been charged.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Button onClick={() => router.push("/learner/cart")} size="lg" className="w-full">
                        <RefreshCw aria-hidden="true" className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/learner/dashboard")}
                        size="lg"
                        className="w-full"
                    >
                        <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                </div>

                <p className="mt-8 text-sm text-[var(--ls-ink-quiet)]">
                    Need help?{" "}
                    {/* Was a click-only <span>, so keyboard users could not reach it. */}
                    <Link
                        href="/contact"
                        className="font-medium text-[var(--ls-accent-ink)] underline"
                    >
                        Contact support
                    </Link>
                </p>
            </Panel>
        </LearningSurface>
    );
}
