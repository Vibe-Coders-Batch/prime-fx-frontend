"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { defaultTransition, fadeUp, staggerContainer } from "@/lib/marketing-motion";
import { PRIMARY_NAV } from "@/config/site-nav";
import { parseNavHref, scrollToHash } from "@/lib/site-navigation";
import { RegionToggle } from "@/components/RegionToggle";
import { Button } from "@/features/prime-landing/components/ui/Button";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";

type MarketingNavProps = {
  /** Landing homepage: hide on scroll down, theme from scroll store */
  variant?: "landing" | "static";
};

export function MarketingNav({ variant = "static" }: MarketingNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = variant === "landing";
  const scrollY = useScrollStore((s) => s.scrollY);
  const theme = useScrollStore((s) => s.theme);
  const [visible, setVisible] = useState(!isLanding);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoKey, setLogoKey] = useState(0);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const hasAnimatedRef = useRef(false);
  const lastYRef = useRef(0);

  const navTheme = isLanding ? theme : "ink";
  const isPaper = navTheme === "paper";

  useEffect(() => {
    // Landing page uses Lenis + scroll store. Other pages use native scroll.
    if (!isLanding) return;

    const heroThreshold = window.innerHeight * 0.6;
    const pastHero = scrollY > heroThreshold;

    if (!pastHero) {
      setVisible(true);
      lastYRef.current = scrollY;
      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        setLogoKey((k) => k + 1);
      }
      return;
    }

    const lastY = lastYRef.current;
    const delta = scrollY - lastY;
    lastYRef.current = scrollY;

    const DEADZONE = 8;
    if (delta > DEADZONE) setVisible(false);
    else if (delta < -DEADZONE) setVisible(true);

    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      setLogoKey((k) => k + 1);
    }
  }, [scrollY, isLanding]);

  useEffect(() => {
    if (isLanding) return;

    const DEADZONE = 8;
    const TOP_STICKY = 96;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        const lastY = lastYRef.current;
        const delta = y - lastY;
        lastYRef.current = y;

        if (y < TOP_STICKY) {
          setVisible(true);
        } else if (delta > DEADZONE) {
          setVisible(false);
        } else if (delta < -DEADZONE) {
          setVisible(true);
        }

        if (!hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setLogoKey((k) => k + 1);
        }
      });
    };

    // Initialize.
    lastYRef.current = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    setVisible(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isLanding]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navigate = (href: string) => {
    const { path, hash } = parseNavHref(href);

    if (hash && (pathname === "/" || path === "/") && pathname === path) {
      scrollToHash(hash);
      setMenuOpen(false);
      return;
    }

    if (hash) {
      router.push(`${path}${hash}`);
      setMenuOpen(false);
      return;
    }

    router.push(path);
    setMenuOpen(false);
  };

  return (
    <>
      <Link
        href="/#chapter-gate"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[var(--gold)] focus:px-3 focus:py-2 focus:text-[var(--ink)]"
      >
        Skip to content
      </Link>

      <nav
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-4 py-3 transition-all duration-500 sm:px-6 lg:px-10 lg:py-4 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          background: isPaper ? "rgba(255,252,245,0.92)" : "rgba(11,25,47,0.92)",
          backdropFilter: "blur(10px)",
          color: isPaper ? "var(--ink)" : "white",
        }}
        aria-label="Primary"
      >
        <Link
          key={logoKey}
          href="/"
          className={`group inline-flex shrink-0 items-center transition-transform duration-500 ease-out hover:scale-[1.03] active:scale-[0.99]${logoKey > 0 && isLanding ? " logo-appear" : ""}`}
          aria-label="Prime Learning home"
        >
          <Image
            src="/brand/mobile-icon.png"
            alt="Prime Learning"
            width={56}
            height={56}
            className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:hidden"
            priority
          />
          <Image
            src={isPaper ? "/logo.svg" : "/logo-dark.svg"}
            alt="Prime Learning"
            width={520}
            height={304}
            className="hidden h-28 w-auto max-w-[min(720px,75vw)] object-contain object-left opacity-95 transition-[opacity,transform] duration-500 group-hover:opacity-100 lg:block xl:h-32 xl:max-w-[840px]"
            priority
          />
        </Link>

        <ul
          className="relative hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto rounded-full border px-1.5 py-1 text-xs lg:flex xl:text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            borderColor: isPaper ? "rgba(11,25,47,0.08)" : "rgba(255,255,255,0.08)",
            background: isPaper ? "rgba(11,25,47,0.03)" : "rgba(255,255,255,0.04)",
          }}
          onMouseLeave={() => setHoveredHref(null)}
        >
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href;
            const hovered = hoveredHref === item.href;
            return (
              <li key={item.href} className="shrink-0">
                <a
                  href={item.href}
                  onMouseEnter={() => setHoveredHref(item.href)}
                  onFocus={() => setHoveredHref(item.href)}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  className="group relative z-10 inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 font-medium tracking-wide outline-none transition-[color,transform] duration-300 hover:scale-[1.04]"
                  style={{ color: hovered ? "var(--ink)" : undefined, opacity: hovered ? 1 : 0.7 }}
                  aria-current={active ? "page" : undefined}
                >
                  {hovered && (
                    <motion.span
                      layoutId="nav-spotlight"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--gold-bright), var(--gold))",
                        boxShadow:
                          "0 0 0 1px rgba(212,175,55,0.55), 0 8px 22px -6px rgba(212,175,55,0.7), 0 0 16px rgba(212,175,55,0.4)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 }}
                    />
                  )}
                  <span className="relative">
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                        style={{ background: hovered ? "var(--ink)" : "var(--gold-bright)" }}
                      />
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile: hamburger only. Desktop: region + CTA */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <motion.button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--fog)] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="marketing-nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            whileTap={{ scale: 0.94 }}
          >
            <span className="sr-only">Menu</span>
            <motion.span
              aria-hidden="true"
              className="relative block h-3.5 w-[18px]"
              animate={menuOpen ? "open" : "closed"}
            >
              {[
                { top: 0, closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } },
                { top: 6, closed: { opacity: 1 }, open: { opacity: 0 } },
                { top: 12, closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -6 } },
              ].map((bar, i) => (
                <motion.span
                  key={i}
                  className="absolute left-0 block h-[1.5px] w-full rounded-full bg-current"
                  style={{ top: bar.top }}
                  variants={{
                    closed: bar.closed,
                    open: bar.open,
                  }}
                  transition={{ duration: 0.25 }}
                />
              ))}
            </motion.span>
          </motion.button>

          <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
            <RegionToggle size="sm" />
            <Button
              type="button"
              variant="gold"
              className="hidden h-10 px-4 text-xs sm:inline-flex"
              onClick={() => router.push("/signup")}
            >
              Enroll
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
              aria-label="Close menu overlay"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              id="marketing-nav-menu"
              className="fixed inset-x-4 top-[4.5rem] z-[70] max-h-[calc(100svh-6rem)] overflow-y-auto rounded-2xl border border-[var(--fog)] p-4 shadow-2xl lg:hidden"
              style={{ backgroundColor: "var(--ink)" }}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.ul
                className="flex flex-col gap-1"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {PRIMARY_NAV.map((item) => (
                  <motion.li key={item.href} variants={fadeUp} transition={defaultTransition}>
                    <motion.a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.href);
                      }}
                      className="block rounded-lg px-4 py-3 text-sm"
                      style={{ color: "var(--text-primary)" }}
                      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.a>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div
                className="mt-4 border-t border-[var(--fog)] pt-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...defaultTransition }}
              >
                <Button
                  type="button"
                  variant="gold"
                  className="w-full"
                  onClick={() => router.push("/signup")}
                >
                  Enroll
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
