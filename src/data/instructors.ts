export type Instructor = {
  name: string;
  credential: string;
  courses: number;
  portrait: string;
  portraitPosition?: string;
};

export const FEATURED_INSTRUCTOR = {
  name: "Mei Lin",
  credential: "Principal Engineer, ex-Stripe",
  courses: 6,
  portrait:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80",
  quote:
    "The best craftspeople I've ever worked with were also the best teachers. Prime Learning finally gives them the stage they deserve.",
};

export const INSTRUCTORS: Instructor[] = [
  {
    name: "Mei Lin",
    credential: "Principal Engineer, ex-Stripe",
    courses: 6,
    portrait:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "Vinay Kumar",
    credential: "AI and Healthcare Consultant",
    courses: 4,
    portrait: "/team/VinayKumar.png",
    portraitPosition: "center 25%",
  },
  {
    name: "Priya Sharma",
    credential: "Founding ML Engineer, ex-Anthropic",
    courses: 3,
    portrait:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=70",
  },
  {
    name: "Jonas Veldt",
    credential: "Cinematographer, A24",
    courses: 5,
    portrait:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=70",
  },
];
