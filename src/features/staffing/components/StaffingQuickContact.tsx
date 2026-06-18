"use client";

import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { STAFFING_EMAIL } from "@/config/staffing-regions";
import { axiosPost } from "@/lib/api/client";

type StaffingQuickContactProps = {
  regionLabel: string;
};

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
    `Company: ${payload.company || "-"}`,
    "",
    payload.message,
  ].join("\n");

  return `mailto:${STAFFING_EMAIL}?subject=${encodeURIComponent(
    `${payload.regionLabel} staffing enquiry`
  )}&body=${encodeURIComponent(body)}`;
}

function formatApiError(error: unknown): string {
  if (!isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  if (error.message) return error.message;

  return "Something went wrong. Please try again.";
}

function shouldUseMailtoFallback(error: unknown): boolean {
  if (!isAxiosError(error)) return true;
  if (!error.response) return true;
  return error.response.status >= 500;
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
      await axiosPost("/contact/staffing-enquiry", payload);

      resetForm();
      setStatus({
        tone: "success",
        text: `Thank you. Your enquiry was sent to ${STAFFING_EMAIL}. We will respond shortly.`,
      });
    } catch (error) {
      if (shouldUseMailtoFallback(error)) {
        window.location.href = buildMailtoUrl(payload);
        setStatus({
          tone: "error",
          text: `We could not reach our server, so we opened your email app. If nothing opened, email us at ${STAFFING_EMAIL}.`,
        });
        return;
      }

      setStatus({
        tone: "error",
        text: formatApiError(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--fog)]/60 bg-[var(--mist)]/40 p-6 shadow-xl backdrop-blur-sm md:p-8"
      noValidate
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-bright)]">
        Quick enquiry
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Share your mandate and we respond with a staffing plan and mobilisation timeline. Enquiries
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
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Work email"
          className={fieldClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <input
          type="text"
          name="company"
          autoComplete="organization"
          placeholder="Company / organisation"
          className={fieldClass}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={submitting}
        />
        <textarea
          name="message"
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
          aria-live="polite"
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
