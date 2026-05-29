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
      "Transition & transformation leader with 30+ years building learning ecosystems that enable enterprise change aligning capability, talent, and execution across India and the MEA region.",
    highlights: [
      "Large-scale transformation experience across Energy & Utilities, Financial Services, and Telecommunications",
      "Capability building: enterprise learning ecosystems, LMS strategy, and workforce AI readiness",
      "Business continuity and disaster recovery leadership for mission-critical programmes",
      "Fortune 100 and government programme engagements; multi-geo delivery and turnaround execution",
    ],
  },
  {
    name: "Vijaya Saradhi",
    role: "India Business Head",
    portrait: teamPortrait("vijay-sarathi.png"),
    portraitZoom: 1.45,
    summary:
      "Leads university partnerships and business development for outcome-driven AI & tech training bringing hands-on, industry-ready programmes to campuses across India.",
    highlights: [
      "Partners with universities and colleges to bridge academia ↔ industry skills gaps",
      "MoU-based collaborations aligned to academic calendars and student learning levels",
      "Programme focus: Agentic AI, Data Analytics, Prompt Engineering, LLMs, and applied tech tracks",
      "Helps institutions future-proof students with structured, hands-on training delivered on campus",
      "Primary contact for Prime Learning (learning@primelearning.ae)",
    ],
  },
  {
    name: "Biswajit Sircar",
    role: "Senior Director — HR",
    portrait: teamPortrait("biswajit-sircar.png"),
    portraitZoom: 1.22,
    summary:
      "Global talent acquisition leader (21+ years) building scalable hiring engines across cloud, AI, BFSI, and next‑gen telecom — turning recruiting into measurable business impact.",
    highlights: [
      "$29M+ cost savings via vendor optimization, contractor rate strategy, and internal mobility",
      "2,400+ hires across EMEA, APAC, and China in AI, cloud-native engineering, and telecom product teams",
      "Built and led large ecosystems: 50-member TA team + 200+ supplier network; 5,000+ offers closed in a year",
      "Workforce planning & analytics, contingent workforce (GCC/MSP), and TA process automation (Workday/ATS)",
      "Primary contact for Prime Learning — Staffing",
    ],
  },
  {
    name: "Shivji Srivastav",
    role: "Operation Head - Staff Augmentation",
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
