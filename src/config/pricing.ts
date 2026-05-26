import { useRegion, type Region } from "@/context/RegionContext";

// Single support contact number used across the entire website.
export const SUPPORT_PHONE = "+91 95505 33955";
export const SUPPORT_PHONE_HREF = "tel:+919550533955";

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
    contactLine: "India · prime@primelearning.ae",
    email: "prime@primelearning.ae",
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
