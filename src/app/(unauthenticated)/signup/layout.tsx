import type { Metadata } from "next";

const siteUrl = "https://paet.ltd";
const siteName = "Prime Learning";

export const metadata: Metadata = {
  title: "Sign Up | Prime Learning",
  description:
    "Create your Prime Learning account. Start learning with expert-led courses, progress tracking, and certificates.",
  alternates: {
    canonical: `${siteUrl}/signup`,
  },
  openGraph: {
    title: "Sign Up | Prime Learning",
    description:
      "Start learning today with Prime Learning. Create your account in minutes.",
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
