/**
 * MIYO Global candidate referral program configuration.
 *
 * The jobs list and the referral submission are handled by a Google Apps Script
 * web app. The URL must end in `/exec` (not `/usercontent`) for the GET (jobs)
 * and POST (submission) calls to work.
 */
export const REFERRAL_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwicD4imd-odXbCAF1Wtyw802_pSx9GHumZfslYjdu3js1OEghIBEBmkk3pvX79fSu1/exec";

/** Google Drive preview + export links for the referral policy PDF. */
export const REFERRAL_POLICY_PDF_PREVIEW_URL =
  "https://drive.google.com/file/d/1fHrvCIN6mS63UvmdiOvW7LJdNLHm9kGq/preview";
export const REFERRAL_POLICY_PDF_DOWNLOAD_URL =
  "https://drive.google.com/file/d/1fHrvCIN6mS63UvmdiOvW7LJdNLHm9kGq/export?format=pdf";

/** Headline reward for a successful referral. */
export const REFERRAL_REWARD = "₹15,000";

/** Maximum resume upload size (5 MB). */
export const REFERRAL_MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** Accepted resume file types. */
export const REFERRAL_RESUME_ACCEPT = ".pdf,.docx";

/** Summary rows shown in the Referral Policy 2026 card. */
export const REFERRAL_POLICY_SUMMARY: { label: string; value: string }[] = [
  { label: "Reward amount", value: `${REFERRAL_REWARD} (subject to TDS)` },
  { label: "Profile validity", value: "90 days from submission" },
  { label: "Payout timeline", value: "45 days from onboarding" },
  { label: "Payment mode", value: "NEFT / IMPS bank transfer" },
  { label: "Manager approval", value: "Required before payout" },
];

/** A single open position returned by the Apps Script jobs endpoint. */
export type ReferralJob = {
  jobId: string;
  role: string;
  location: string;
  priority?: string;
  description?: string;
  hmEmail?: string;
};
