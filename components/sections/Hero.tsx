"use client";

import { useEffect, useRef } from "react";
import type { GlobeCard, GlobeLocation } from "@/lib/cms/types";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { cta as localCta } from "@/content/site";
import { promises } from "@/content/promises";
import { Button } from "@/components/ui/Button";
import { OrbitGlobe } from "@/components/sections/OrbitGlobe";
import "./hero.css";

/** What the banner says when WordPress has nothing to say about it. */
const LINES = ["You win the client.", "We deliver the work.", "Your brand gets the credit."];
const EYEBROW = "White-label production & growth partner";
const LEDE =
  "WordPress, WooCommerce, Shopify and Webflow builds, Next.js apps on Payload, Sanity or PostgreSQL, AI automation, SEO and paid media — delivered under your brand by a senior team in Dhaka, working UK and US hours.";
/** The chips under the buttons are the published commitments, verbatim — the
    page passes the ones from the CMS so the two lists can never drift apart. */
const TRUST = promises.map((p) => p.label);

const GLOBE_BASE = "A globe with Dhaka marked as our base and arcs to the markets we serve — the UK, the USA, Canada, Australia and Europe";

/** The globe is decoration, so it is announced as one image: the map, then whoever is orbiting it. */
function globeLabel(cards: GlobeCard[]) {
  const people = cards.flatMap((c) => (c.kind === "client" ? [`${c.name}, ${c.role} at ${c.company}`] : []));
  if (people.length) return `${GLOBE_BASE} — orbited by clients who recommend SoftVolt AI: ${people.join("; ")}.`;
  const badges = cards.flatMap((c) => (c.kind === "logo" ? [`${c.name} (${c.country}), ${c.work}`] : []));
  if (badges.length) return `${GLOBE_BASE} — orbited by clients we have delivered for: ${badges.join("; ")}.`;
  return `${GLOBE_BASE} — orbited by websites delivered for clients in the UK, US and Bangladesh.`;
}

/** The key under the globe, when WordPress has nothing to say about it. */
const LEGEND = { hq: "Dhaka HQ", markets: "Markets we serve", eu: "EU member states", drag: "Drag to rotate · any direction" };

export function Hero({
  cards,
  locations,
  eyebrow,
  lines,
  lede,
  trust,
  legend,
  cta = localCta,
}: {
  cards: GlobeCard[];
  locations: GlobeLocation[];
  /** The two calls to action from the settings screen. */
  cta?: { primary: { label: string; href: string }; secondary: { label: string; href: string } };
  /** From the WordPress page at "/" — each one falls back to the copy above. */
  eyebrow?: string;
  lines?: string[];
  lede?: string;
  trust?: string[];
  legend?: Partial<typeof LEGEND>;
}) {
  const key = { ...LEGEND, ...legend };
  const headline = lines?.length ? lines : LINES;
  const chips = trust?.length ? trust : TRUST;
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
        {/* Below 768px the globe leads and this column follows it — see the globe's order-first */}
        <div className="relative z-10 pb-12 md:pb-0 md:pt-16 lg:py-16">
          <span className="eyebrow" data-after>
            {eyebrow || EYEBROW}
          </span>

          {/* One sentence per line: the thesis is the typography. */}
          <h1 id="hero-title" className="display hero-title mt-7">
            {headline.map((line, i) => (
              // the closing line carries the accent, however many lines an editor writes
              <span key={line} className={`split-mask block pb-[0.08em] ${i < headline.length - 1 ? "hero-line-lead" : ""}`}>
                <span data-line className={`block ${i === headline.length - 1 ? "text-accent" : ""}`}>
                  {line.slice(0, -1)}
                  <span className="hero-stop">.</span>
                </span>
              </span>
            ))}
          </h1>

          <p className="lede mt-8 max-w-[56ch]" data-after>
            {lede || LEDE}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3" data-after>
            <Button href={cta.primary.href}>{cta.primary.label}</Button>
            <Button href={cta.secondary.href} variant="secondary">
              {cta.secondary.label}
            </Button>
          </div>

          {/* trust row as chips, wrapping under the buttons */}
          <ul className="mt-10 flex flex-wrap gap-3" data-after>
            {chips.map((t) => (
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

        <div className="relative order-first pb-2 pt-8 md:order-none md:pb-14 md:pt-0 lg:py-8">
          <OrbitGlobe
            cards={cards}
            locations={locations}
            label={globeLabel(cards)}
          />
          <ul className="mono mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.1em] text-muted" data-after>
            {key.hq ? (
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-volt" aria-hidden="true" /> {key.hq}
              </li>
            ) : null}
            {key.markets ? (
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" /> {key.markets}
              </li>
            ) : null}
            {key.eu ? (
              <li className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-muted" aria-hidden="true" /> {key.eu}
              </li>
            ) : null}
            {key.drag ? <li className="hidden sm:block">{key.drag}</li> : null}
          </ul>
        </div>
      </div>
    </section>
  );
}
