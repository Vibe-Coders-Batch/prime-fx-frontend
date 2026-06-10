"use client";

import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Building2,
  Globe,
} from "lucide-react";
import { Reveal } from "@/components/marketing/motion/Reveal";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import {
  COMPANY,
  OFFICES,
  CONTACT_CHANNELS,
  PRIMARY_CONTACT,
  SOCIAL_LINKS,
} from "@/config/company";

export const cardClass =
  "rounded-3xl border border-[var(--fog)] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-[var(--gold-bright)]";

export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
    </div>
  );
}

/**
 * Full contact directory: every email channel, the direct line, both offices,
 * social handles, and company identifiers. Shared by the Contact and About pages.
 */
export function ContactDetails() {
  return (
    <>
      {/* Email channels */}
      <Reveal as="section" className="mt-16">
        <SectionHeading eyebrow="Email us" title="Reach the right team" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_CHANNELS.map((channel) => (
            <div key={channel.email} className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold-bright)]">
                  <Mail className="h-5 w-5" />
                </span>
                {channel.region && (
                  <span
                    className="rounded-full border border-[var(--fog)] px-3 py-1 text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {channel.region}
                  </span>
                )}
              </div>
              <h3
                className="mt-5 text-base font-semibold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {channel.label}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {channel.description}
              </p>
              <a
                href={`mailto:${channel.email}`}
                className="mt-4 inline-flex items-center gap-1.5 break-all text-sm font-medium text-[var(--gold-bright)] transition-opacity hover:opacity-80"
              >
                {channel.email}
                <ArrowUpRight className="h-4 w-4 shrink-0" />
              </a>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Direct line */}
      <Reveal as="section" className="mt-16">
        <SectionHeading eyebrow="Call us" title="Speak with us directly" />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className={cardClass}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold-bright)]">
              <Phone className="h-5 w-5" />
            </span>
            <p
              className="mt-5 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--gold-bright)" }}
            >
              {PRIMARY_CONTACT.division}
            </p>
            <a
              href={PRIMARY_CONTACT.phoneHref}
              className="mt-2 block text-xl font-semibold tracking-tight transition-colors hover:text-[var(--gold-bright)]"
              style={{ color: "var(--text-primary)" }}
            >
              {PRIMARY_CONTACT.phone}
            </a>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {PRIMARY_CONTACT.name}
            </p>
          </div>
          <div className={cardClass}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold-bright)]">
              <Mail className="h-5 w-5" />
            </span>
            <p
              className="mt-5 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--gold-bright)" }}
            >
              General enquiries
            </p>
            <a
              href={`mailto:${PRIMARY_CONTACT.email}`}
              className="mt-2 block break-all text-xl font-semibold tracking-tight transition-colors hover:text-[var(--gold-bright)]"
              style={{ color: "var(--text-primary)" }}
            >
              {PRIMARY_CONTACT.email}
            </a>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              We reply within one business day.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Offices */}
      <Reveal as="section" className="mt-16">
        <SectionHeading eyebrow="Visit us" title="Our offices" />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {OFFICES.map((office) => (
            <div key={office.label} className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold-bright)]">
                  <Building2 className="h-5 w-5" />
                </span>
                <span
                  className="rounded-full border border-[var(--fog)] px-3 py-1 text-xs font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {office.label}
                </span>
              </div>
              <h3
                className="mt-5 text-base font-semibold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {office.name}
              </h3>
              <address
                className="mt-2 text-sm not-italic leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href={office.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--gold-bright)] transition-opacity hover:opacity-80"
              >
                <MapPin className="h-4 w-4" />
                Open in maps
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Social + company details */}
      <Reveal as="section" className="mt-16">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className={cardClass}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold-bright)]">
              <Globe className="h-5 w-5" />
            </span>
            <p
              className="mt-5 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--gold-bright)" }}
            >
              Follow us
            </p>
            <ul className="mt-4 space-y-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--fog)] px-4 py-3 transition-colors hover:border-[var(--gold-bright)]"
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {social.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-[var(--gold-bright)]">
                      {social.handle}
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={cardClass}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10 text-[var(--gold-bright)]">
              <Building2 className="h-5 w-5" />
            </span>
            <p
              className="mt-5 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--gold-bright)" }}
            >
              Company details
            </p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt style={{ color: "var(--text-secondary)" }}>India entity</dt>
                <dd className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                  {COMPANY.legalName}
                </dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-secondary)" }}>UAE entity</dt>
                <dd className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                  {COMPANY.uaeLegalName}
                </dd>
              </div>
              <div>
                <dt style={{ color: "var(--text-secondary)" }}>Operating as</dt>
                <dd className="mt-1 font-medium" style={{ color: "var(--text-primary)" }}>
                  {COMPANY.brandName}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt style={{ color: "var(--text-secondary)" }}>CIN</dt>
                  <dd
                    className="mt-1 font-mono font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {COMPANY.cin}
                  </dd>
                </div>
                <div>
                  <dt style={{ color: "var(--text-secondary)" }}>PAN</dt>
                  <dd
                    className="mt-1 font-mono font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {COMPANY.pan}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </Reveal>
    </>
  );
}
