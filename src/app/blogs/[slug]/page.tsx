import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { blogsApi } from "@/features/blogs/api/blogs.api";
import { BlogPostHeader } from "@/features/blogs/components/BlogPostHeader";
import { MarkdownRenderer } from "@/features/blogs/components/MarkdownRenderer";
import { SignInCta } from "@/features/blogs/components/SignInCta";
import { RelatedPosts } from "@/features/blogs/components/RelatedPosts";

const siteUrl = "https://paet.ltd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadPublishedPost(slug: string) {
  try {
    const post = await blogsApi.getBySlug(slug);
    if (!post || post.status !== "PUBLISHED") return null;
    return post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPublishedPost(slug);
  if (!post) {
    return {
      title: "Post not found",
      robots: { index: false, follow: false },
    };
  }
  const url = `${siteUrl}/blogs/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadPublishedPost(slug);
  if (!post) notFound();

  const url = `${siteUrl}/blogs/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Prime Learning",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
  };

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-6">
        <Link href="/blogs">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ChevronLeft className="h-4 w-4" />
            All posts
          </Button>
        </Link>
      </div>

      <BlogPostHeader post={post} />

      <div className="mt-10">
        <MarkdownRenderer content={post.content} />
      </div>

      <div className="mt-12 space-y-12">
        <SignInCta />
        <RelatedPosts slug={post.slug} />
      </div>
    </article>
  );
}
