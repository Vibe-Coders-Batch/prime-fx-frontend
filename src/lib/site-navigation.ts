export function scrollToHash(hash: string) {
  const id = hash.startsWith("#") ? hash : `#${hash}`;
  const target = document.querySelector(id) as HTMLElement | null;
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
}

export function parseNavHref(href: string): { path: string; hash: string | null } {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) {
    return { path: href, hash: null };
  }
  return {
    path: href.slice(0, hashIndex) || "/",
    hash: href.slice(hashIndex),
  };
}
