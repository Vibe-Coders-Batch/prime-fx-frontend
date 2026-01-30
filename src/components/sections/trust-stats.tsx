"use client";

const PARTNERS = [
  "Volkswagen",
  "Samsung",
  "Cisco",
  "Vimeo",
  "P&G",
  "Hewlett Packard Enterprise",
  "Citi",
  "Ericsson",
];

export function TrustStats() {
  return (
    <section
      className="py-8 sm:py-10 md:py-12 bg-card border-y border-border"
      aria-label="Platform statistics and partners"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Trusted by learners, professionals, and institutions worldwide.
        </p>

        <div
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          role="list"
          aria-label="Trusted by organisations"
        >
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              role="listitem"
              className="text-sm sm:text-base font-semibold tracking-wide text-foreground/70 opacity-60 hover:opacity-100 transition-opacity"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
