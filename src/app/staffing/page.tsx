import type { Metadata } from "next";
import { StaffingPage } from "@/features/staffing/components/StaffingPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Staffing | India & UAE Workforce Solutions | Prime Learning",
  description:
    "Prime Learning staffing for India tech scaling and UAE GCC enterprise mobilisation. Partner with us for compliant, high-velocity talent delivery.",
  alternates: {
    canonical: `${siteUrl}/staffing`,
  },
  openGraph: {
    title: "Prime Learning Staffing",
    description:
      "Group workforce capabilities across India and the Middle East, with regional hubs for tech scaling and GCC compliance.",
    type: "website",
    url: `${siteUrl}/staffing`,
  },
};

export default function Page() {
  return <StaffingPage />;
}
