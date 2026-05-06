"use client";

import { cn } from "@/features/prime-landing/lib/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
  onPaper?: boolean;
}

export function Eyebrow({ children, className, onPaper = false }: Props) {
  return (
    <span className={cn("eyebrow", onPaper && "on-paper", className)}>
      {children}
    </span>
  );
}

