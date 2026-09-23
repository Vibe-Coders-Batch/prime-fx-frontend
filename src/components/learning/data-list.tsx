import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataListItem {
    label: string;
    value: ReactNode;
    /** Skip the row entirely when the underlying record has no value. */
    hidden?: boolean;
}

interface DataListProps {
    items: DataListItem[];
    /** "stack" for narrow rails, "split" for label-left / value-right rows. */
    variant?: "stack" | "split";
    className?: string;
}

/**
 * Semantic label/value pairs. Rendered as a description list so assistive
 * technology keeps the association between a field and its value.
 */
export function DataList({ items, variant = "split", className }: DataListProps) {
    const visible = items.filter((item) => !item.hidden);
    if (visible.length === 0) return null;

    return (
        <dl className={cn("divide-y divide-[var(--ls-divider)]", className)}>
            {visible.map((item) => (
                <div
                    key={item.label}
                    className={cn(
                        "py-2.5 first:pt-0 last:pb-0",
                        variant === "split"
                            ? "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
                            : "space-y-0.5",
                    )}
                >
                    <dt className="text-sm text-[var(--ls-ink-quiet)]">{item.label}</dt>
                    <dd
                        className={cn(
                            "ls-nums text-sm font-medium text-[var(--ls-ink)]",
                            variant === "split" && "text-right",
                        )}
                    >
                        {item.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
