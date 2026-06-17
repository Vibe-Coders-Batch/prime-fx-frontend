export type StaffingSpecialization = {
  title: string;
  blurb: string;
};

export type StaffingRegionConfig = {
  slug: "india-staffing" | "middle-east-staffing";
  eyebrow: string;
  /** Visible hero headline (also used in metadata). */
  headline: string;
  /** SEO keyword phrase — must appear inside the page <h1>. */
  seoKeyword: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  specializations: StaffingSpecialization[];
  complianceTitle: string;
  complianceCopy: string;
  sibling: { label: string; href: string; blurb: string };
};

/** Staffing inbox — mailto links and quick-enquiry forms. */
export const STAFFING_EMAIL = "staffing@primelearning.ae";

export const INDIA_STAFFING: StaffingRegionConfig = {
  slug: "india-staffing",
  eyebrow: "India · Staffing",
  headline: "Scaling India’s Finest Talent. Fueling Global Innovation.",
  seoKeyword: "IT staffing agency India",
  subheadline:
    "We connect leading enterprises, high-growth startups, and Global Capability Centres (GCCs) with India’s top-tier tech, engineering, and leadership talent.",
  primaryCta: { label: "Partner With Us", href: `mailto:${STAFFING_EMAIL}?subject=India%20Staffing%20Partnership` },
  secondaryCta: { label: "Build Your Team", href: "/contact" },
  specializations: [
    {
      title: "GCC & Captive Center Setup",
      blurb:
        "Turnkey talent mapping, incubation hiring, and leadership acquisition to establish or scale Global Capability Centres in India’s major tech hubs.",
    },
    {
      title: "Technology & Digital Transformation",
      blurb:
        "Access the top 5% of software engineers, data scientists, cloud architects, and product managers through rigorous technical screening.",
    },
    {
      title: "High-Volume & Lateral Staffing",
      blurb:
        "Scalable recruitment machinery designed to manage massive applicant funnels without compromising on quality or time-to-hire.",
    },
    {
      title: "Executive Search & Leadership",
      blurb:
        "Securing visionary CXOs and functional leaders who understand both local operational nuances and global business standards.",
    },
  ],
  complianceTitle: "Statutory Trust & Compliance",
  complianceCopy:
    "100% compliant with Indian labor laws, including the Contract Labour (Regulation & Abolition) Act, EPF/ESI statutory mandates, and regional shop & establishment regulations. We mitigate your risk entirely.",
  sibling: {
    label: "Middle East Staffing",
    href: "/middle-east-staffing",
    blurb: "Cross-border mobilization, nationalization, and mega-project staffing across the GCC.",
  },
};

export const MIDDLE_EAST_STAFFING: StaffingRegionConfig = {
  slug: "middle-east-staffing",
  eyebrow: "Middle East · Staffing",
  headline: "Empowering Middle East Enterprises with World-Class Talent.",
  seoKeyword: "staffing agency Middle East",
  subheadline:
    "Cross-border recruitment, executive search, and nationalization solutions tailored for mega-projects, enterprise transformations, and localized growth.",
  primaryCta: { label: "Request a Consultation", href: `mailto:${STAFFING_EMAIL}?subject=Middle%20East%20Staffing%20Consultation` },
  secondaryCta: { label: "Source Global Talent", href: "/contact" },
  specializations: [
    {
      title: "Global Talent Mobilization",
      blurb:
        "Seamless end-to-end relocation, visa processing navigation, and international sourcing networks to bring specialized talent to the GCC region.",
    },
    {
      title: "Nationalization Solutions",
      blurb:
        "Strategic consulting and targeted sourcing to help your organization meet and exceed Saudization and Emiratisation local workforce quotas with highly skilled nationals.",
    },
    {
      title: "Mega-Project & Infrastructure Staffing",
      blurb:
        "Workforce solutions built for large-scale energy, construction, logistics, and smart-city initiatives requiring rapid mobilization of technical specialists.",
    },
    {
      title: "Executive Search & Board Advisory",
      blurb:
        "Local market insight combined with global reach to place C-suite executives capable of driving transformation in diversified conglomerates and public sectors.",
    },
  ],
  complianceTitle: "Regional Compliance & Onboarding Excellence",
  complianceCopy:
    "Fully integrated with local labor portals (including Qiwa, GOSI, and MOHRE guidelines). We ensure every placement respects local cultural frameworks, labor laws, and compliance standards from day one.",
  sibling: {
    label: "India Staffing",
    href: "/india-staffing",
    blurb: "High-velocity tech hiring, GCC captive setup, and compliant scaling across India’s major hubs.",
  },
};

export const STAFFING_HUBS = [
  {
    slug: "india-staffing" as const,
    title: "India Staffing",
    headline: INDIA_STAFFING.headline,
    blurb: "Tech-heavy, high-velocity hiring for enterprises, startups, and GCC captive centres.",
    href: "/india-staffing",
    accent: "electric" as const,
  },
  {
    slug: "middle-east-staffing" as const,
    title: "Middle East Staffing",
    headline: MIDDLE_EAST_STAFFING.headline,
    blurb: "Global mobilization, nationalization, and infrastructure mega-project workforce delivery.",
    href: "/middle-east-staffing",
    accent: "gold" as const,
  },
];
