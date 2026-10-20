"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import "./fx.css";

/**
 * Pointer effects for the inner pages, only with a mouse or trackpad and only
 * when the visitor has not asked for less motion:
 *  - cards inside a .fx-spot list get a soft volt light that follows the cursor
 *    (the CSS reads --mx/--my set here)
 *  - [data-parallax] illustrations move their [data-depth] layers against the
 *    cursor with GSAP, deeper layers further, easing back when it leaves
 * Re-binds on every route change; renders nothing.
 */
export function PageFx() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const off: Array<() => void> = [];

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".fx-spot .card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    off.push(() => document.removeEventListener("pointermove", onMove));

    document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((root) => {
      const layers = Array.from(root.querySelectorAll<HTMLElement | SVGElement>("[data-depth]")).map((el) => ({
        depth: Number(el.dataset.depth) || 0,
        x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
      }));
      if (!layers.length) return;
      const move = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        for (const l of layers) {
          l.x(nx * l.depth * 22);
          l.y(ny * l.depth * 16);
        }
      };
      const leave = () => {
        for (const l of layers) {
          l.x(0);
          l.y(0);
        }
      };
      root.addEventListener("pointermove", move, { passive: true });
      root.addEventListener("pointerleave", leave);
      off.push(() => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      });
    });

    return () => off.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
