"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion/gsap";

let lenis: Lenis | null = null;

/** Smooth scroll back to the top, through Lenis when it is running. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.1 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/**
 * Site-wide motion plumbing.
 *  - Lenis smooth scroll wired into GSAP's ticker (skipped under reduced motion)
 *  - same-page hash links scroll smoothly
 *  - [data-reveal]: whatever is already on screen at first load is marked .is-in
 *    before html.reveal-on turns hiding on, so nothing above the fold blinks and
 *    nothing stays hidden if this never runs. Re-scans on every route change and
 *    watches for nodes streamed in later.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let raf: ((time: number) => void) | undefined;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.5 });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(500, 33);
    }

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor || anchor.target === "_blank") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.2 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();
    const firstRun = !root.classList.contains("reveal-on");
    const tracked = new WeakSet<Element>();

    const io = reduced
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("is-in", "is-revealing");
              io?.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
        );

    const viewportHeight = window.innerHeight;
    const track = (el: Element) => {
      if (tracked.has(el) || el.classList.contains("is-in")) return;
      tracked.add(el);
      if (!io) {
        el.classList.add("is-in");
        return;
      }
      if (firstRun) {
        const r = el.getBoundingClientRect();
        if (r.top < viewportHeight && r.bottom > 0) {
          el.classList.add("is-in");
          return;
        }
      }
      io.observe(el);
    };

    document.querySelectorAll("[data-reveal]").forEach(track);
    root.classList.add("reveal-on");

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) track(node);
          node.querySelectorAll("[data-reveal]").forEach(track);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Next scrolls the window on navigation; keep Lenis's internal position in step.
    const sync = requestAnimationFrame(() => lenis?.scrollTo(window.scrollY, { immediate: true, force: true }));

    return () => {
      cancelAnimationFrame(sync);
      io?.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
