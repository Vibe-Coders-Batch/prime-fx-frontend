export type Instructor = {
  name: string;
  credential: string;
  portrait: string;
  portraitPosition?: string;
  /** Optional gold line under the credential. Omit rather than invent one. */
  meta?: string;
};

export type FeaturedInstructor = Instructor & { quote: string };

/**
 * Set once a trainer has a quote cleared for publication. Until then the
 * Spotlight hero stays hidden and the page leads with the trainer grid.
 */
export const FEATURED_INSTRUCTOR: FeaturedInstructor | null = null;

function trainerPortrait(filename: string): string {
  return `/team/${filename}`;
}

/**
 * Signed trainer faculty. Names, designations and portraits are taken from the
 * approved partner deck (slide 7, "Our Trainers").
 */
export const INSTRUCTORS: Instructor[] = [
  {
    name: "Dr. Anudeep Peddi",
    credential: "Agentic AI",
    portrait: trainerPortrait("anudeep-peddi.png"),
  },
  {
    name: "Harleen Kaur",
    credential: "Financial Wellness",
    portrait: trainerPortrait("harleen-kaur.png"),
  },
  {
    name: "Supriya Biswas",
    credential: "Behavioural & Leadership, Soft Skills",
    portrait: trainerPortrait("supriya-biswas.png"),
  },
];
