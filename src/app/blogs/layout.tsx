import { ReactNode } from "react";
import "@/features/prime-landing/PrimeLandingStyles.module.css";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Footer } from "@/features/prime-landing/components/ui/Footer";

export default function BlogsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="primeLanding flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--ink)" }}
    >
      <MarketingNav variant="static" />
      <main className="flex-1 pt-32 sm:pt-40 lg:pt-48">{children}</main>
      <Footer />
    </div>
  );
}
