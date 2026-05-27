export type LeadershipMember = {
  name: string;
  role: string;
  portrait: string;
  /** Zoom factor for the circular portrait (1 = no zoom). Use to re-center
   * faces that are framed too small/high in the source image. */
  portraitZoom?: number;
};

export const FEATURED_LEADER = {
  name: "Sudheer Reddy",
  role: "Chief Executive Officer",
  portrait: "/team/sudheer-reddy.png",
  quote:
    "Prime Learning exists for professionals who need to ship real outcomes — not collect certificates. That standard holds across India, the UAE, and every market we serve.",
};

export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    name: "Prudvidhar Reddy",
    role: "Managing Director",
    portrait: "/team/prudvidhar-reddy.png",
  },
  {
    name: "Sudheer Reddy",
    role: "Chief Executive Officer",
    portrait: "/team/sudheer-reddy.png",
  },
  {
    name: "Rajesh Chandra Roy",
    role: "Vice President",
    portrait: "/team/rajesh-chandra-roy.png",
  },
  {
    name: "Vijay Sarathi",
    role: "India Business Head",
    portrait: "/team/vijay-sarathi.png",
    portraitZoom: 1.45,
  },
  {
    name: "Biswajit Sircar",
    role: "Senior Director — HR",
    portrait: "/team/biswajit-sircar.png",
    portraitZoom: 1.22,
  },
];
