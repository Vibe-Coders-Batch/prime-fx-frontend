"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section
      className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-r from-primary to-primary/80"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          id="cta-heading"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6 md:mb-8 tracking-tight"
        >
          Ready to Institutionalize Your Trading?
        </h2>
        <p className="text-primary-foreground/80 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Join thousands of successful traders who have transformed their
          careers with PRIME E-Learning & Training. Start your journey today.
        </p>
        <Link
          href="/signup"
          aria-label="Join PRIME E-Learning & Training Academy and start your trading journey"
        >
          <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-6 md:py-8 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            Join PRIME E-LEARNING & TRAINING Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
