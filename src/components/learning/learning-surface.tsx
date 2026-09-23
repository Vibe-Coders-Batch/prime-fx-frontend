import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceWidth = "learner" | "wide";

const widthStyles: Record<SurfaceWidth, string> = {
    // Learner reading column plus its rail; PRD keeps prose near 680-800px.
    learner: "max-w-[1120px]",
    // Operations screens stay dense and may use the full working width.
    wide: "max-w-[1440px]",
};

interface LearningSurfaceProps {
    children: ReactNode;
    width?: SurfaceWidth;
    /** Rendered full-bleed above the padded container, e.g. a course hero. */
    bleed?: ReactNode;
    className?: string;
}

/**
 * Root wrapper for the LMS screens. Applies the scoped `.learning-surface`
 * token layer defined in globals.css, so nothing outside these routes changes.
 */
export function LearningSurface({
    children,
    width = "learner",
    bleed,
    className,
}: LearningSurfaceProps) {
    return (
        <div className="learning-surface min-h-screen bg-[var(--ls-canvas)] text-[var(--ls-ink)]">
            {bleed}
            <div className={cn("mx-auto w-full px-4 py-8 sm:px-6 lg:px-8", widthStyles[width], className)}>
                {children}
            </div>
        </div>
    );
}

interface LearningPageHeaderProps {
    eyebrow?: ReactNode;
    title: string;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function LearningPageHeader({
    eyebrow,
    title,
    description,
    actions,
    className,
}: LearningPageHeaderProps) {
    return (
        <header className={cn("mb-6 border-b border-[var(--ls-divider)] pb-5", className)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 space-y-1.5">
                    {eyebrow ? (
                        <div className="text-sm text-[var(--ls-ink-quiet)]">{eyebrow}</div>
                    ) : null}
                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--ls-ink)] sm:text-[1.75rem]">
                        {title}
                    </h1>
                    {description ? (
                        <p className="ls-measure text-sm leading-relaxed text-[var(--ls-ink-quiet)]">
                            {description}
                        </p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">{actions}</div>
                ) : null}
            </div>
        </header>
    );
}

interface PanelProps {
    children: ReactNode;
    className?: string;
}

/** Plain paper surface: one hairline border, no shadow stack, no gradient. */
export function Panel({ children, className }: PanelProps) {
    return (
        <div
            className={cn(
                "rounded-lg border border-[var(--ls-divider)] bg-[var(--ls-paper)]",
                className,
            )}
        >
            {children}
        </div>
    );
}

interface SectionHeadingProps {
    title: string;
    count?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    id?: string;
    className?: string;
}

export function SectionHeading({
    title,
    count,
    description,
    actions,
    id,
    className,
}: SectionHeadingProps) {
    return (
        <div className={cn("flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1", className)}>
            <div className="min-w-0">
                <h2 id={id} className="text-base font-semibold text-[var(--ls-ink)]">
                    {title}
                    {count !== undefined && count !== null ? (
                        <span className="ls-nums ml-2 text-sm font-normal text-[var(--ls-ink-quiet)]">
                            {count}
                        </span>
                    ) : null}
                </h2>
                {description ? (
                    <p className="mt-0.5 text-sm text-[var(--ls-ink-quiet)]">{description}</p>
                ) : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
    );
}
