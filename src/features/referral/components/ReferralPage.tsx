"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MarketingPageShell } from "@/components/marketing/MarketingPageShell";
import { PageHeader } from "@/components/marketing/motion/PageHeader";
import { Eyebrow } from "@/features/prime-landing/components/ui/Eyebrow";
import { Button } from "@/features/prime-landing/components/ui/Button";
import {
  REFERRAL_MAX_RESUME_BYTES,
  REFERRAL_POLICY_PDF_DOWNLOAD_URL,
  REFERRAL_POLICY_PDF_PREVIEW_URL,
  REFERRAL_POLICY_SUMMARY,
  REFERRAL_RESUME_ACCEPT,
  REFERRAL_REWARD,
  REFERRAL_SCRIPT_URL,
  type ReferralJob,
} from "@/config/referral";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Explicit marketing-surface colors - portaled dropdowns sit on <body>, outside .primeLanding tokens. */
const REFERRAL_SELECT_MENU = {
  background: "#0e1726",
  text: "#f8fafc",
  muted: "#94a3b8",
  highlight: "#112240",
  border: "#1e293b",
} as const;

const referralSelectTriggerClass =
  "h-auto min-h-[2.75rem] justify-between py-3 font-normal shadow-none " +
  "[&>svg]:shrink-0 [&>svg]:text-[#f8fafc] " +
  // Beat shadcn `text-muted-foreground` / light-theme accent defaults on Windows.
  "text-[#f8fafc] placeholder:text-[#94a3b8] focus:text-[#f8fafc] data-[state=open]:text-[#f8fafc] " +
  "[&>span]:text-[#f8fafc] [&_[data-placeholder]]:text-[#94a3b8]";

const referralSelectItemClass =
  "cursor-pointer text-[#f8fafc] outline-none " +
  "focus:!bg-[#112240] focus:!text-[#f8fafc] " +
  "data-[highlighted]:!bg-[#112240] data-[highlighted]:!text-[#f8fafc] " +
  "data-[state=checked]:!text-[#f8fafc] [&_svg]:text-[#e0b458]";

type JobsStatus = {
  tone: "loading" | "error" | "success";
  text: string;
};

type Banner = {
  tone: "success" | "error";
  text: string;
};

const EMPTY_FORM = {
  refereeName: "",
  refereeEmail: "",
  refereePhone: "",
  candidateName: "",
  candidateEmail: "",
  candidatePhone: "",
};

const inputClass =
  "w-full rounded-lg border border-[var(--fog)] bg-white/[0.03] px-4 py-3 text-sm " +
  "text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition " +
  "focus:border-[var(--gold-bright)] focus:ring-2 focus:ring-[var(--gold)]/30 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const labelClass = "mb-1.5 block text-xs font-semibold tracking-wide text-[var(--text-primary)]";

const cardClass = "rounded-2xl border border-[var(--fog)]/60 bg-white/[0.02] p-6 md:p-8";

export function ReferralPage() {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [jobs, setJobs] = useState<ReferralJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobsStatus, setJobsStatus] = useState<JobsStatus>({
    tone: "loading",
    text: "Fetching open positions from the jobs sheet…",
  });
  const [policyChecked, setPolicyChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);

  const resumeRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const selectedJob = jobs.find((job) => job.jobId === selectedJobId);
  const jobsReady = jobsStatus.tone === "success" && jobs.length > 0;
  const showRetry = jobsStatus.tone === "error";

  const setField = (key: keyof typeof EMPTY_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const showBanner = useCallback((tone: Banner["tone"], text: string) => {
    setBanner({ tone, text });
    // Scroll the banner into view on the next paint.
    requestAnimationFrame(() =>
      bannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    );
  }, []);

  // ── Jobs loading - from Apps Script only ──────────────────────────────
  const loadJobs = useCallback(() => {
    setJobsStatus({ tone: "loading", text: "Fetching open positions from the jobs sheet…" });
    setSelectedJobId("");

    fetch(`${REFERRAL_SCRIPT_URL}?action=getJobs`)
      .then((response) => {
        if (!response.ok) throw new Error(`Network response was not OK: ${response.status}`);
        return response.json();
      })
      .then((data: { status?: string; jobs?: ReferralJob[]; message?: string }) => {
        if (data.status === "success" && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          if (data.jobs.length === 0) {
            setJobsStatus({
              tone: "error",
              text: "No open positions found in the jobs sheet. Please check back later.",
            });
            return;
          }
          setJobsStatus({
            tone: "success",
            text: `${data.jobs.length} open position(s) loaded successfully.`,
          });
        } else {
          throw new Error(data.message || "Unexpected response from server");
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        setJobs([]);
        setJobsStatus({
          tone: "error",
          text: `Failed to load positions: ${message}. Use the retry button or contact HR.`,
        });
      });
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Lock body scroll while the PDF modal is open + allow Escape to close.
  useEffect(() => {
    if (!pdfOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPdfOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [pdfOpen]);

  // ── Validation ────────────────────────────────────────────────────────
  const validate = (): string | null => {
    const refereePhone = form.refereePhone.replace(/\D/g, "");
    const candidatePhone = form.candidatePhone.replace(/\D/g, "");
    const resumeFile = resumeRef.current?.files?.[0];

    if (!form.refereeName.trim()) return "Please enter your name";
    if (!form.refereeEmail.includes("@")) return "Please enter a valid referrer email";
    if (refereePhone.length !== 10) return "Referrer phone must be exactly 10 digits";
    if (!form.candidateName.trim()) return "Please enter the candidate name";
    if (!form.candidateEmail.includes("@")) return "Please enter a valid candidate email";
    if (candidatePhone.length !== 10) return "Candidate phone must be exactly 10 digits";
    if (!selectedJobId) return "Please select a position";
    if (!resumeFile) return "Please upload the candidate's resume";
    if (resumeFile.size > REFERRAL_MAX_RESUME_BYTES) return "Resume must be less than 5MB";
    if (!policyChecked) return "Please acknowledge the referral policy";
    return null;
  };

  const clearForm = () => {
    setForm({ ...EMPTY_FORM });
    setSelectedJobId("");
    setPolicyChecked(false);
    setBanner(null);
    if (resumeRef.current) resumeRef.current.value = "";
  };

  // ── Submit - real POST to Apps Script ─────────────────────────────────
  const submitForm = () => {
    const error = validate();
    if (error) {
      showBanner("error", error);
      return;
    }

    const resumeFile = resumeRef.current?.files?.[0];
    if (!resumeFile) return;

    setSubmitting(true);
    showBanner("success", "Uploading resume and submitting referral, please wait…");

    const reader = new FileReader();
    reader.onload = (e) => {
      // e.target.result is "data:application/pdf;base64,XXXX…" - strip the prefix.
      const base64String = String(e.target?.result ?? "").split(",")[1] ?? "";
      const job = selectedJob;

      const payload = {
        // Referrer info - Apps Script expects referrerName / referrerContact.
        referrerName: form.refereeName.trim(),
        referrerContact: form.refereeEmail.trim(),
        referrerPhone: form.refereePhone.replace(/\D/g, ""),

        // Candidate info.
        candidateName: form.candidateName.trim(),
        candidateEmail: form.candidateEmail.trim(),
        candidatePhone: form.candidatePhone.replace(/\D/g, ""),

        // Job info - pulled from the live jobs data, not the form.
        jobApplied: job?.role ?? "",
        jobId: job?.jobId ?? "",
        jobDescription: job?.description ?? "",
        hmEmail: job?.hmEmail ?? "",

        // Resume - base64 encoded.
        resumeBase64: base64String,
        resumeMimeType: resumeFile.type,
        resumeFileName: resumeFile.name,
      };

      fetch(REFERRAL_SCRIPT_URL, {
        method: "POST",
        // No Content-Type header on purpose: setting application/json triggers a
        // CORS preflight (OPTIONS) that Apps Script silently drops. Without it the
        // browser sends a simple request and Apps Script still reads e.postData.contents.
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Server returned status ${response.status}`);
          return response.json();
        })
        .then((data: { status?: string; message?: string }) => {
          if (data.status === "success") {
            showBanner(
              "success",
              `Referral submitted successfully. ${resumeFile.name} has been saved to Drive, the referral log has been updated, and the hiring team has been notified.`
            );
            setTimeout(clearForm, 4000);
          } else {
            throw new Error(data.message || "Unknown server error");
          }
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Unknown error";
          showBanner("error", `Submission failed: ${message}. Please try again or contact HR.`);
        })
        .finally(() => setSubmitting(false));
    };

    reader.onerror = () => {
      showBanner("error", "Could not read the resume file. Please try again.");
      setSubmitting(false);
    };

    reader.readAsDataURL(resumeFile);
  };

  return (
    <MarketingPageShell>
      <main className="relative pt-28 pb-16 md:pt-36 lg:pt-44">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <PageHeader
            eyebrow="MIYO Global · Referral Program"
            title={
              <>
                Refer talent. Earn{" "}
                <em className="italic text-[var(--gold)]">{REFERRAL_REWARD}</em>.
              </>
            }
            description="Know someone great? Refer a candidate for an open MIYO Global mandate. When they are hired and onboarded, you earn a referral reward."
          >
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="primary" onClick={() => setPdfOpen(true)}>
                Read full policy
              </Button>
              <Button as="a" href="#referral-form" variant="ghost">
                Start a referral
              </Button>
            </div>
          </PageHeader>

          {/* ── Policy summary ── */}
          <section className="mt-16">
            <Eyebrow>Referral Policy 2026</Eyebrow>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--gold)]/30 bg-white/[0.02]">
              <dl className="divide-y divide-[var(--fog)]/60">
                {REFERRAL_POLICY_SUMMARY.map((row) => (
                  <div key={row.label} className="grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-2 sm:gap-4">
                    <dt className="text-sm font-semibold text-[var(--text-primary)]">{row.label}</dt>
                    <dd className="text-sm text-[var(--gold-bright)]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* ── Referral form ── */}
          <section id="referral-form" className="mt-12 scroll-mt-28 space-y-6">
            {/* Policy acknowledgment */}
            <div className={cardClass}>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={policyChecked}
                  onChange={(e) => setPolicyChecked(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--gold)]"
                />
                <span className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  I acknowledge and agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setPdfOpen(true)}
                    className="font-semibold text-[var(--gold-bright)] underline-offset-2 hover:underline"
                  >
                    Referral Policy 2026
                  </button>
                  .
                </span>
              </label>
            </div>

            {/* Referrer details */}
            <div className={cardClass}>
              <Eyebrow>Your details</Eyebrow>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                This is your information, as the person making the referral.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="refereeName">Name</label>
                  <input
                    id="refereeName"
                    type="text"
                    className={inputClass}
                    value={form.refereeName}
                    onChange={(e) => setField("refereeName", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="refereeEmail">Email</label>
                  <input
                    id="refereeEmail"
                    type="email"
                    className={inputClass}
                    value={form.refereeEmail}
                    onChange={(e) => setField("refereeEmail", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="refereePhone">Phone (10 digits)</label>
                  <input
                    id="refereePhone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    className={inputClass}
                    value={form.refereePhone}
                    onChange={(e) => setField("refereePhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Candidate details */}
            <div className={cardClass}>
              <Eyebrow>Candidate details</Eyebrow>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Information about the candidate you are referring.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="candidateName">Candidate name</label>
                  <input
                    id="candidateName"
                    type="text"
                    className={inputClass}
                    value={form.candidateName}
                    onChange={(e) => setField("candidateName", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="candidateEmail">Candidate email</label>
                  <input
                    id="candidateEmail"
                    type="email"
                    className={inputClass}
                    value={form.candidateEmail}
                    onChange={(e) => setField("candidateEmail", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="candidatePhone">Candidate phone (10 digits)</label>
                  <input
                    id="candidatePhone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    className={inputClass}
                    value={form.candidatePhone}
                    onChange={(e) => setField("candidatePhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Position selection */}
            <div className={cardClass}>
              <Eyebrow>Position</Eyebrow>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Select the open mandate you are referring the candidate for.
              </p>
              <div className="mt-6">
                <label className={labelClass} htmlFor="jobSelect">Select position</label>
                {jobsReady ? (
                  <Select
                    value={selectedJobId || undefined}
                    onValueChange={setSelectedJobId}
                  >
                    <SelectTrigger
                      id="jobSelect"
                      className={cn(inputClass, referralSelectTriggerClass)}
                    >
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      sideOffset={6}
                      collisionPadding={12}
                      className="z-[1100] max-h-[min(24rem,calc(100vh-5rem))] rounded-lg border shadow-lg [&_svg]:text-[#f8fafc]"
                      style={{
                        backgroundColor: REFERRAL_SELECT_MENU.background,
                        color: REFERRAL_SELECT_MENU.text,
                        borderColor: REFERRAL_SELECT_MENU.border,
                      }}
                    >
                      {jobs.map((job) => (
                        <SelectItem
                          key={job.jobId}
                          value={job.jobId}
                          textValue={`${job.role} ${job.location}`}
                          className={referralSelectItemClass}
                        >
                          {job.role}, {job.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div
                    id="jobSelect"
                    className={cn(inputClass, "flex min-h-[2.75rem] items-center text-[var(--text-tertiary)]")}
                    aria-disabled="true"
                  >
                    {jobsStatus.tone === "loading" ? "Loading positions…" : "Could not load positions"}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p
                    className={
                      "text-sm " +
                      (jobsStatus.tone === "error"
                        ? "text-[var(--color-live-red,#ff6b6b)]"
                        : jobsStatus.tone === "success"
                          ? "text-[var(--text-secondary)]"
                          : "text-[var(--text-tertiary)]")
                    }
                  >
                    {jobsStatus.text}
                  </p>
                  {showRetry && (
                    <Button type="button" variant="ghost" className="h-9 px-4 text-xs" onClick={loadJobs}>
                      Retry
                    </Button>
                  )}
                </div>

                {selectedJob && (
                  <div className="mt-5 rounded-xl border-l-2 border-[var(--gold)] bg-white/[0.03] p-5 text-sm text-[var(--text-secondary)]">
                    <p className="font-semibold text-[var(--text-primary)]">{selectedJob.role}</p>
                    <p className="mt-1">
                      <span className="text-[var(--text-tertiary)]">Location: </span>
                      {selectedJob.location}
                    </p>
                    {selectedJob.priority && (
                      <p className="mt-1">
                        <span className="text-[var(--text-tertiary)]">Priority: </span>
                        {selectedJob.priority}
                      </p>
                    )}
                    {selectedJob.description && (
                      <p className="mt-1">
                        <span className="text-[var(--text-tertiary)]">Description: </span>
                        {selectedJob.description}
                      </p>
                    )}
                    <p className="mt-1">
                      <span className="text-[var(--text-tertiary)]">Job ID: </span>
                      {selectedJob.jobId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Resume upload */}
            <div className={cardClass}>
              <Eyebrow>Resume</Eyebrow>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Upload the candidate&apos;s resume. PDF or DOCX, max 5MB.
              </p>
              <div className="mt-6">
                <label className={labelClass} htmlFor="resumeFile">Resume file</label>
                <input
                  id="resumeFile"
                  ref={resumeRef}
                  type="file"
                  accept={REFERRAL_RESUME_ACCEPT}
                  className={
                    "block w-full text-sm text-[var(--text-secondary)] " +
                    "file:mr-4 file:rounded-full file:border-0 file:bg-[var(--gold)] file:px-5 file:py-2.5 " +
                    "file:text-sm file:font-medium file:text-[var(--ink)] hover:file:bg-[var(--gold-soft)] file:cursor-pointer"
                  }
                />
                <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                  Supported formats: PDF, DOCX · Max size: 5MB
                </p>
              </div>
            </div>

            {/* Banner */}
            {banner && (
              <div
                ref={bannerRef}
                className={
                  "rounded-xl border p-4 text-sm " +
                  (banner.tone === "success"
                    ? "border-[var(--color-success-green,#10b981)]/40 bg-[var(--color-success-green,#10b981)]/10 text-[var(--color-success-green,#10b981)]"
                    : "border-[var(--color-live-red,#ff6b6b)]/40 bg-[var(--color-live-red,#ff6b6b)]/10 text-[var(--color-live-red,#ff6b6b)]")
                }
                role="status"
              >
                {banner.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                className="sm:flex-1"
                onClick={clearForm}
                disabled={submitting}
              >
                Clear form
              </Button>
              <Button
                type="button"
                variant="primary"
                className="sm:flex-1"
                onClick={submitForm}
                disabled={submitting || !policyChecked}
              >
                {submitting ? "Submitting…" : "Submit referral"}
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* ── PDF policy modal ── */}
      {pdfOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-10 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPdfOpen(false);
          }}
        >
          <div className="w-full max-w-3xl rounded-2xl border border-[var(--gold)]/30 bg-[var(--ink)] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--fog)]/60 pb-4">
              <h2 className="text-lg font-semibold text-[var(--gold-bright)]">Referral Policy 2026</h2>
              <button
                type="button"
                onClick={() => setPdfOpen(false)}
                aria-label="Close"
                className="text-2xl leading-none text-[var(--text-tertiary)] transition hover:text-[var(--text-primary)]"
              >
                ×
              </button>
            </div>
            <iframe
              title="Referral Policy 2026"
              src={REFERRAL_POLICY_PDF_PREVIEW_URL}
              className="h-[60vh] w-full rounded-lg border border-[var(--fog)]/60 bg-white"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <a
                href={REFERRAL_POLICY_PDF_DOWNLOAD_URL}
                download="MIYO_Global_Referral_Policy_2026.pdf"
                className="text-sm font-medium text-[var(--gold-bright)] underline-offset-2 hover:underline"
              >
                Download the PDF
              </a>
              <Button type="button" variant="primary" className="h-10 px-5 text-xs" onClick={() => setPdfOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </MarketingPageShell>
  );
}
