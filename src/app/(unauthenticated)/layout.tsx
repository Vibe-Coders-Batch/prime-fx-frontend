import type { Metadata } from "next";

const siteUrl = "https://paet.ltd";
const siteName = "PRIME E-Learning & Training";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: siteName,
    locale: "en_US",
    type: "website",
  },
};

export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
