import { OFFICE_LOCATION, OFFICE_MAPS_URL } from "@/config/pricing";
import {
  COMMUNICATION_CONTACTS,
} from "@/config/contact";

/** Single source of truth for company identity, offices, and contact channels. */

export const COMPANY = {
  legalName: "Miyo Global Private Limited",
  uaeLegalName: "Prime Assets Education & Training Ltd.",
  brandName: "Prime Learning",
  tagline: "Learn Smarter. Grow Faster. Lead With Purpose.",
  cin: "U10202TS2026PTC212596",
  pan: "AAUCM6364N",
} as const;

export type Office = {
  label: string;
  name: string;
  lines: string[];
  region: string;
  mapsUrl: string;
};

export const OFFICES: Office[] = [
  {
    label: "Registered Office",
    name: COMPANY.legalName,
    lines: [
      "K.Y.R. Heights, 1st Floor",
      "Plot No. 4338A & 433/B, Vivekananda Nagar",
      "Allapur, Hitech City Road, Kondapur",
      "Serilingampally, Hyderabad 500084",
      "Telangana, India",
    ],
    region: "India",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "K.Y.R. Heights, Vivekananda Nagar, Allapur, Hitech City Road, Kondapur, Serilingampally, Hyderabad 500084, Telangana, India"
      ),
  },
  {
    label: "Operations Office",
    name: OFFICE_LOCATION.name,
    lines: [
      OFFICE_LOCATION.streetAddress,
      `${OFFICE_LOCATION.addressLocality}, ${OFFICE_LOCATION.addressRegion} ${OFFICE_LOCATION.postalCode}`,
      "India",
    ],
    region: "India",
    mapsUrl: OFFICE_MAPS_URL,
  },
  {
    label: "UAE Office",
    name: COMPANY.uaeLegalName,
    lines: [
      "Office A, RAK DAO Business Centre",
      "RAK Bank ROC office, Ground Floor",
      "Al Riffa, Sheikh Mohammed Bin Zayed Road",
      "Ras Al Khaimah, United Arab Emirates",
    ],
    region: "UAE",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "RAK DAO Business Centre, Al Riffa, Sheikh Mohammed Bin Zayed Road, Ras Al Khaimah, United Arab Emirates"
      ),
  },
];

export type ContactChannel = {
  label: string;
  description: string;
  email: string;
  region?: string;
};

/** Purpose driven email channels shown on the Contact page. */
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: "Learning & Programmes",
    description:
      "Course access, enrolments, certificates, UAE programmes, and general enquiries.",
    email: "learning@primelearning.ae",
  },
  {
    label: "Staffing & Hiring",
    description: "Talent placement and corporate staffing partnerships.",
    email: "staffing@primelearning.ae",
  },
];

/** Primary human contact, sourced from the shared communication config. */
export const PRIMARY_CONTACT = {
  name: COMMUNICATION_CONTACTS[0].contactName,
  division: COMMUNICATION_CONTACTS[0].division,
  email: COMMUNICATION_CONTACTS[0].email,
} as const;

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    handle: "prime-elearning",
    href: "https://www.linkedin.com/company/prime-elearning",
  },
  {
    label: "Instagram",
    handle: "@primeelearning",
    href: "https://www.instagram.com/primeelearning",
  },
  {
    label: "X (Twitter)",
    handle: "@primetraining",
    href: "https://twitter.com/primetraining",
  },
];

export type RegionPresence = {
  flag: string;
  name: string;
  note: string;
};

export const REGIONS: RegionPresence[] = [
  { flag: "🇮🇳", name: "India", note: "Hyderabad headquarters and cohorts across the country." },
  { flag: "🇦🇪", name: "UAE", note: "In person Dubai seminars and remote programmes." },
  { flag: "🌍", name: "Global", note: "Remote first programmes for professionals worldwide." },
];
