"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CommunicationContacts } from "@/components/marketing/CommunicationContacts";
import { OFFICE_LOCATION, OFFICE_MAPS_URL } from "@/config/pricing";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";

type FooterLink = { label: string; href: string };

const LINKS: Record<string, FooterLink[]> = {
  Academy: [
    { label: "Courses", href: "/#chapter-courses" },
    { label: "Categories", href: "/#chapter-categories" },
    { label: "Events", href: "/events" },
    { label: "Spotlight", href: "/spotlight" },
    { label: "Leadership", href: "/leadership" },
    { label: "Staffing", href: "/staffing" },
    { label: "Plans", href: "/#chapter-plans" },
  ],
  Resources: [
    { label: "Blog", href: "/blogs" },
    { label: "Guides", href: "/blogs" },
    { label: "Case Studies", href: "/blogs" },
    { label: "Help Center", href: "mailto:learning@primelearning.ae" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms-of-service" },
    { label: "Code of Conduct", href: "/terms-of-service" },
    { label: "Contact", href: "mailto:learning@primelearning.ae" },
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
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-[2fr_3fr_2fr]">
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
          <CommunicationContacts className="mt-8" />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {Object.entries(LINKS).map(([header, items]) => (
            <div key={header}>
              <Eyebrow className="!text-xs sm:!text-sm">{header}</Eyebrow>
              <ul className="mt-5 space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-base text-[var(--text-secondary)] transition-colors hover:text-[var(--gold-bright)] sm:text-lg"
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

          <address className="mt-10 not-italic text-sm leading-relaxed sm:text-base">
            <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: "var(--gold-bright)" }}>
              Office
            </p>
            <p className="mt-5 font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              {OFFICE_LOCATION.name}
            </p>
            <a
              href={OFFICE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block transition-colors hover:text-[var(--gold-bright)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {OFFICE_LOCATION.streetAddress}
              <br />
              {OFFICE_LOCATION.addressLocality}, {OFFICE_LOCATION.addressRegion}{" "}
              {OFFICE_LOCATION.postalCode}
            </a>
          </address>
        </div>
      </div>

      <div
        className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[var(--fog)] pt-6 text-sm sm:text-base md:flex-row"
        style={{ color: "var(--text-tertiary)" }}
      >
        <span>© 2026 Prime Learning. All rights reserved.</span>
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

