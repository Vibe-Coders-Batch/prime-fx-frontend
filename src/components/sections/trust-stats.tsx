"use client";

const STATS = [
  { label: "Learners", value: "10,000+", description: "Active learners worldwide" },
  { label: "Live Sessions", value: "500+", description: "Live trading sessions conducted" },
  { label: "Curriculum", value: "Institutional Grade", description: "Professional quality content" },
];

const PARTNERS = ["Bloomberg", "TradingView", "MetaTrader 5", "FTMO"];

export function TrustStats() {
  return (
    <section
      className="py-12 bg-card border-y border-border"
      aria-label="Platform statistics and partners"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          {/* Stats */}
          <dl
            className="flex gap-8 md:gap-12"
            aria-label="Platform statistics"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <dt className="sr-only">{stat.description}</dt>
                <dd className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </dd>
                <dt className="text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          {/* Divider (Mobile hidden) */}
          <div
            className="hidden md:block w-px h-12 bg-border"
            role="separator"
            aria-hidden="true"
          />

          {/* Partners */}
          <div
            className="flex flex-wrap justify-center gap-8"
            role="list"
            aria-label="Trusted platform partners"
          >
            {PARTNERS.map((partner, i) => (
              <span
                key={i}
                role="listitem"
                className="text-xl font-bold text-foreground/80 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
