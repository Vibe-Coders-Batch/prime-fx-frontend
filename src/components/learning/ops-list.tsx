import { Fragment, type ReactNode } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Panel } from "./learning-surface";
import { cn } from "@/lib/utils";

export interface OpsColumn<T> {
    /** Stable identity for the column. */
    key: string;
    header: string;
    cell: (row: T) => ReactNode;
    /** Right-align and use tabular figures: dates, money, counts. */
    numeric?: boolean;
    /** The record's title on narrow screens. Exactly one column should set it. */
    primary?: boolean;
    /** Sits under the title on narrow screens rather than in the field list. */
    secondary?: boolean;
    /** Sits beside the title on narrow screens: status pills. */
    badge?: boolean;
    /** Kept in the table but dropped from the narrow-screen field list. */
    hideOnNarrow?: boolean;
    headerClassName?: string;
}

interface OpsListProps<T> {
    /** Screen-reader caption naming the table and its position in the set. */
    caption: string;
    columns: OpsColumn<T>[];
    rows: T[];
    getRowKey: (row: T) => string;
    /** Row actions, repeated in both presentations. */
    renderActions?: (row: T) => ReactNode;
    actionsHeader?: string;
    /** Dim and freeze the list while a background refetch is in flight. */
    isFetching?: boolean;
    /** Width at which the dense table replaces the record list. */
    breakpoint?: "md" | "lg";
    footer?: ReactNode;
}

/**
 * One data set, two presentations: a dense semantic table on wide screens and
 * labelled records on narrow ones, where a horizontally scrolling table would
 * push the row actions out of reach. Both are built from the same columns, so
 * neither can silently lose a field.
 */
export function OpsList<T>({
    caption,
    columns,
    rows,
    getRowKey,
    renderActions,
    actionsHeader = "Actions",
    isFetching,
    breakpoint = "md",
    footer,
}: OpsListProps<T>) {
    const tableOnly = breakpoint === "lg" ? "hidden lg:block" : "hidden md:block";
    const recordsOnly = breakpoint === "lg" ? "lg:hidden" : "md:hidden";

    const primary = columns.find((c) => c.primary) ?? columns[0];
    const secondaries = columns.filter((c) => c.secondary);
    const badges = columns.filter((c) => c.badge);
    const fields = columns.filter(
        (c) => !c.primary && !c.secondary && !c.badge && !c.hideOnNarrow && c !== primary,
    );

    return (
        <Panel className="overflow-hidden">
            <div className={cn(isFetching && "pointer-events-none opacity-50")}>
                <div className={tableOnly}>
                    <Table>
                        <TableCaption className="sr-only">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow className="border-[var(--ls-divider)]">
                                {columns.map((column) => (
                                    <TableHead
                                        key={column.key}
                                        className={cn(
                                            "text-[var(--ls-ink-quiet)]",
                                            column.numeric && "text-right",
                                            column.headerClassName,
                                        )}
                                    >
                                        {column.header}
                                    </TableHead>
                                ))}
                                {renderActions ? (
                                    <TableHead className="text-right text-[var(--ls-ink-quiet)]">
                                        {actionsHeader}
                                    </TableHead>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={getRowKey(row)}
                                    className="border-[var(--ls-divider)] hover:bg-[var(--ls-paper-quiet)]"
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            className={cn(
                                                column === primary
                                                    ? "font-medium text-[var(--ls-ink)]"
                                                    : "text-[var(--ls-ink-quiet)]",
                                                column.numeric && "ls-nums text-right",
                                            )}
                                        >
                                            {column.cell(row)}
                                        </TableCell>
                                    ))}
                                    {renderActions ? (
                                        <TableCell className="text-right">
                                            <div className="flex flex-wrap justify-end gap-2">
                                                {renderActions(row)}
                                            </div>
                                        </TableCell>
                                    ) : null}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <ul className={cn("divide-y divide-[var(--ls-divider)]", recordsOnly)}>
                    {rows.map((row) => (
                        <li key={getRowKey(row)} className="space-y-3 p-4">
                            <div className="space-y-1.5">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="min-w-0 font-medium text-[var(--ls-ink)]">
                                        {primary.cell(row)}
                                    </p>
                                    {badges.length > 0 ? (
                                        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                                            {badges.map((column) => (
                                                <Fragment key={column.key}>
                                                    {column.cell(row)}
                                                </Fragment>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                                {secondaries.map((column) => (
                                    <p
                                        key={column.key}
                                        className="truncate text-sm text-[var(--ls-ink-quiet)]"
                                    >
                                        {column.cell(row)}
                                    </p>
                                ))}
                            </div>

                            {fields.length > 0 ? (
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    {fields.map((column) => (
                                        <Fragment key={column.key}>
                                            <dt className="text-[var(--ls-ink-quiet)]">
                                                {column.header}
                                            </dt>
                                            <dd
                                                className={cn(
                                                    "truncate text-right text-[var(--ls-ink)]",
                                                    column.numeric && "ls-nums",
                                                )}
                                            >
                                                {column.cell(row)}
                                            </dd>
                                        </Fragment>
                                    ))}
                                </dl>
                            ) : null}

                            {renderActions ? (
                                <div className="flex gap-2">{renderActions(row)}</div>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </div>
            {footer}
        </Panel>
    );
}

interface OpsPagerProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export function OpsPager({ currentPage, totalPages, onPageChange, disabled }: OpsPagerProps) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between border-t border-[var(--ls-divider)] px-4 py-3">
            <div className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || disabled}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || disabled}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

interface ResultCountProps {
    isLoading?: boolean;
    isError?: boolean;
    total?: number;
    shown: number;
    /** Singular noun, e.g. "user". Pluralised with a trailing s. */
    noun: string;
    plural?: string;
}

export function ResultCount({
    isLoading,
    isError,
    total,
    shown,
    noun,
    plural,
}: ResultCountProps) {
    const many = plural ?? `${noun}s`;
    const text = isLoading
        ? `Loading ${many}…`
        : isError
          ? `${many.charAt(0).toUpperCase()}${many.slice(1)} could not be loaded`
          : total !== undefined
            ? `${total} ${total === 1 ? noun : many}`
            : `${shown} shown`;
    return (
        <p aria-live="polite" className="ls-nums text-sm text-[var(--ls-ink-quiet)]">
            {text}
        </p>
    );
}
