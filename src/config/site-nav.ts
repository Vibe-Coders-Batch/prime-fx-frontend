export type NavItem = {
  label: string;
  href: string;
};

/** Primary marketing navigation — use `/#section` for homepage anchors. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Events", href: "/events" },
  { label: "Spotlight", href: "/spotlight" },
  { label: "Staffing", href: "/staffing" },
  { label: "Plans", href: "/#chapter-plans" },
  { label: "Leadership", href: "/leadership" },
  { label: "Blog", href: "/blogs" },
];
