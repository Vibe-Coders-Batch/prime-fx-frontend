"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/page-transition";
interface PageLayoutProps {
    children: ReactNode;
    header?: string;
    subtitle?: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
    containerClassName?: string;
    enableTransition?: boolean;
}
export function PageLayout({ children, header, subtitle, description, actions, className, containerClassName, enableTransition = true, }: PageLayoutProps) {
    const content = (<>
      {(header || subtitle || description || actions) && (<div className="mb-4 space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              {subtitle && (<p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {subtitle}
                </p>)}
              {header && (<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground ">
                  {header}
                </h1>)}
              {description && (<p className="text-sm sm:text-base md:text-lg text-muted-foreground ">
                  {description}
                </p>)}
            </div>
            {actions && (<div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                {actions}
              </div>)}
          </div>
        </div>)}
      <div className={cn("space-y-4 sm:space-y-6 w-full max-w-full", className)}>
        {children}
      </div>
    </>);
    const wrappedContent = enableTransition ? (<PageTransition>{content}</PageTransition>) : (content);
    return (<div className={cn("min-h-screen bg-background w-full max-w-full", containerClassName)}>
      <div className={cn("container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 w-full max-w-full", containerClassName)}>
        {wrappedContent}
      </div>
    </div>);
}
