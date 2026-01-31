import type { Metadata } from "next";
const siteUrl = "https://paet.ltd";
const siteName = "Prime Learning";
export const metadata: Metadata = {
    title: "Login | Prime Learning",
    description: "Sign in to your Prime Learning account. Access your courses, learning progress, and certificates.",
    alternates: {
        canonical: `${siteUrl}/login`,
    },
    openGraph: {
        title: "Login | Prime Learning",
        description: "Sign in to access your courses and learning tools at Prime Learning.",
        url: `${siteUrl}/login`,
        siteName: siteName,
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};
export default function LoginLayout({ children, }: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
