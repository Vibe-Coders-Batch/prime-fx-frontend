import type { Metadata } from "next";
import { MiddleEastStaffingPage } from "@/features/staffing/components/MiddleEastStaffingPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Staffing Agency Middle East | GCC Talent & Compliance | Prime Learning",
  description:
    "Empowering Middle East enterprises with world-class talent. Global mobilization, Saudization and Emiratisation, mega-project staffing, and executive search with Qiwa, GOSI, and MOHRE-aligned compliance.",
  alternates: {
    canonical: `${siteUrl}/middle-east-staffing`,
  },
  openGraph: {
    title: "Staffing Agency Middle East | Prime Learning",
    description:
      "Cross-border recruitment and nationalization solutions for GCC mega-projects, enterprise transformation, and localized growth.",
    type: "website",
    url: `${siteUrl}/middle-east-staffing`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Staffing Agency Middle East | Prime Learning",
    description:
      "GCC workforce mobilization, nationalization, and compliance-ready staffing from Prime Learning.",
  },
};

export default function MiddleEastStaffingRoutePage() {
  return <MiddleEastStaffingPage />;
}
