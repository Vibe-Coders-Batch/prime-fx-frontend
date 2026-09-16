export type NavItem = {
  label: string;
  href: string;
};

/** Primary marketing navigation - use `/#section` for homepage anchors. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Leadership", href: "/leadership" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];
