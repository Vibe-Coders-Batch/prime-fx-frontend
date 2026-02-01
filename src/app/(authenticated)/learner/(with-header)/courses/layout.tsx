import type { Metadata } from "next";
import { PropsWithChildren } from "react";
const siteUrl = "https://paet.ltd";
const siteName = "Prime Learning";
export const metadata: Metadata = {
    title: "Browse Courses | Prime Learning",
    description: "Explore our collection of courses across business, technology, finance, design, and professional skills.",
    alternates: {
        canonical: `${siteUrl}/learner/courses`,
    },
    openGraph: {
        title: "Browse Courses | Prime Learning",
        description: "Discover courses across business, technology, finance, design, and professional development.",
        url: `${siteUrl}/learner/courses`,
        siteName: siteName,
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};
export default function CoursesLayout({ children }: PropsWithChildren) {
    return <>{children}</>;
}
