"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
    label?: string;
    error?: string;
    description?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
    /** Overrides the id picked up from the control. */
    htmlFor?: string;
}

export function FormField({
    label,
    error,
    description,
    required,
    children,
    className,
    htmlFor,
}: FormFieldProps) {
    const reactId = React.useId();
    const childArray = React.Children.toArray(children);
    const onlyChild =
        childArray.length === 1 && React.isValidElement(childArray[0])
            ? (childArray[0] as React.ReactElement<{ id?: string }>)
            : null;

    // The label used to render with htmlFor={undefined}, leaving every control
    // in this component unnamed for assistive technology. Prefer an explicit
    // htmlFor, fall back to the control's own id, and generate one otherwise.
    const controlId = htmlFor ?? onlyChild?.props.id ?? (onlyChild ? `${reactId}-control` : undefined);
    const descriptionId = description && !error ? `${reactId}-description` : undefined;
    const errorId = error ? `${reactId}-error` : undefined;
    const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    const control = onlyChild
        ? React.cloneElement(onlyChild as React.ReactElement<Record<string, unknown>>, {
              id: controlId,
              "aria-describedby": describedBy,
              "aria-invalid": error ? true : undefined,
              "aria-required": required ? true : undefined,
          })
        : children;

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label htmlFor={controlId}>
                    {label}
                    {required && (
                        <span aria-hidden="true" className="ml-1 text-destructive">
                            *
                        </span>
                    )}
                </Label>
            )}
            {control}
            {description && !error && (
                <p id={descriptionId} className="text-xs text-muted-foreground">
                    {description}
                </p>
            )}
            {error && (
                <p id={errorId} className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
