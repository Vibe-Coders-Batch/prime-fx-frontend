import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  illustration?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  illustration,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in duration-500",
        className
      )}
    >
      {illustration ? (
        <div className="relative h-48 w-48 mb-6">
          <Image
            src={illustration}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>
      ) : icon ? (
        <div className="mb-4 text-muted-foreground">{icon}</div>
      ) : null}
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-8 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="default" size="lg" className="px-8">
          {action.label}
        </Button>
      )}
    </div>
  );
}

