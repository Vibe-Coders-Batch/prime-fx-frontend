export type NavItem = {
  label: string;
  href: string;
};

/** Primary marketing navigation - use `/#section` for homepage anchors. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Events", href: "/events" },
  { label: "Spotlight", href: "/spotlight" },
  { label: "Staff Augmentation", href: "/staffing" },
  { label: "Blog", href: "/blogs" },
  { label: "Referral", href: "/referral" },
  { label: "Contact", href: "/contact" },
];
