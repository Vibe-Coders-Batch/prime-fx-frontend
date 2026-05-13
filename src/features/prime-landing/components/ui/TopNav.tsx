"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { Button } from "@/features/prime-landing/components/ui/Button";

const LINKS = [
  { label: "Why", href: "#chapter-manifesto" },
  { label: "Categories", href: "#chapter-categories" },
  { label: "Courses", href: "#chapter-courses" },
  { label: "How it works", href: "#chapter-how" },
  { label: "Plans", href: "#chapter-plans" },
];

export function TopNav() {
  const router = useRouter();
  const scrollY = useScrollStore((s) => s.scrollY);
  const theme = useScrollStore((s) => s.theme);
  const [visible, setVisible] = useState(false);
  const [logoKey, setLogoKey] = useState(0);
  const hasAnimatedRef = useRef(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const heroThreshold = window.innerHeight * 0.6;
    const pastHero = scrollY > heroThreshold;

    // On the hero, keep the nav visible.
    if (!pastHero) {
      setVisible(true);
      lastYRef.current = scrollY;
      if (!hasAnimatedRef.current) {
        hasAnimatedRef.current = true;
        setLogoKey((k) => k + 1);
      }
      return;
    }

    // Show/hide based on scroll direction.
    const lastY = lastYRef.current;
    const delta = scrollY - lastY;
    lastYRef.current = scrollY;

    // Small deadzone to avoid jitter with smooth scrolling.
    const DEADZONE = 8;
    if (delta > DEADZONE) setVisible(false); // scrolling down → hide
    else if (delta < -DEADZONE) setVisible(true); // scrolling up → show

    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      setLogoKey((k) => k + 1);
    }
  }, [scrollY]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY;

    const lenis = (
      window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }
    ).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(top, {
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 5),
      });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <a
        href="#chapter-gate"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[var(--gold)] focus:px-3 focus:py-2 focus:text-[var(--ink)]"
      >
        Skip to content
      </a>
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 lg:px-12 lg:py-5 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={{
          background:
            theme === "paper" ? "rgba(255,252,245,0.88)" : "rgba(11,25,47,0.88)",
          backdropFilter: "blur(10px)",
          color: theme === "paper" ? "var(--ink)" : "white",
        }}
        aria-label="Primary"
      >
        <a
          key={logoKey}
          href="#chapter-gate"
          onClick={(e) => handleNav(e, "#chapter-gate")}
          className={`inline-flex items-center${logoKey > 0 ? " logo-appear" : ""}`}
          aria-label="Prime Learning home"
        >
          <Image
            src={theme === "paper" ? "/logo-square.svg" : "/logo-square-dark.svg"}
            alt="Prime Learning"
            width={70}
            height={70}
            className="h-[70px] w-[70px] md:hidden"
            priority
          />
          <Image
            src={theme === "paper" ? "/logo.svg" : "/logo-dark.svg"}
            alt="Prime Learning"
            width={521}
            height={304}
            className="hidden h-[90px] w-auto md:block lg:h-[102px]"
            priority
          />
        </a>
        <ul className="hidden gap-8 text-sm md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="gold"
          className="h-10 px-4 text-xs"
          onClick={() => router.push("/signup")}
        >
          Enroll
        </Button>
      </nav>
    </>
  );
}

