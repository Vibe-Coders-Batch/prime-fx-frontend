"use client";

import { useEffect, useRef } from "react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { gsap, ScrollTrigger, registerGsap } from "@/features/prime-landing/lib/gsap";

const GCC = ["UAE", "KSA", "Qatar", "Kuwait", "Bahrain", "Oman"] as const;
const INDIA_HUBS = ["Hyderabad", "Bangalore", "Noida"] as const;

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

const INDIA_CAPABILITIES = [
  {
    title: "Contract Staffing",
    blurb:
      "Short and long-term IT contract placements with PF/ESI/PT/TDS compliance handled end-to-end.",
  },
  {
    title: "Permanent Hiring",
    blurb:
      "Executive search and permanent placement across IT domains and seniority levels across India.",
  },
  {
    title: "Staff Augmentation",
    blurb:
      "Scalable team augmentation for digital transformation and project ramp-ups.",
  },
  {
    title: "Payroll & Compliance",
    blurb:
      "Employer of Record style payroll management aligned with Indian labour law and statutory filings.",
  },
  {
    title: "Managed Services",
    blurb:
      "End-to-end project delivery with dedicated on-site and off-site teams.",
  },
  {
    title: "AI Talent Sourcing",
    blurb:
      "Specialised sourcing for ML engineers, data scientists, GenAI specialists, and AI product roles.",
  },
] as const;

const INDIA_TECH_EXPERTISE = [
  {
    title: "AI & Machine Learning",
    items: [
      "LLMs",
      "GenAI",
      "PyTorch",
      "TensorFlow",
      "LangChain",
      "RAG",
      "MLOps",
      "Vector DBs",
    ],
  },
  {
    title: "Data Engineering & Analytics",
    items: ["Databricks", "Spark", "dbt", "Snowflake", "Kafka", "Power BI", "Tableau", "SQL"],
  },
  {
    title: "Cloud & Infrastructure",
    items: ["AWS", "Azure", "GCP", "Kubernetes", "Terraform", "CI/CD", "SRE"],
  },
  {
    title: "Software Development",
    items: ["Java", "Python", ".NET", "React", "Angular", "Node.js", "Go", "Microservices"],
  },
  {
    title: "Cybersecurity",
    items: ["SOC", "SIEM", "VAPT", "ISO 27001", "Zero Trust", "Cloud Security"],
  },
  {
    title: "ERP & Enterprise",
    items: ["SAP S/4HANA", "Oracle EBS", "Salesforce", "ServiceNow", "Dynamics 365", "Workday"],
  },
] as const;

const INDIA_WHY = [
  {
    title: "India market expertise",
    blurb: "Strong understanding of Indian labour compliance and the tech talent landscape across major hubs.",
  },
  {
    title: "Speed of deployment",
    blurb: "Typical offer-to-onboarding in 2–4 weeks for priority skillsets.",
  },
  {
    title: "Pre-vetted talent pool",
    blurb: "Structured screening across major stacks plus a dedicated AI & data bench.",
  },
  {
    title: "Full compliance shield",
    blurb: "PF/ESI/PT/TDS compliant engagements with clear documentation and reporting.",
  },
  {
    title: "Dedicated account team",
    blurb: "Account manager + HR support for deployed consultants and ongoing engagement.",
  },
  {
    title: "Transparent commercials",
    blurb: "Clear billing and cost breakdowns. No hidden charges.",
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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const blocks = root.querySelectorAll<HTMLElement>("[data-reveal]");
      gsap.set(blocks, { y: 18, opacity: 0 });

      ScrollTrigger.batch(blocks, {
        start: "top 88%",
        onEnter: (els) =>
          gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: "expo.out",
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36">
        <div ref={rootRef} className="mx-auto max-w-7xl px-6 lg:px-8">
          <PageHeader
            eyebrow="Staffing"
            title={
              <>
                IT manpower &{" "}
                <span
                  className="font-semibold"
                  style={{
                    color: "var(--gold-bright)",
                    textShadow: "0 0 22px rgba(224,180,88,0.28)",
                  }}
                >
                  staffing
                </span>{" "}
                <em className="italic text-[var(--gold)]">solutions</em> for the Middle East.
              </>
            }
            description="Prime Learning supports organisations across the GCC with contract staffing, permanent hiring, payroll/EOR, and rapid staff augmentation—built for speed, precision, and compliance."
          >
            <div className="flex flex-wrap gap-3">
              <Button as="a" href="#capabilities" variant="primary">
                Middle East
              </Button>
              <Button as="a" href="#india" variant="ghost">
                India
              </Button>
            </div>
          </PageHeader>

          <section
            data-reveal
            className="mt-16 grid gap-6 rounded-2xl border border-[var(--fog)]/60 bg-white/[0.02] p-6 md:grid-cols-3 md:p-8"
          >
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
                  data-reveal
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
                  data-reveal
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
                  data-reveal
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

          <section
            data-reveal
            className="mt-20 overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--mist)] to-[var(--ink)] p-8"
          >
            <div className="max-w-3xl">
              <Eyebrow>Get started</Eyebrow>
              <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)" }}>
                Let’s build your IT dream team.
              </h2>
              <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Share your roles, timelines, and location. We’ll respond with a clear staffing plan, expected lead times, and a compliance-ready mobilisation approach.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button as="a" href="mailto:staffing@primelearning.ae" variant="primary">
                  Prime Learning — Staffing · staffing@primelearning.ae
                </Button>
              </div>
            </div>
          </section>

          {/* ───────── India ───────── */}
          <section id="india" className="mt-28">
            <div className="max-w-3xl" data-reveal>
              <Eyebrow>Staffing — India</Eyebrow>
              <h2
                className="display mt-6"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold-bright)" }}
              >
                Built for India delivery.
              </h2>
              <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Contract staffing, permanent hiring, managed services, and AI talent sourcing—designed for speed, precision, and statutory compliance.
              </p>
            </div>

            <section
              data-reveal
              className="mt-10 grid gap-6 rounded-2xl border border-[var(--fog)]/60 bg-white/[0.02] p-6 md:grid-cols-3 md:p-8"
            >
              <div>
                <Eyebrow>Coverage</Eyebrow>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Delivery across {INDIA_HUBS.join(" · ")}, with extended sourcing across India’s top tech hubs.
                </p>
              </div>
              <div>
                <Eyebrow>Compliance</Eyebrow>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  PF, ESI, PT, and TDS workflows managed with clear documentation and reporting.
                </p>
              </div>
              <div>
                <Eyebrow>AI focus</Eyebrow>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Dedicated AI & data talent pipeline for modern product and platform teams.
                </p>
              </div>
            </section>

            <section className="mt-20">
              <div className="max-w-3xl" data-reveal>
                <Eyebrow>Capabilities</Eyebrow>
                <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold-bright)" }}>
                  Staffing and compliance—together.
                </h2>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {INDIA_CAPABILITIES.map((c) => (
                  <article
                    key={c.title}
                    data-reveal
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
              <div className="max-w-3xl" data-reveal>
                <Eyebrow>Technology expertise</Eyebrow>
                <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold-bright)" }}>
                  Strong bench across AI, data, cloud, and enterprise.
                </h2>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {INDIA_TECH_EXPERTISE.map((area) => (
                  <article
                    key={area.title}
                    data-reveal
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
              <div className="max-w-3xl" data-reveal>
                <Eyebrow>Why Prime Learning</Eyebrow>
                <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--gold-bright)" }}>
                  Compliance-ready staffing, without the overhead.
                </h2>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {INDIA_WHY.map((w) => (
                  <article
                    key={w.title}
                    data-reveal
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

            <section
              data-reveal
              className="mt-20 overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--mist)] to-[var(--ink)] p-8"
            >
              <div className="max-w-3xl">
                <Eyebrow>Get started</Eyebrow>
                <h2 className="display mt-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)" }}>
                  Let’s build your India IT team.
                </h2>
                <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Share your roles, timelines, and locations. We’ll respond with a clear staffing plan and a compliance-ready deployment approach.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button as="a" href="mailto:staffing@primelearning.ae" variant="primary">
                    Prime Learning — Staffing · staffing@primelearning.ae
                  </Button>
                </div>
              </div>
            </section>
          </section>
        </div>
      </main>
    </MarketingPageShell>
  );
}

