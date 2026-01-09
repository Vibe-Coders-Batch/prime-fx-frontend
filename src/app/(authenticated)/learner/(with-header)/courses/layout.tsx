import type { Metadata } from "next";

const siteUrl = "https://paet.ltd";
const siteName = "PRIME E-Learning & Training";

export const metadata: Metadata = {
  title: "Browse Courses | PRIME E-Learning & Training",
  description:
    "Explore our comprehensive collection of trading courses, financial literacy programs, and professional development training. From beginner to advanced institutional strategies.",
  alternates: {
    canonical: `${siteUrl}/learner/courses`,
  },
  openGraph: {
    title: "Browse Courses | PRIME E-Learning & Training",
    description:
      "Discover courses in trading, financial literacy, and professional development. Institutional-grade education for all skill levels.",
    url: `${siteUrl}/learner/courses`,
    siteName: siteName,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
