import type { Metadata } from "next";
import { LandingPageClient } from "@/components/sections/landing-page-client";

const siteUrl = "https://paet.ltd";
const siteName = "PRIME E-Learning & Training";

export const metadata: Metadata = {
  title:
    "Master Global Markets & Financial Literacy | PRIME E-Learning & Training",
  description:
    "Dubai's premier online education platform for financial literacy, trading skills, and professional development. Join thousands of learners mastering the markets with institutional-grade education. No prerequisites required.",
  keywords: [
    "online trading courses",
    "financial literacy Dubai",
    "forex education",
    "stock market training",
    "professional development courses",
    "trading academy UAE",
    "investment courses online",
    "career transformation",
    "live trading sessions",
    "trading mentorship",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title:
      "Master Global Markets & Financial Literacy | PRIME E-Learning & Training",
    description:
      "Dubai's premier online education platform for financial literacy and professional development. Master the markets with institutional-grade education.",
    url: siteUrl,
    siteName: siteName,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PRIME E-Learning & Training - Master Global Markets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Master Global Markets & Financial Literacy",
    description:
      "Dubai's premier online education platform for financial literacy and professional development.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function HomePage() {
  const courseListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Courses at PRIME E-Learning & Training",
    description:
      "Explore our most popular courses designed to enhance your trading and financial skills",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Course",
          name: "Foundations - Trading Basics",
          description:
            "Master market literacy, risk management, and trading psychology",
          provider: {
            "@type": "Organization",
            name: siteName,
            url: siteUrl,
          },
          educationalLevel: "Beginner",
          teaches: [
            "Market Structure",
            "Risk Management",
            "Trading Psychology",
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Course",
          name: "Intermediate Trading",
          description:
            "Deep dive into volatility cycles, Gold & Macro playbooks, and correlation mapping",
          provider: {
            "@type": "Organization",
            name: siteName,
            url: siteUrl,
          },
          educationalLevel: "Intermediate",
          teaches: [
            "Smart Money Concepts",
            "Psychology Mastery",
            "Live Trading Sessions",
          ],
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Course",
          name: "Pro Labs - Advanced Trading",
          description:
            "System design, Monte Carlo simulations, and algorithmic edge development",
          provider: {
            "@type": "Organization",
            name: siteName,
            url: siteUrl,
          },
          educationalLevel: "Advanced",
          teaches: [
            "Algorithmic Trading",
            "System Design",
            "Institutional Strategies",
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
        name: "What is PRIME E-Learning & Training?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PRIME E-Learning & Training is a next-generation, online-only EdTech platform built to democratize access to high-quality learning in financial literacy, trading, and professional development. We require no prior academic prerequisites.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need any prior experience to start learning?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No! Our platform offers practical, industry-aligned training modules that require no prior academic prerequisites. Whether you're starting a second career or upgrading your financial literacy, we make learning accessible.",
        },
      },
      {
        "@type": "Question",
        name: "What courses are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer three tiers: Foundations (for beginners covering market structure, risk management), Intermediate (smart money concepts, live trading), and Pro Labs (algorithmic trading, institutional strategies).",
        },
      },
      {
        "@type": "Question",
        name: "Is the platform based in Dubai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, PRIME E-Learning & Training is Dubai's premier financial trading academy, offering institutional-grade education to learners worldwide.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseListJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <LandingPageClient />
    </>
  );
}
