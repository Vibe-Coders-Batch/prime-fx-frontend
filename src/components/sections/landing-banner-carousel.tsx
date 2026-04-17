"use client";

import { useEffect, useState } from "react";

const BANNERS = [
  "/landing-banners/1.jpg",
  "/landing-banners/2.jpg",
  "/landing-banners/3.jpg",  // "/landing-banners/C-2.jpg",
  // "/landing-banners/banner-1.jpg",
];

const AUTOPLAY_INTERVAL_MS = 4000;

export function LandingBannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);


  return (
    <section
      className="relative w-full overflow-hidden bg-[#0A192F] aspect-[9/16] sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:h-screen"
      aria-label="Featured learning banners"
    >
      {BANNERS.map((banner, index) => (
        <div
          key={banner}
          className={[
            "absolute inset-0 transition-opacity duration-700",
            index === activeIndex ? "opacity-100" : "opacity-0",
          ].join(" ")}
          aria-hidden={index !== activeIndex}
        >
          <img
            src={banner}
            alt={`Prime Learning banner ${index + 1}`}
            className="h-full w-full object-contain sm:object-cover"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-[#0A192F]/10" />

      {BANNERS.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={[
                "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border border-white/50 transition",
                index === activeIndex
                  ? "bg-white"
                  : "bg-white/30 hover:bg-white/60",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </section>
  );
}
