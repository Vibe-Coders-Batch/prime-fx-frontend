import type { Metadata } from "next";
import { ReferralPage } from "@/features/referral/components/ReferralPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Referral Program — MIYO Global",
  description:
    "Refer a candidate for an open MIYO Global mandate. When they are hired and onboarded, you earn a referral reward.",
  alternates: { canonical: `${siteUrl}/referral` },
  openGraph: {
    title: "MIYO Global Referral Program",
    description: "Refer talent for open mandates and earn a referral reward.",
    url: `${siteUrl}/referral`,
    type: "website",
  },
};

export default function ReferralRoutePage() {
  return <ReferralPage />;
}
