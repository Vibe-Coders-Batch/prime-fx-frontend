"use client";
import { QueryProvider } from "@/lib/providers/query-provider";
import { RegionProvider } from "@/context/RegionContext";
import { Toaster } from "sonner";
export function Providers({ children }: {
    children: React.ReactNode;
}) {
    return (<QueryProvider>
      <RegionProvider>
        {children}
      </RegionProvider>
      <Toaster position="top-right"/>
    </QueryProvider>);
}
