"use client";

import { PropsWithChildren } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LearnerNavbar } from "@/components/layout/learner-navbar";

export default function MyCoursesLayout({ children }: PropsWithChildren) {
  return (
    <DashboardLayout showSidebar={false} customNavbar={<LearnerNavbar />}>
      {children}
    </DashboardLayout>
  );
}
