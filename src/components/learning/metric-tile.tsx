import { cn } from "@/lib/utils";
import { Panel } from "./learning-surface";

interface MetricTileProps {
    label: string;
    value: string | number;
    /** Quiet one-line gloss under the value. */
    hint?: string;
    className?: string;
}

/**
 * A single number, stated plainly. No gradient fill, no icon medallion: the
 * figure is the content and everything else is scaffolding around it.
 */
export function MetricTile({ label, value, hint, className }: MetricTileProps) {
    return (
        <Panel className={cn("p-4", className)}>
            <p className="text-sm text-[var(--ls-ink-quiet)]">{label}</p>
            <p className="ls-nums mt-1 text-2xl font-semibold tracking-tight text-[var(--ls-ink)]">
                {value}
            </p>
            {hint ? <p className="mt-0.5 text-xs text-[var(--ls-ink-quiet)]">{hint}</p> : null}
        </Panel>
    );
}
