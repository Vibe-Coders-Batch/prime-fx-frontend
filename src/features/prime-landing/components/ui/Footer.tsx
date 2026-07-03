"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/config/company";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";

type FooterLink = { label: string; href: string };

const LINKS: Record<string, FooterLink[]> = {
  Academy: [
    { label: "About", href: "/about" },
    { label: "Leadership", href: "/leadership" },
    { label: "Events", href: "/events" },
    { label: "Spotlight", href: "/spotlight" },
    { label: "Staff Augmentation", href: "/staffing" },
  ],
  Resources: [{ label: "Blog", href: "/blogs" }],
  Legal: [
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms-of-service" },
    { label: "Code of Conduct", href: "/terms-of-service" },
    { label: "Contact", href: "/contact" },
  ],
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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[1.75fr_1.5fr_1.75fr] md:gap-12">
        <div>
          <Image
            src="/logo-dark.svg"
            alt="Prime Learning"
            width={520}
            height={304}
            className="h-28 w-auto max-w-[520px] object-contain object-left sm:h-32 sm:max-w-[640px] lg:h-40 lg:max-w-[760px]"
            priority
          />
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl">
            Learn Smarter. Grow Faster. Lead With Purpose.
          </p>
        </div>

        <div className="grid w-fit max-w-xs grid-cols-3 gap-x-4 self-start sm:max-w-sm sm:gap-x-5">
          {Object.entries(LINKS).map(([header, items]) => (
            <div key={header}>
              <Eyebrow className="!text-[10px] !tracking-[0.18em]">{header}</Eyebrow>
              <ul className="mt-1.5 space-y-0.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-xs leading-tight text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-bright)] sm:text-[13px]"
                    >
                      {item.label}
                    </Link>
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
        <span>© 2026 Prime Learning. All rights reserved.</span>
        <nav aria-label="Social media" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-bright)]"
            >
              {social.label}
            </a>
          ))}
        </nav>
        <span>Built in India & the UAE</span>
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
