import type { Metadata } from "next";
import { SpotlightPage } from "@/features/spotlight/components/SpotlightPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Spotlight | Instructor Faculty",
  description:
    "Meet the Prime Learning instructor faculty, practitioners from leading product and engineering teams.",
  alternates: { canonical: `${siteUrl}/spotlight` },
  openGraph: {
    title: "Prime Learning Spotlight",
    description: "Instructor spotlight: practitioners who teach what they ship.",
    url: `${siteUrl}/spotlight`,
    type: "website",
  },
};

export default function SpotlightRoutePage() {
  return <SpotlightPage />;
}
