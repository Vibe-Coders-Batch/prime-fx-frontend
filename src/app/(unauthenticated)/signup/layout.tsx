import type { Metadata } from "next";

const siteUrl = "https://paet.ltd";
const siteName = "PRIME E-Learning & Training";

export const metadata: Metadata = {
  title: "Sign Up | PRIME E-Learning & Training",
  description:
    "Create your PRIME E-Learning & Training account. Start your journey to financial literacy with institutional-grade education, live trading sessions, and expert mentorship.",
  alternates: {
    canonical: `${siteUrl}/signup`,
  },
  openGraph: {
    title: "Sign Up | PRIME E-Learning & Training",
    description:
      "Join thousands of learners mastering global markets. Create your free account today.",
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
