"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { scrollToTop } from "@/components/motion/MotionRoot";
import { cn } from "@/lib/utils";
import "./back-to-top.css";

/** For a page without a hero banner: how far down (px) the visitor scrolls before the button appears. */
const SHOW_AFTER = 600;

/**
 * Pinned to the right edge, stacked above the voice agent button when the
 * site has one. Hidden while the page's hero banner (the home hero, or any
 * PageHero) is still on screen; it appears once the visitor has scrolled
 * past the banner, and goes again when they scroll back up to it.
 */
export function BackToTop({ aboveLauncher = false }: { aboveLauncher?: boolean }) {
  const [shown, setShown] = useState(false);
  // the layout survives client-side navigation, so each new page's banner is found again
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.querySelector<HTMLElement>("#hero, [data-hero]");
      setShown(hero ? hero.getBoundingClientRect().bottom <= 0 : window.scrollY > SHOW_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update); // a page restored mid-scroll shows it at once
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={cn("back-to-top ui group grid place-items-center", aboveLauncher && "is-above-launcher", shown && "is-shown")}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        aria-hidden="true"
        className="transition-transform duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5"
      >
        <path d="M6 10V2m0 0L2.5 5.5M6 2l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
