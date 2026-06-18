import type { Metadata } from "next";
import { EventsPage } from "@/features/events/components/EventsPage";

const siteUrl = "https://primelearning.ae";

export const metadata: Metadata = {
  title: "Events | Live Cohorts",
  description:
    "Prime Learning live cohorts across India, the UAE, and globally. Agentic AI programmes built for production outcomes.",
  alternates: { canonical: `${siteUrl}/events` },
  openGraph: {
    title: "Prime Learning Events",
    description: "Live cohorts across India, UAE, and global intake.",
    url: `${siteUrl}/events`,
    type: "website",
  },
};

export default function EventsRoutePage() {
  return <EventsPage />;
}
