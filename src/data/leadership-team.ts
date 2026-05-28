export type LeadershipMember = {
  name: string;
  role: string;
  portrait: string;
  /** Short intro shown on leadership card hover. */
  summary: string;
  /** Key expertise bullets for leadership card hover. */
  highlights: string[];
  /** Zoom factor for the circular portrait (1 = no zoom). Use to re-center
   * faces that are framed too small/high in the source image. */
  portraitZoom?: number;
};

/** Bump when replacing files under `public/team/` — used as React `key` to remount portraits. */
export const TEAM_PORTRAIT_CACHE_VERSION = "20260528-shiv";

function teamPortrait(filename: string): string {
  return `/team/${filename}`;
}

export const FEATURED_LEADER = {
  name: "Sudheer Reddy",
  role: "Chief Executive Officer",
  portrait: teamPortrait("sudheer-reddy.png"),
  quote:
    "Prime Learning exists for professionals who need to ship real outcomes — not collect certificates. That standard holds across India, the UAE, and every market we serve.",
};

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    name: "Prudvidhar Reddy",
    role: "Managing Director",
    portrait: teamPortrait("prudvidhar-reddy.png"),
    summary:
      "Leads enterprise strategy and day-to-day operations for Prime Learning and allied businesses across India and the UAE.",
    highlights: [
      "P&L ownership and operational governance",
      "Partnerships with SI and product-led organisations",
      "Scaling delivery across India and the MEA region",
    ],
  },
  {
    name: "Sudheer Reddy",
    role: "Chief Executive Officer",
    portrait: teamPortrait("sudheer-reddy.png"),
    summary:
      "Sets the vision for outcomes-driven learning — programmes built to ship real skills, not shelf credentials.",
    highlights: [
      "Executive leadership across India, UAE, and global markets",
      "Premium cohort and enterprise learning strategy",
      "Standards for faculty, curriculum, and learner outcomes",
    ],
  },
  {
    name: "Rajesh Chandra Roy",
    role: "Vice President",
    portrait: teamPortrait("rajesh-chandra-roy.png"),
    summary:
      "Drives commercial growth, client relationships, and programme expansion for corporate and institutional partners.",
    highlights: [
      "Enterprise sales and account leadership",
      "Market development across key sectors",
      "Revenue and partnership execution",
    ],
  },
  {
    name: "Vijay Sarathi",
    role: "India Business Head",
    portrait: teamPortrait("vijay-sarathi.png"),
    portraitZoom: 1.45,
    summary:
      "Heads India market development for Prime Learning — learner acquisition, institutional ties, and regional growth.",
    highlights: [
      "India go-to-market and business development",
      "Corporate and learner engagement",
      "Primary contact for Prime Learning programmes",
    ],
  },
  {
    name: "Biswajit Sircar",
    role: "Senior Director — HR",
    portrait: teamPortrait("biswajit-sircar.png"),
    portraitZoom: 1.22,
    summary:
      "Leads people operations and staffing programmes — workforce planning, compliance, and talent delivery at scale.",
    highlights: [
      "HR leadership and workforce strategy",
      "Staffing and MSP/VMS programme management",
      "Primary contact for Prime Learning — Staffing",
    ],
  },
  {
    name: "Shiv Srivastav",
    role: "Director — Staffing & Growth",
    portrait: teamPortrait("shiv-srivastav.png"),
    portraitZoom: 1.12,
    summary:
      "17+ years in business management, growth, and staffing solutions across India and the MEA region.",
    highlights: [
      "P&L and business ownership — operations, workforce transitions, and IT rebadging",
      "End-to-end delivery for SI and product clients across India and MEA",
      "MEA expansion — channel partners for payroll and compliance",
      "Brand enhancement for manpower services in Dubai, KSA, Qatar, Oman, and Egypt",
      "Leads 100+ member recruitment and sales teams; enterprise MSP/VMS programmes",
    ],
  },
];
