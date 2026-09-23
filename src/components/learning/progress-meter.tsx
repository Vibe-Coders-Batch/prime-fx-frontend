import { cn } from "@/lib/utils";

interface ProgressMeterProps {
    /** 0-100. Clamped for display only; the underlying value is never altered. */
    value: number;
    /** Accessible name, e.g. "Course progress". */
    label: string;
    /** Render the label and percentage above the track. */
    showLabel?: boolean;
    /** Secondary text shown opposite the percentage, e.g. "8 of 24 lessons". */
    detail?: string;
    size?: "sm" | "md";
    className?: string;
}

export function ProgressMeter({
    value,
    label,
    showLabel = true,
    detail,
    size = "md",
    className,
}: ProgressMeterProps) {
    const safe = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    const rounded = Math.round(safe);

    return (
        <div className={cn("space-y-1.5", className)}>
            {showLabel ? (
                <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-[var(--ls-ink-quiet)]">{detail ?? label}</span>
                    <span className="ls-nums font-medium text-[var(--ls-ink)]">{rounded}%</span>
                </div>
            ) : null}
            <div
                role="progressbar"
                aria-label={label}
                aria-valuenow={rounded}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${rounded}% complete`}
                className={cn(
                    "w-full overflow-hidden rounded-full bg-[var(--ls-neutral-tint)]",
                    size === "sm" ? "h-1" : "h-1.5",
                )}
            >
                <div
                    className="h-full rounded-full bg-[var(--ls-accent)] transition-[width] duration-300"
                    style={{ width: `${safe}%` }}
                />
            </div>
        </div>
    );
}
