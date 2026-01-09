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

const siteUrl = "https://paet.ltd";
const siteName = "PRIME E-Learning & Training";
const siteDescription =
  "Dubai's premier online education platform for financial literacy, trading skills, soft skills, and professional development. Master the global markets with institutional-grade education. No prerequisites required.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Master Global Markets & Financial Literacy`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "online education",
    "financial literacy",
    "trading courses",
    "forex trading",
    "stock market education",
    "professional development",
    "Dubai education",
    "e-learning platform",
    "trading academy",
    "financial training",
    "investment courses",
    "soft skills training",
    "career development",
    "online learning",
    "market analysis",
    "trading psychology",
    "risk management",
    "institutional trading",
    "live trading sessions",
    "mentorship program",
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
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | Master Global Markets & Financial Literacy`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Online Education Platform for Financial Literacy`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Master Global Markets & Financial Literacy`,
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

export default function RootLayout({
  children,
}: Readonly<{
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
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
