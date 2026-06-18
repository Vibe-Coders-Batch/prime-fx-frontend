import type { Metadata } from "next";
import { IndiaStaffingPage } from "@/features/staffing/components/IndiaStaffingPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "IT Staffing Agency India | Scale Tech & GCC Talent | Prime Learning",
  description:
    "Scaling India’s finest talent for enterprises, startups, and GCC captive centres. GCC setup, digital transformation hiring, high-volume staffing, and executive search with full Indian statutory compliance.",
  alternates: {
    canonical: `${siteUrl}/india-staffing`,
  },
  openGraph: {
    title: "IT Staffing Agency India | Prime Learning",
    description:
      "Partner with India’s top-tier tech, engineering, and leadership talent. GCC captive setup, lateral staffing, and compliance-ready delivery.",
    type: "website",
    url: `${siteUrl}/india-staffing`,
  },
  twitter: {
    card: "summary_large_image",
    title: "IT Staffing Agency India | Prime Learning",
    description:
      "Scaling India’s finest talent for enterprises, startups, and GCC captive centres.",
  },
};

export default function IndiaStaffingRoutePage() {
  return <IndiaStaffingPage />;
}
