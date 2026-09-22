"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { slugify } from "@/lib/utils";
import { HeroStage } from "@/components/sections/HeroStage";
import type { DemoSiteCopy } from "@/lib/cms/copy-types";

/**
 * The workbench: the finished client site in the centre and the invisible
 * team's artefacts floating around it. On load each card flies in from its
 * own side and settles; afterwards they bob gently and shift with the
 * pointer by depth.
 */
export function HeroBench({ agency, brand, site }: { agency: string; brand: string; site: DemoSiteCopy }) {
  const ref = useRef<HTMLDivElement>(null);
  const slug = slugify(agency);

  useEffect(() => {
    const bench = ref.current;
    if (!bench) return;
    const ready = () => bench.classList.add("bench-ready");
    // below 1024px the cards are a static grid under the stage
    if (prefersReducedMotion() || !window.matchMedia("(min-width: 1024px)").matches) {
      ready();
      return;
    }

    const cards = Array.from(bench.querySelectorAll<HTMLElement>(".bench-card"));
    const stage = bench.querySelector<HTMLElement>(".hero-stage");
    const mid = bench.clientWidth / 2;
    const midY = bench.clientHeight / 2;
    const side = (el: HTMLElement) => {
      const cx = el.offsetLeft + el.offsetWidth / 2 - mid;
      return Math.abs(cx) < 40 ? 0 : Math.sign(cx);
    };
    const vert = (el: HTMLElement) => Math.sign(el.offsetTop + el.offsetHeight / 2 - midY) || -1;

    let parallax = false;
    const ctx = gsap.context(() => {}, bench);
    const start = () =>
      ctx.add(() => {
        const tl = gsap.timeline({
          delay: 0.1,
          defaults: { ease: "power4.out" },
          onComplete: () => {
            ready();
            parallax = true;
          },
        });
        if (stage) tl.fromTo(stage, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.1, clearProps: "transform" }, 0);
        tl.fromTo(
          cards,
          {
            opacity: 0,
            x: (_i: number, el: HTMLElement) => side(el) * 90,
            y: (_i: number, el: HTMLElement) => vert(el) * 50,
            rotate: (_i: number, el: HTMLElement) => side(el) * 5,
          },
          { opacity: 1, x: 0, y: 0, rotate: 0, duration: 1.3, ease: "back.out(1.25)", stagger: 0.09 },
          0.45,
        );
      });
    // the bench lives below the fold now: play the entrance when it arrives
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        start();
      },
      { threshold: 0.2 },
    );
    io.observe(bench);

    const movers = cards.map((el) => ({
      depth: Number(el.dataset.depth ?? 0.6),
      x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
    }));
    const onMove = (e: PointerEvent) => {
      if (!parallax) return;
      const r = bench.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      movers.forEach((m) => {
        m.x(nx * 22 * m.depth);
        m.y(ny * 16 * m.depth);
      });
    };
    const onLeave = () => {
      if (!parallax) return;
      movers.forEach((m) => {
        m.x(0);
        m.y(0);
      });
    };
    bench.addEventListener("pointermove", onMove);
    bench.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      bench.removeEventListener("pointermove", onMove);
      bench.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className="bench">
      <HeroStage agency={agency} brand={brand} site={site} />

      <div className="bench-cards-mobile">
        <div className="bench-card c-staging lg-only" data-depth="0.3" aria-hidden="true">
          <span className="bob flex items-center gap-2 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(30,122,50,0.15)]" />
            <span className="text-ink">staging.{slug}.co.uk</span>
            <span>· deploy #24 · live</span>
          </span>
        </div>

        <div className="bench-card c-vitals" data-depth="0.7" style={{ ["--bob-dur" as string]: "7s" }}>
          <span className="bob">
            <span className="flex items-center gap-3">
              <svg className="ring" viewBox="0 0 40 40" aria-hidden="true">
                <circle className="track" cx="20" cy="20" r="16" pathLength="100" />
                <circle className="bar" cx="20" cy="20" r="16" pathLength="100" />
              </svg>
              <span>
                <b>Core Web Vitals · staging</b>
                passed on 9 real devices
              </span>
            </span>
            <span className="mt-3 flex gap-1.5">
              {[
                ["LCP", "1.6s"],
                ["INP", "80ms"],
                ["CLS", "0.00"],
              ].map(([k, v]) => (
                <span key={k} className="rounded-md bg-ok-bg px-2 py-1 text-[11px] text-ok-fg">
                  {k} {v}
                </span>
              ))}
            </span>
          </span>
        </div>

        <div className="bench-card c-figma lg-only" data-depth="0.45" style={{ ["--bob-dur" as string]: "8s", ["--bob-delay" as string]: "-2s" }} aria-hidden="true">
          <span className="bob">
            <b>Figma → build</b>
            14 frames · reviewed against your file
            <span className="mt-2 grid grid-cols-4 gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className={`h-5 rounded-[3px] ${i < 6 ? "bg-accent/15" : "bg-raised"}`} />
              ))}
            </span>
          </span>
        </div>

        <div className="bench-card c-qa lg-only" data-depth="0.8" style={{ ["--bob-dur" as string]: "6.5s", ["--bob-delay" as string]: "-1s" }} aria-hidden="true">
          <span className="bob flex items-center gap-3">
            <span className="icon-tile !h-9 !w-9 !rounded-lg">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="m4 9.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <b>QA 42 / 42</b>
              published checklist, every build
            </span>
          </span>
        </div>

        <div className="bench-card c-commits" data-depth="0.9" style={{ ["--bob-dur" as string]: "7.5s", ["--bob-delay" as string]: "-3s" }}>
          <span className="bob">
            <b>Commits · {slug}/harbour-dental</b>
            <span className="mt-2 grid gap-1.5">
              {[
                ["feat", "booking: same-week slots + Klarna"],
                ["perf", "images: AVIF, LCP 4.1s → 1.6s"],
                ["a11y", "WCAG 2.2 AA pass"],
              ].map(([t, m]) => (
                <span key={t} className="flex items-baseline gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-accent" />
                  <span className="text-accent">{t}</span>
                  <span className="text-ink">{m}</span>
                </span>
              ))}
            </span>
          </span>
        </div>

        <div className="bench-card c-slack lg-only" data-depth="0.55" style={{ ["--bob-dur" as string]: "8.5s", ["--bob-delay" as string]: "-4s" }} aria-hidden="true">
          <span className="bob">
            <span className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-ink text-center text-[11px] font-semibold leading-6 text-paper">P</span>
              <b className="!inline">Producer</b>
              <span>· 09:12 London · #{slug}</span>
            </span>
            <span className="mt-2 block font-sans text-[13px] leading-snug text-ink">
              Booking flow is on staging. Klarna sandbox works end to end — can you check the copy on the confirmation step?
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
