import { useRegion, type Region } from "@/context/RegionContext";

export {
  COMMUNICATION_CONTACTS,
  SUPPORT_PHONE,
  SUPPORT_PHONE_HREF,
} from "@/config/contact";

export const OFFICE_LOCATION = {
  name: "MIYO Global Office (Trendz Trinity)",
  streetAddress: "Plot No. 21, Madhapur, Gafoornagar",
  addressLocality: "Hyderabad",
  addressRegion: "Telangana",
  postalCode: "500081",
  addressCountry: "IN",
} as const;

export const OFFICE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    "MIYO Global Office, Trendz Trinity, Plot No. 21, Madhapur, Gafoornagar, Hyderabad, Telangana 500081"
  );

export type PriceKey =
  | "applied_llm"
  | "ai_fluency_leaders"
  | "generative_ai_product"
  | "ai_safety"
  | "ai_fluency_program"
  | "team_per_seat";

export const PRICES: Record<PriceKey, { AE: string; IN: string }> = {
  applied_llm: { AE: "AED 1,890", IN: "₹42,500" },
  ai_fluency_leaders: { AE: "AED 1,290", IN: "₹29,000" },
  generative_ai_product: { AE: "AED 1,590", IN: "₹35,750" },
  ai_safety: { AE: "AED 2,190", IN: "₹49,250" },
  ai_fluency_program: { AE: "AED 4,900", IN: "₹1,10,000" },
  team_per_seat: { AE: "AED 990/seat/mo", IN: "₹22,250/seat/mo" },
};

export const REGION_CONTENT: Record<
  Region,
  {
    contactLine: string;
    email: string;
    applyCta: string;
    paymentNote: string;
    currencyLabel: string;
  }
> = {
  IN: {
    contactLine: "India · learning@primelearning.ae",
    email: "learning@primelearning.ae",
    applyCta: "Apply from India",
    paymentNote: "All prices in INR. Payments via Razorpay, UPI, and cards.",
    currencyLabel: "₹ INR",
  },
  AE: {
    contactLine: "UAE · hello@primelearning.ae",
    email: "hello@primelearning.ae",
    applyCta: "Reserve Your Seat",
    paymentNote: "All prices in AED. Payments via Stripe and cards.",
    currencyLabel: "AED",
  },
};

export function getPrice(key: PriceKey, region: Region): string {
  return PRICES[key][region];
}
