import type { Metadata } from "next";

const siteUrl = "https://paet.ltd";
const siteName = "PRIME E-Learning & Training";

export const metadata: Metadata = {
  title: "Login | PRIME E-Learning & Training",
  description:
    "Sign in to your PRIME E-Learning & Training account. Access your courses, learning progress, and certificates.",
  alternates: {
    canonical: `${siteUrl}/login`,
  },
  openGraph: {
    title: "Login | PRIME E-Learning & Training",
    description:
      "Sign in to access your courses and learning tools at PRIME E-Learning & Training.",
    url: `${siteUrl}/login`,
    siteName: siteName,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
