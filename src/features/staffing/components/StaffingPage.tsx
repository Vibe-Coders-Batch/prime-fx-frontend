"use client";

import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";

const GCC = ["UAE", "KSA", "Qatar", "Kuwait", "Bahrain", "Oman"] as const;

const CAPABILITIES = [
  {
    title: "Contract IT Staffing",
    blurb:
      "Short and long-term IT contract placements with payroll and compliance handled end-to-end.",
  },
  {
    title: "Permanent Hiring",
    blurb:
      "Executive search and permanent placement across modern technology domains and seniority levels.",
  },
  {
    title: "Staff Augmentation",
    blurb:
      "Scalable team augmentation for transformation programmes, project ramp-ups, and specialist roles.",
  },
  {
    title: "Payroll & EOR (GCC)",
    blurb:
      "Employer of Record services with statutory compliance aligned to GCC labour and payroll requirements.",
  },
  {
    title: "Managed Services",
    blurb:
      "Project delivery with dedicated on-site and off-site teams for outcomes that need ownership, not just resourcing.",
  },
  {
    title: "Talent Pipeline",
    blurb:
      "Pre-screened talent pools in niche specialisations to reduce time-to-deploy without sacrificing quality.",
  },
] as const;

const TECH_EXPERTISE = [
  {
    title: "Cloud & Infrastructure",
    items: ["AWS", "Azure", "GCP", "DevOps", "Kubernetes", "Terraform", "CI/CD"],
  },
  {
    title: "Software Development",
    items: ["Java", "Python", ".NET", "React", "Angular", "Node.js", "Go", "Microservices"],
  },
  {
    title: "Data & AI",
    items: ["Data Engineering", "ML/AI", "Databricks", "Spark", "Power BI", "Tableau", "SQL"],
  },
  {
    title: "Cybersecurity",
    items: ["SOC", "SIEM", "Pen Testing", "ISO 27001", "Zero Trust"],
  },
  {
    title: "ERP & Enterprise",
    items: ["SAP S/4HANA", "Oracle EBS", "Salesforce", "ServiceNow", "Dynamics 365"],
  },
  {
    title: "Networking & Telecom",
    items: ["Cisco", "Juniper", "SD-WAN", "5G", "Network Security", "VoIP"],
  },
] as const;

const WHY = [
  {
    title: "GCC market expertise",
    blurb: "Local labour, visa, and payroll context across all six GCC countries.",
  },
  {
    title: "Speed of deployment",
    blurb: "Typical mobilization within 2–4 weeks from requisition to onboarding.",
  },
  {
    title: "Pre-vetted talent pool",
    blurb: "Structured screening and assessment for repeatable quality at scale.",
  },
  {
    title: "Compliance shield",
    blurb: "Payroll, benefits, and statutory requirements managed with clear documentation.",
  },
  {
    title: "Dedicated account support",
    blurb: "Account management with coordination across sourcing, HR, and payroll workflows.",
  },
  {
    title: "Transparent commercials",
    blurb: "No hidden charges—itemized cost breakdowns and predictable reporting.",
  },
] as const;

export function StaffingPage() {
  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="Staffing"
            title={
              <>
                IT manpower & staffing{" "}
                <em className="italic text-[var(--gold)]">solutions</em> for the Middle East.
              </>
            }
            description="Prime Learning supports organisations across the GCC with contract staffing, permanent hiring, payroll/EOR, and rapid staff augmentation—built for speed, precision, and compliance."
          >
            <div className="flex flex-wrap gap-3">
              <Button as="a" href="#capabilities" variant="primary">
                Explore capabilities
              </Button>
              <Button as="a" href="mailto:learning@primelearning.ae" variant="ghost">
                Contact us
              </Button>
            </div>
          </PageHeader>

          <section className="mt-16 grid gap-6 rounded-2xl border border-[var(--fog)]/60 bg-white/[0.02] p-6 md:grid-cols-3 md:p-8">
            <div>
              <Eyebrow>Coverage</Eyebrow>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Middle East region delivery across {GCC.join(" · ")}.
              </p>
            </div>
            <div>
              <Eyebrow>Model</Eyebrow>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                End-to-end workforce management—from sourcing and screening to deployment, payroll, and compliance.
              </p>
            </div>
            <div>
              <Eyebrow>Outcome</Eyebrow>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                High-performance technology teams that scale with your transformation roadmap.
              </p>
            </div>
          </section>

          <section id="capabilities" className="mt-20">
            <div className="max-w-3xl">
              <Eyebrow>Capabilities</Eyebrow>
              <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold-bright)" }}>
                Solutions designed for modern delivery.
              </h2>
              <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Choose a flexible staffing model, or combine services to cover hiring, onboarding, payroll, and GCC compliance in one flow.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((c) => (
                <article
                  key={c.title}
                  className="rounded-2xl border border-[var(--fog)]/60 bg-[rgba(255,255,255,0.02)] p-6"
                >
                  <p className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {c.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {c.blurb}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="max-w-3xl">
              <Eyebrow>Technology expertise</Eyebrow>
              <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold-bright)" }}>
                Built for cloud, data, AI, and enterprise systems.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {TECH_EXPERTISE.map((area) => (
                <article
                  key={area.title}
                  className="rounded-2xl border border-[var(--fog)]/60 bg-[rgba(255,255,255,0.02)] p-6"
                >
                  <p className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {area.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {area.items.join(" · ")}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20">
            <div className="max-w-3xl">
              <Eyebrow>Why Prime Learning</Eyebrow>
              <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold-bright)" }}>
                Fast deployment. Clear compliance. No surprises.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {WHY.map((w) => (
                <article
                  key={w.title}
                  className="rounded-2xl border border-[var(--fog)]/60 bg-[rgba(255,255,255,0.02)] p-6"
                >
                  <p className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {w.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {w.blurb}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-20 overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--mist)] to-[var(--ink)] p-8">
            <div className="max-w-3xl">
              <Eyebrow>Get started</Eyebrow>
              <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)" }}>
                Let’s build your IT dream team.
              </h2>
              <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Share your roles, timelines, and location. We’ll respond with a clear staffing plan, expected lead times, and a compliance-ready mobilisation approach.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button as="a" href="mailto:learning@primelearning.ae" variant="primary">
                  Email us
                </Button>
                <Button as="a" href="/#chapter-plans" variant="ghost">
                  View plans
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </MarketingPageShell>
  );
}

