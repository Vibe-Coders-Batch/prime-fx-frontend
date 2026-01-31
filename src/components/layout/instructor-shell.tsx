"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InstructorNavbar } from "@/components/layout/instructor-navbar";
import { ReactNode } from "react";
type InstructorShellProps = {
    children: ReactNode;
};
export function InstructorShell({ children }: InstructorShellProps) {
    const pathname = usePathname();
    const router = useRouter();
    const showBackButton = ["/courses/new", "/edit", "/add", "/create"].some((path) => pathname?.includes(path));
    return (<div className="min-h-screen bg-background flex flex-col">
      <InstructorNavbar />
      <div className="flex-1 pt-16 sm:pt-20 container mx-auto px-4 py-6 max-w-7xl">
        {showBackButton && (<div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 hover:pl-2 transition-all">
              <ArrowLeft className="h-4 w-4"/>
              Back
            </Button>
          </div>)}
        {children}
      </div>
    </div>);
}
