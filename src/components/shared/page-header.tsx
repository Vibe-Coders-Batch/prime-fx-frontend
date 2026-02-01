"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}
export function PageHeader({ title, subtitle, description, actions, className, }: PageHeaderProps) {
    return (<div className={cn("mb-8 space-y-2", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          {subtitle && (<p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {subtitle}
            </p>)}
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (<p className="text-lg text-muted-foreground max-w-3xl mt-2">
              {description}
            </p>)}
        </div>
        {actions && (<div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>)}
      </div>
    </div>);
}
