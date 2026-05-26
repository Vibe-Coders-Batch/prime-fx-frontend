import type { Metadata } from "next";
import { LeadershipPage } from "@/features/leadership/components/LeadershipPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Leadership — Prime Learning Core Team",
  description:
    "Meet the Prime Learning leadership team — operators and mentors building premium learning programmes across India, the UAE, and globally.",
  alternates: {
    canonical: `${siteUrl}/leadership`,
  },
  openGraph: {
    title: "Prime Learning Leadership",
    description:
      "Meet the operators behind Prime Learning — programmes built for India, the UAE, and professionals worldwide.",
    type: "website",
    url: `${siteUrl}/leadership`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Learning Leadership",
    description:
      "Meet the operators behind Prime Learning — programmes built for India, the UAE, and professionals worldwide.",
  },
};

export default function LeadershipRoutePage() {
  return <LeadershipPage />;
}
