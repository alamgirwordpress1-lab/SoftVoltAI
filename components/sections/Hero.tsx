"use client";

import { useEffect, useRef } from "react";
import type { GlobeCard, GlobeLocation } from "@/lib/cms/types";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { cta } from "@/content/site";
import { promises } from "@/content/promises";
import { Button } from "@/components/ui/Button";
import { OrbitGlobe } from "@/components/sections/OrbitGlobe";
import "./hero.css";

const LINES = ["You win the client.", "We deliver the work.", "Your brand gets the credit."];
/** The chips under the buttons are the published commitments, verbatim — derived
    from content/promises.ts so the two lists can never drift apart. */
const TRUST = promises.map((p) => p.label);

export function Hero({ cards, locations }: { cards: GlobeCard[]; locations: GlobeLocation[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ready = () => root.classList.add("hero-ready");
    if (prefersReducedMotion()) {
      ready();
      return;
    }
    const lines = root.querySelectorAll<HTMLElement>("[data-line]");
    const after = root.querySelectorAll<HTMLElement>("[data-after]");
    // fromTo, not from: the hidden start state is already painted by CSS, so there is no flash to undo.
    // y: 0 matters — GSAP would otherwise read the CSS 110% offset back as pixels and keep it.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" }, onComplete: ready });
      tl.fromTo(lines, { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1.1, stagger: 0.09 }, 0.1);
      tl.fromTo(after, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, clearProps: "transform" }, 0.55);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={rootRef} className="hero" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />

      <div className="wide-x relative grid items-center gap-6 lg:min-h-[min(940px,calc(100svh-80px))] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="relative z-10 pt-10 md:pt-16 lg:py-16">
          <span className="eyebrow" data-after>
            White-label production &amp; growth partner
          </span>

          {/* One sentence per line: the thesis is the typography. */}
          <h1 id="hero-title" className="display hero-title mt-7">
            {LINES.map((line, i) => (
              <span key={line} className={`split-mask block pb-[0.08em] ${i < 2 ? "hero-line-lead" : ""}`}>
                <span data-line className={`block ${i === 2 ? "text-accent" : ""}`}>
                  {line.slice(0, -1)}
                  <span className="hero-stop">.</span>
                </span>
              </span>
            ))}
          </h1>

          <p className="lede mt-8 max-w-[56ch]" data-after>
            WordPress, WooCommerce, Shopify and Webflow builds, Next.js apps on Payload, Sanity or PostgreSQL, AI automation, SEO
            and paid media — delivered under your brand by a senior team in Dhaka, working UK and US hours.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3" data-after>
            <Button href={cta.primary.href}>{cta.primary.label}</Button>
            <Button href={cta.secondary.href} variant="secondary">
              {cta.secondary.label}
            </Button>
          </div>

          {/* trust row as chips, wrapping under the buttons */}
          <ul className="mt-10 flex flex-wrap gap-3" data-after>
            {TRUST.map((t) => (
              <li
                key={t}
                className="ui shadow-soft flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] font-semibold text-ink"
              >
                <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0 text-accent">
                  <circle cx="9" cy="9" r="9" fill="currentColor" />
                  <path d="m5.2 9.2 2.4 2.4 5.2-5.2" fill="none" stroke="var(--color-surface)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative pb-14 lg:py-8">
          <OrbitGlobe
            cards={cards}
            locations={locations}
            label={
              cards.some((c) => c.kind === "client")
                ? `A globe with Dhaka marked as our base and arcs to the markets we serve — the UK, the USA, Canada, Australia and Europe — orbited by clients who recommend SoftVolt AI: ${cards
                    .flatMap((c) => (c.kind === "client" ? [`${c.name}, ${c.role} at ${c.company}`] : []))
                    .join("; ")}.`
                : "A globe with Dhaka marked as our base and arcs to the markets we serve — the UK, the USA, Canada, Australia and Europe — orbited by websites delivered for clients in the UK, US and Bangladesh."
            }
          />
          <ul className="mono mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.1em] text-muted" data-after>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-volt" aria-hidden="true" /> Dhaka HQ
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" /> Markets we serve
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-muted" aria-hidden="true" /> EU member states
            </li>
            <li className="hidden sm:block">Drag to rotate · any direction</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
