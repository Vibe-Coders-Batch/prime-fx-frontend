"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth-store";
import { MessageCircle } from "lucide-react";

interface SignInCtaProps {
  message?: string;
}

export function SignInCta({ message }: SignInCtaProps) {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  if (user) return null;
  const redirect = encodeURIComponent(pathname || "/blogs");
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MessageCircle className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        {message ?? "Sign in to comment and save this post"}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a free Prime Learning account to join the conversation.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Link href={`/login?redirect=${redirect}`}>
          <Button size="sm">Sign in</Button>
        </Link>
        <Link href={`/signup?redirect=${redirect}`}>
          <Button size="sm" variant="outline">
            Create account
          </Button>
        </Link>
      </div>
    </div>
  );
}
