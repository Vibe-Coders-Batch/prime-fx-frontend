import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/components/ContactPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Contact Prime Learning | Offices, Emails & Support",
  description:
    "Get in touch with Prime Learning. Email channels for learning and partnerships, our Hyderabad offices, and presence across India and the UAE.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact Prime Learning",
    description:
      "Reach the right team at Prime Learning: support, partnerships, offices, and direct lines across India and the UAE.",
    type: "website",
    url: `${siteUrl}/contact`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Prime Learning",
    description:
      "Reach the right team at Prime Learning: support, partnerships, and our offices across India and the UAE.",
  },
};

export default function ContactRoutePage() {
  return <ContactPage />;
}
