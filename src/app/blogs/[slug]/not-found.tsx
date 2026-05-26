import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function BlogNotFound() {
  return (
    <section className="container mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BookOpen className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        This post is no longer available
      </h1>
      <p className="mt-3 text-muted-foreground">
        The article you’re looking for may have been moved, archived, or never
        existed. Browse the blog index for the latest posts.
      </p>
      <Link href="/blogs" className="mt-6">
        <Button>Back to the blog</Button>
      </Link>
    </section>
  );
}
