import type { Metadata } from "next";
import { PrimeLandingPage } from "@/features/prime-landing/PrimeLandingPage";
const siteUrl = "https://primelearning.ae";
const siteName = "Prime Learning";
const ogDescription =
    "Premium online learning for professionals in India, the UAE, and beyond. Build real-world skills. Ship real outcomes.";
export const metadata: Metadata = {
    title: "Prime Learning | Learn Smarter. Grow Faster. Lead With Purpose.",
    description: ogDescription,
    keywords: [
        "online courses",
        "professional development",
        "career growth",
        "upskilling",
        "reskilling",
        "business and leadership",
        "technology and data",
        "finance and markets",
        "creative and design",
        "project management",
        "test preparation",
        "online courses India",
        "upskilling India",
        "AI courses Bangalore",
        "professional development India",
        "edtech India",
        "tech courses Hyderabad",
    ],
    alternates: {
        canonical: siteUrl,
        languages: {
            "en-AE": siteUrl,
            "en-IN": siteUrl,
            en: siteUrl,
        },
    },
    openGraph: {
        title: "Prime Learning | Unlock Skills That Drive Your Future",
        description: ogDescription,
        url: siteUrl,
        siteName: siteName,
        type: "website",
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: "Prime Learning | Learn Smarter. Grow Faster. Lead With Purpose.",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Prime Learning | Unlock Skills That Drive Your Future",
        description: ogDescription,
        images: [`${siteUrl}/og-image.png`],
    },
};
export default function HomePage() {
    const courseListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Featured Courses at Prime Learning",
        description: "Explore popular, outcomes-driven courses designed to build real-world skills.",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                item: {
                    "@type": "Course",
                    name: "Business Strategy and Leadership",
                    description: "Develop strategic thinking and leadership capabilities for real-world impact.",
                    provider: {
                        "@type": "Organization",
                        name: siteName,
                        url: siteUrl,
                    },
                    educationalLevel: "All levels",
                    teaches: [
                        "Strategy",
                        "Leadership",
                        "Decision Making",
                    ],
                },
            },
            {
                "@type": "ListItem",
                position: 2,
                item: {
                    "@type": "Course",
                    name: "Python for Data Science",
                    description: "Build strong foundations and create real projects using Python and data tools.",
                    provider: {
                        "@type": "Organization",
                        name: siteName,
                        url: siteUrl,
                    },
                    educationalLevel: "Beginner to Intermediate",
                    teaches: [
                        "Python",
                        "Data Analysis",
                        "Projects",
                    ],
                },
            },
            {
                "@type": "ListItem",
                position: 3,
                item: {
                    "@type": "Course",
                    name: "Digital Marketing Essentials",
                    description: "Master modern marketing channels, tools, and measurement frameworks.",
                    provider: {
                        "@type": "Organization",
                        name: siteName,
                        url: siteUrl,
                    },
                    educationalLevel: "All levels",
                    teaches: [
                        "Marketing Channels",
                        "Content Strategy",
                        "Analytics",
                    ],
                },
            },
        ],
    };
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is Prime Learning?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Prime Learning is a premium, outcomes-driven learning platform that blends academic rigor with practical application. Courses are designed to deliver skills you can use immediately.",
                },
            },
            {
                "@type": "Question",
                name: "Can I learn at my own pace?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Learn on your schedule with flexible, on-demand access across desktop, tablet, and mobile.",
                },
            },
            {
                "@type": "Question",
                name: "What topics do you cover?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "We offer courses across business and leadership, technology and data, finance and markets, creative and design, professional skills, and academic and test preparation, plus business school admissions and career pathways.",
                },
            },
            {
                "@type": "Question",
                name: "Do you provide certificates?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Track progress across your learning journey and earn certificates upon completion.",
                },
            },
        ],
    };
    return (<>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseListJsonLd),
        }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
        }}/>
      <PrimeLandingPage />
    </>);
}
