import type { Metadata, Viewport } from "next";
import { Manrope, Inter, Poppins } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
});
const siteUrl = "https://primelearning.ae";
const siteName = "Prime Learning";
const siteDescription =
    "Premium online learning for professionals in India, the UAE, and beyond. Build real-world skills. Ship real outcomes.";
export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${siteName} | Learn Smarter. Grow Faster. Lead With Purpose.`,
        template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: [
        "online education",
        "online courses",
        "professional development",
        "e-learning platform",
        "career development",
        "business and leadership",
        "technology and data",
        "finance and markets",
        "creative and design",
        "project management",
        "test preparation",
        "certificates",
        "online courses India",
        "upskilling India",
        "AI courses Bangalore",
        "professional development India",
        "edtech India",
        "tech courses Hyderabad",
    ],
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: siteUrl,
        languages: {
            "en-AE": siteUrl,
            "en-IN": siteUrl,
            en: siteUrl,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteUrl,
        siteName: siteName,
        title: `${siteName} | Unlock Skills That Drive Your Future`,
        description: siteDescription,
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: `${siteName} - Premium online learning platform`,
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${siteName} | Unlock Skills That Drive Your Future`,
        description: siteDescription,
        images: [`${siteUrl}/og-image.png`],
        creator: "@primetraining",
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "your-google-verification-code",
    },
    category: "Education",
};
export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};
export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    const organizationJsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: siteName,
        alternateName: "PAET",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description: siteDescription,
        sameAs: [
            "https://twitter.com/primetraining",
            "https://www.linkedin.com/company/prime-elearning",
            "https://www.facebook.com/primeelearning",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English", "Arabic"],
        },
    };
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/learner/courses?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
    return (<html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={siteUrl}/>
        <link rel="alternate" hrefLang="en-AE" href={siteUrl}/>
        <link rel="alternate" hrefLang="en-IN" href={siteUrl}/>
        <link rel="alternate" hrefLang="en" href={siteUrl}/>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
        <link rel="icon" href="/icon.svg" type="image/svg+xml"/>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
        <link rel="manifest" href="/manifest.json"/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
        }}/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
        }}/>
      </head>
      <body className={`${manrope.variable} ${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>);
}
