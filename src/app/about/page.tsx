import type { Metadata } from "next";
import { AboutPage } from "@/features/about/components/AboutPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "About Prime Learning — Premium Learning, Real Outcomes",
  description:
    "Prime Learning is the education brand of Miyo Global Private Limited, building practical, mentor led programmes for professionals across India, the UAE, and beyond.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About Prime Learning",
    description:
      "The team and mission behind Prime Learning — premium, practical programmes built for India, the UAE, and a global community.",
    type: "website",
    url: `${siteUrl}/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: "About Prime Learning",
    description:
      "Premium, practical learning programmes built for India, the UAE, and professionals worldwide.",
  },
};

export default function AboutRoutePage() {
  return <AboutPage />;
}
