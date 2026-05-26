"use client";
import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  CreditCard,
  BarChart3,
  Shield,
  Settings,
  Tag,
  Layers,
  Pen,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

const fullAdminItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { label: "Courses", href: "/admin/courses", icon: <BookOpen className="h-4 w-4" /> },
  { label: "Categories", href: "/admin/categories", icon: <Layers className="h-4 w-4" /> },
  { label: "Companies", href: "/admin/companies", icon: <Building2 className="h-4 w-4" /> },
  { label: "Enrollments", href: "/admin/enrollments", icon: <Users className="h-4 w-4" /> },
  { label: "Payments", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Coupons", href: "/admin/coupons", icon: <Tag className="h-4 w-4" /> },
  { label: "Blog", href: "/admin/blogs", icon: <Pen className="h-4 w-4" /> },
  { label: "Moderation", href: "/admin/moderation", icon: <Shield className="h-4 w-4" /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const contentAdminItems = [
  { label: "Blog", href: "/admin/blogs", icon: <Pen className="h-4 w-4" /> },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const sidebarItems = useMemo(() => {
    if (user?.role === "CONTENT_ADMIN") return contentAdminItems;
    return fullAdminItems;
  }, [user?.role]);

  return (
    <DashboardLayout showSidebar sidebarItems={sidebarItems} showNavbar={false}>
      {children}
    </DashboardLayout>
  );
}
