export type FellowshipPhase = {
  code: string;
  name: string;
  deliverable: string;
};

export type FellowshipEvent = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  meta: string;
  regions: ("IN" | "AE" | "GLOBAL")[];
  format: string;
  phases: FellowshipPhase[];
  footer: string;
};

export const FLAGSHIP_EVENTS: FellowshipEvent[] = [
  {
    id: "agentic-ai-builders",
    tag: "Fellowship 01",
    title: "The Agentic AI Builders Fellowship",
    subtitle: "Zero to Deployed",
    meta: "7 Phases · 50 Sessions",
    regions: ["IN", "AE", "GLOBAL"],
    format: "Closed-door cohort · Executive & builder track",
    phases: [
      { code: "P0", name: "Onboarding", deliverable: "Environment setup" },
      { code: "P1", name: "Python for AI", deliverable: "CLI Tool (Capstone)" },
      { code: "P2", name: "LLM Foundations", deliverable: "API Wrappers" },
      { code: "P3", name: "Data & Embeddings", deliverable: "Feeds Phase 4" },
      { code: "P4", name: "RAG Mastery", deliverable: "RAG Pipeline (Capstone)" },
      { code: "P5", name: "Agents & Agentic AI", deliverable: "Multi-Agent (Capstone)" },
      { code: "P6", name: "Vibe-Coding & Shipping", deliverable: "Deployed Product (Capstone)" },
    ],
    footer:
      "9 Portfolio Projects · Every project ships · Session 49 = Your first live AI product",
  },
  {
    id: "ai-generalist-global",
    tag: "Fellowship 02",
    title: "The AI Generalist Global Fellowship",
    subtitle: "Zero to Deployed",
    meta: "5 Modules · 25 Sessions",
    regions: ["IN", "AE", "GLOBAL"],
    format: "Live cohort · India & UAE time zones",
    phases: [
      { code: "M1", name: "Prompt Engineering + RAG", deliverable: "AI Concierge + RAG Chatbot" },
      { code: "M2", name: "Automations Foundations", deliverable: "Business Workflow Live" },
      { code: "M3", name: "Automations Advanced", deliverable: "AI Agent Running" },
      { code: "M4", name: "Vibe-Coding", deliverable: "Moris Eats Web App" },
      { code: "M5", name: "Deployments + Emergent", deliverable: "Live URL + Mobile App" },
    ],
    footer: "Every session ships something · Session 25 = your product, live",
  },
];

export const UPCOMING_SESSIONS = [
  {
    title: "Agentic AI Executive Briefing",
    location: "Dubai, UAE",
    region: "AE" as const,
    date: "By invitation",
  },
  {
    title: "Builders Fellowship — Hyderabad Cohort",
    location: "Hyderabad, India",
    region: "IN" as const,
    date: "Enrollment open",
  },
  {
    title: "AI Generalist — Live Online",
    location: "India & UAE",
    region: "GLOBAL" as const,
    date: "Rolling intake",
  },
];
