import type { Metadata } from "next";
import { StaffingPage } from "@/features/staffing/components/StaffingPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Staffing — India & Middle East Workforce Solutions | Prime Learning",
  description:
    "Corporate overview of Prime Learning staffing capabilities. Explore dedicated regional hubs for India tech scaling and Middle East GCC enterprise mobilisation.",
  alternates: {
    canonical: `${siteUrl}/staffing`,
  },
  openGraph: {
    title: "Prime Learning Staffing",
    description:
      "Group workforce capabilities across India and the Middle East — regional hubs for tech scaling and GCC compliance.",
    type: "website",
    url: `${siteUrl}/staffing`,
  },
};

export default function Page() {
  return <StaffingPage />;
}
