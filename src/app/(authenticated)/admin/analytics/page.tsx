"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    LearningPageHeader,
    LearningSurface,
    Panel,
} from "@/components/learning/learning-surface";

export default function AnalyticsPage() {
    return (
        <LearningSurface>
            <LearningPageHeader
                title="Analytics and reporting"
                description="Analytics have been merged into the Dashboard."
            />
            <Panel className="p-8 text-center">
                <p className="text-sm text-[var(--ls-ink-quiet)]">
                    Analytics are now integrated into the Admin Dashboard.
                </p>
                <Link href="/admin/dashboard" className="mt-5 inline-block">
                    <Button>Go to Dashboard</Button>
                </Link>
            </Panel>
        </LearningSurface>
    );
}
