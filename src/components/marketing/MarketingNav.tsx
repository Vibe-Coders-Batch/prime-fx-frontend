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
  const hasAnimatedRef = useRef(false);
  const lastYRef = useRef(0);

  const navTheme = isLanding ? theme : "ink";
  const isPaper = navTheme === "paper";

  useEffect(() => {
    if (!isLanding) {
      setVisible(true);
      return;
    }

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

  const linkClass =
    "opacity-70 transition-opacity hover:opacity-100 whitespace-nowrap";

  return (
    <>
      <a
        href="/#chapter-gate"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[var(--gold)] focus:px-3 focus:py-2 focus:text-[var(--ink)]"
      >
        Skip to content
      </a>

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
          className={`inline-flex shrink-0 items-center${logoKey > 0 && isLanding ? " logo-appear" : ""}`}
          aria-label="Prime Learning home"
        >
          <Image
            src={isPaper ? "/logo-square.svg" : "/logo-square-dark.svg"}
            alt="Prime Learning"
            width={70}
            height={70}
            className="h-12 w-12 sm:h-14 sm:w-14 lg:hidden"
            priority
          />
          <Image
            src={isPaper ? "/logo.svg" : "/logo-dark.svg"}
            alt="Prime Learning"
            width={520}
            height={200}
            className="hidden h-9 w-auto max-w-[min(200px,42vw)] object-contain object-left lg:block xl:h-10 xl:max-w-[220px]"
            priority
          />
        </Link>

        <ul className="hidden min-w-0 flex-1 items-center justify-center gap-x-5 gap-y-1 overflow-x-auto text-xs lg:flex xl:gap-7 xl:text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href} className="shrink-0">
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                }}
                className={linkClass}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <RegionToggle size="sm" />
          <Button
            type="button"
            variant="gold"
            className="hidden h-10 px-4 text-xs sm:inline-flex"
            onClick={() => router.push("/signup")}
          >
            Enroll
          </Button>
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
