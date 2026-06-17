"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { STAFFING_EMAIL } from "@/config/staffing-regions";

type StaffingQuickContactProps = {
  regionLabel: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const fieldClass =
  "w-full rounded-lg border border-[var(--fog)] bg-white/[0.04] px-4 py-3 text-sm text-[var(--text-primary)] " +
  "placeholder:text-[var(--text-tertiary)] outline-none transition focus:border-[var(--gold-bright)] focus:ring-2 focus:ring-[var(--gold)]/30";

function buildMailtoUrl(payload: {
  regionLabel: string;
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  const body = [
    `Region: ${payload.regionLabel}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${payload.company || "—"}`,
    "",
    payload.message,
  ].join("\n");

  return `mailto:${STAFFING_EMAIL}?subject=${encodeURIComponent(
    `${payload.regionLabel} — Staffing enquiry`
  )}&body=${encodeURIComponent(body)}`;
}

export function StaffingQuickContact({ regionLabel }: StaffingQuickContactProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setCompany("");
    setMessage("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const payload = {
      regionLabel,
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      message: message.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/contact/staffing-enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
        const apiMessage = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message;
        throw new Error(apiMessage || `Request failed (${response.status})`);
      }

      resetForm();
      setStatus({
        tone: "success",
        text: `Thank you — your enquiry was sent to ${STAFFING_EMAIL}. We will respond shortly.`,
      });
    } catch {
      // Fallback when the API or email provider is unavailable (common in local dev).
      window.location.href = buildMailtoUrl(payload);
      setStatus({
        tone: "error",
        text: `We opened your email app as a fallback. If nothing opened, email us directly at ${STAFFING_EMAIL}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--fog)]/60 bg-[var(--mist)]/40 p-6 shadow-xl backdrop-blur-sm md:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
        Quick enquiry
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Share your mandate — we respond with a staffing plan and mobilisation timeline. Enquiries
        go to{" "}
        <a
          href={`mailto:${STAFFING_EMAIL}`}
          className="text-[var(--gold-bright)] transition-colors hover:underline"
        >
          {STAFFING_EMAIL}
        </a>
        .
      </p>
      <div className="mt-5 grid gap-4">
        <input
          type="text"
          required
          placeholder="Your name"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
        <input
          type="email"
          required
          placeholder="Work email"
          className={fieldClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <input
          type="text"
          placeholder="Company / organisation"
          className={fieldClass}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={submitting}
        />
        <textarea
          required
          rows={3}
          placeholder="Roles, locations, timelines, and headcount"
          className={`${fieldClass} resize-none`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
        />
      </div>

      {status && (
        <p
          className={
            "mt-4 rounded-lg border px-4 py-3 text-sm " +
            (status.tone === "success"
              ? "border-[var(--color-success-green,#10b981)]/40 bg-[var(--color-success-green,#10b981)]/10 text-[var(--color-success-green,#10b981)]"
              : "border-[var(--color-live-red,#ff6b6b)]/40 bg-[var(--color-live-red,#ff6b6b)]/10 text-[var(--color-live-red,#ff6b6b)]")
          }
          role="status"
        >
          {status.text}
        </p>
      )}

      <Button type="submit" variant="primary" className="mt-5 w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
