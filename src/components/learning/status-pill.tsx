import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusTone = "neutral" | "accent" | "ok" | "warn" | "risk";

const toneStyles: Record<StatusTone, string> = {
    neutral: "bg-[var(--ls-neutral-tint)] text-[var(--ls-ink-quiet)]",
    accent: "bg-[var(--ls-accent-tint)] text-[var(--ls-accent-ink)]",
    ok: "bg-[var(--ls-ok-tint)] text-[var(--ls-ok)]",
    warn: "bg-[var(--ls-warn-tint)] text-[var(--ls-warn)]",
    risk: "bg-[var(--ls-risk-tint)] text-[var(--ls-risk)]",
};

interface StatusPillProps {
    tone?: StatusTone;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

/**
 * Quiet status marker. Colour is never the only signal: every pill also
 * carries its own text label so it survives greyscale and screen readers.
 */
export function StatusPill({ tone = "neutral", icon, children, className }: StatusPillProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
                toneStyles[tone],
                className,
            )}
        >
            {icon ? (
                <span aria-hidden="true" className="flex shrink-0 items-center">
                    {icon}
                </span>
            ) : null}
            {children}
        </span>
    );
}
