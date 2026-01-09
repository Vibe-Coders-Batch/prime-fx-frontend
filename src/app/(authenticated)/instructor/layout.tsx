"use client";

import { PropsWithChildren } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { InstructorNavbar } from "@/components/layout/instructor-navbar";

export default function InstructorLayout({ children }: PropsWithChildren) {
  return (
    <DashboardLayout showSidebar={false} customNavbar={<InstructorNavbar />}>
      {children}
    </DashboardLayout>
  );
}
