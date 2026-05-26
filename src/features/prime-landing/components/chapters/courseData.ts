import type { Region } from "@/context/RegionContext";
import { getPrice, type PriceKey } from "@/config/pricing";

export interface Course {
  title: string;
  instructor: string;
  duration: string;
  priceAed: number;
  priceInr: number;
  priceKey?: PriceKey;
  image: string;
  imageAlt: string;
  gradient: string;
  pattern: "dots" | "grid" | "lines" | "waves";
}

export function getCoursePriceLabel(course: Course, region: Region): string {
  if (course.priceKey) {
    return getPrice(course.priceKey, region);
  }
  const amount = region === "AE" ? course.priceAed : course.priceInr;
  const prefix = region === "AE" ? "AED " : "₹";
  return `${prefix}${amount.toLocaleString("en-IN")}`;
}

export const COURSES: Record<string, Course[]> = {
  AI: [
    {
      title: "Applied Large Language Models",
      instructor: "Dr. Sana Al-Khouri",
      duration: "8 weeks",
      priceAed: 1890,
      priceInr: 42500,
      priceKey: "applied_llm",
      image: "/courses/ai/1.jpg",
      imageAlt: "Abstract imagery evoking large language models",
      gradient: "rgba(37,99,235,0.45)",
      pattern: "dots",
    },
    {
      title: "AI Fluency for Leaders",
      instructor: "Rahul Menon",
      duration: "4 weeks",
      priceAed: 1290,
      priceInr: 29000,
      priceKey: "ai_fluency_leaders",
      image: "/courses/ai/2.jpg",
      imageAlt: "AI imagery for business leaders",
      gradient: "rgba(224,180,88,0.4)",
      pattern: "grid",
    },
    {
      title: "Generative AI for Product",
      instructor: "Leila Farag",
      duration: "6 weeks",
      priceAed: 1590,
      priceInr: 35750,
      priceKey: "generative_ai_product",
      image: "/courses/ai/3.jpg",
      imageAlt: "Generative AI visualization for product teams",
      gradient: "rgba(17,34,64,0.45)",
      pattern: "lines",
    },
    {
      title: "AI Safety & Alignment",
      instructor: "Prof. Jamil Haddad",
      duration: "10 weeks",
      priceAed: 2190,
      priceInr: 49250,
      priceKey: "ai_safety",
      image: "/courses/ai/4.jpg",
      imageAlt: "Imagery evoking AI safety and alignment",
      gradient: "rgba(11,25,47,0.5)",
      pattern: "waves",
    },
  ],
  "Data Science": [
    {
      title: "Statistics for Practitioners",
      instructor: "Dr. Alina Petrov",
      duration: "6 weeks",
      priceAed: 1490,
      priceInr: 33500,
      image: "/courses/data-science/1.jpg",
      imageAlt: "Data science imagery with statistical motifs",
      gradient: "rgba(17,34,64,0.45)",
      pattern: "grid",
    },
    {
      title: "SQL, From Query to Insight",
      instructor: "Kwame Boateng",
      duration: "5 weeks",
      priceAed: 990,
      priceInr: 22250,
      image: "/courses/data-science/2.jpg",
      imageAlt: "Abstract visualization of structured data",
      gradient: "rgba(37,99,235,0.42)",
      pattern: "lines",
    },
    {
      title: "Python for Data",
      instructor: "Maya Kapoor",
      duration: "8 weeks",
      priceAed: 1690,
      priceInr: 38000,
      image: "/courses/data-science/3.jpg",
      imageAlt: "Code-like abstract data visualization",
      gradient: "rgba(11,25,47,0.52)",
      pattern: "dots",
    },
    {
      title: "Visualization & Storytelling",
      instructor: "Giovanni Rossi",
      duration: "4 weeks",
      priceAed: 890,
      priceInr: 20000,
      image: "/courses/data-science/4.jpg",
      imageAlt: "Data visualization storytelling imagery",
      gradient: "rgba(224,180,88,0.38)",
      pattern: "waves",
    },
  ],
  Product: [
    {
      title: "Product Management Core",
      instructor: "Ayesha Farooq",
      duration: "10 weeks",
      priceAed: 2490,
      priceInr: 56000,
      image: "/courses/product-management/1.jpg",
      imageAlt: "Imagery evoking product strategy",
      gradient: "rgba(224,180,88,0.42)",
      pattern: "dots",
    },
    {
      title: "Discovery to Delivery",
      instructor: "Henry Nakamura",
      duration: "6 weeks",
      priceAed: 1490,
      priceInr: 33500,
      image: "/courses/product-management/2.jpg",
      imageAlt: "Abstract imagery for product discovery workflow",
      gradient: "rgba(37,99,235,0.42)",
      pattern: "lines",
    },
    {
      title: "Pricing & Growth",
      instructor: "Noura Al-Maktoum",
      duration: "5 weeks",
      priceAed: 1290,
      priceInr: 29000,
      image: "/courses/product-management/3.jpg",
      imageAlt: "Imagery evoking pricing and growth strategy",
      gradient: "rgba(224,180,88,0.4)",
      pattern: "grid",
    },
    {
      title: "Technical PM Essentials",
      instructor: "Marcus Lindqvist",
      duration: "8 weeks",
      priceAed: 1890,
      priceInr: 42500,
      image: "/courses/product-management/4.jpg",
      imageAlt: "Imagery for technical product management",
      gradient: "rgba(17,34,64,0.45)",
      pattern: "waves",
    },
  ],
};

export const CATEGORIES = Object.keys(COURSES) as (keyof typeof COURSES)[];
