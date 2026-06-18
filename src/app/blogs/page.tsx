import type { Metadata } from "next";
import { BlogsIndexClient } from "./BlogsIndexClient";

const siteUrl = "https://paet.ltd";

export const metadata: Metadata = {
  title: "Blog | Notes from Prime Learning",
  description:
    "Programme notes, study guides, instructor essays, and inside-Prime dispatches. Long-form thinking from the Prime Learning faculty and editorial desk.",
  alternates: {
    canonical: `${siteUrl}/blogs`,
  },
  openGraph: {
    title: "Prime Learning Blog",
    description:
      "Long-form thinking on strategy, technology, finance, and the way people learn.",
    type: "website",
    url: `${siteUrl}/blogs`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Learning Blog",
    description:
      "Long-form thinking on strategy, technology, finance, and the way people learn.",
  },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    tag?: string;
    category?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const initialPage = sp.page ? Math.max(1, parseInt(sp.page, 10) || 1) : 1;

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <header className="mb-10 max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          The Prime Learning Blog
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Notes from the faculty
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Programme notes, study guides, market briefs, and short essays on how
          professionals actually learn. Written by the Prime Learning instructors and
          editorial desk.
        </p>
      </header>
      <BlogsIndexClient initialPage={initialPage} />
    </section>
  );
}
