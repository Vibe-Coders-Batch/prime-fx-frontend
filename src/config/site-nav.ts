export type NavItem = {
  label: string;
  href: string;
};

/** Primary marketing navigation - use `/#section` for homepage anchors. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Spotlight", href: "/spotlight" },
  { label: "Staffing", href: "/staffing" },
  { label: "Referral", href: "/referral" },
  { label: "Leadership", href: "/leadership" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];
