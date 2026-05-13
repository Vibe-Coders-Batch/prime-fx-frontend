"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";

const LINKS = {
  Academy: ["Courses", "Categories", "Live Cohorts", "Instructors"],
  Resources: ["Blog", "Guides", "Case Studies", "Help Center"],
  Legal: ["Privacy", "Terms", "Code of Conduct", "Contact"],
};

export function Footer() {
  const [noWebgl, setNoWebgl] = useState(false);

  const toggleWebgl = () => {
    const next = !noWebgl;
    setNoWebgl(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("nowebgl", "1");
    else url.searchParams.delete("nowebgl");
    window.location.href = url.toString();
  };

  return (
    <footer className="relative border-t border-[var(--fog)] bg-[var(--ink)] px-6 py-20 text-white lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-[2fr_3fr_2fr]">
        <div>
          <Image
            src="/logo-dark.svg"
            alt="Prime Learning"
            width={521}
            height={304}
            className="h-16 w-auto sm:h-20 lg:h-24"
            priority
          />
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl">
            Learn Smarter. Grow Faster. Lead With Purpose.
          </p>
          <a
            href="mailto:hello@primelearning.ae"
            className="mt-6 inline-block text-base text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-bright)] sm:text-lg"
          >
            hello@primelearning.ae
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {Object.entries(LINKS).map(([header, items]) => (
            <div key={header}>
              <Eyebrow className="!text-xs sm:!text-sm">{header}</Eyebrow>
              <ul className="mt-5 space-y-3">
                {items.map((i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-base text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-bright)] sm:text-lg"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <Eyebrow className="!text-xs sm:!text-sm">Stay in the loop</Eyebrow>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl">
            Monthly dispatch on new courses and free resources.
          </p>
          <form className="mt-6 flex gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              placeholder="you@example.com"
              className="h-12 flex-1 rounded-full border border-[var(--fog)] bg-transparent px-5 text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--gold-bright)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--gold-bright)]"
            />
            <Button type="submit" variant="gold" className="h-12 px-6 text-base">
              Join
            </Button>
          </form>
        </div>
      </div>

      <div
        className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[var(--fog)] pt-6 text-sm sm:text-base md:flex-row"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span>© {new Date().getFullYear()} Prime Learning. All rights reserved.</span>
        <span>Made in Dubai</span>
        <button
          onClick={toggleWebgl}
          className="text-[var(--text-secondary)] underline-offset-4 hover:text-[var(--gold-bright)] hover:underline"
          type="button"
        >
          {noWebgl ? "Enable WebGL" : "Disable WebGL"}
        </button>
      </div>
    </footer>
  );
}

