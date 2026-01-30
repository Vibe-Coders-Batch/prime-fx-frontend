import type { Metadata } from "next";

const siteUrl = "https://paet.ltd";
const siteName = "PRIME E-Learning & Training";

export const metadata: Metadata = {
  title: "Sign Up | PRIME E-Learning & Training",
  description:
    "Create your PRIME E-Learning & Training account. Start learning with expert-led courses, progress tracking, and certificates.",
  alternates: {
    canonical: `${siteUrl}/signup`,
  },
  openGraph: {
    title: "Sign Up | PRIME E-Learning & Training",
    description:
      "Start learning today with PRIME E-Learning & Training. Create your account in minutes.",
    url: `${siteUrl}/signup`,
    siteName: siteName,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
