import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpotlightPage } from "@/features/spotlight/components/SpotlightPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  // Page is hidden for now: unlinked from the nav, footer and sitemap, and the
  // route below returns 404. To bring it back, drop the notFound() call, remove
  // this robots block and restore the links.
  robots: { index: false, follow: false },
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
  notFound();
  return <SpotlightPage />;
}
