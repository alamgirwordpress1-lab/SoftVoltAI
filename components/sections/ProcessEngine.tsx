"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessStep } from "@/lib/cms/types";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/utils";

/**
 * Engine room #1. The step list scrolls; the artefact panel stays pinned and
 * swaps to the document that step produces. Plain sticky positioning plus an
 * IntersectionObserver — no scroll hijacking, works with reduced motion.
 */
export function ProcessEngine({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number(e.target.getAttribute("data-step")));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="er section" aria-labelledby="process-title">
      <div className="container-x">
        {/* split heading: H2 left, lede right, so the top row uses the full width */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10" data-reveal>
          <div className="lg:col-span-7">
            <span className="eyebrow">How it works</span>
            <h2 id="process-title" className="display display-lg mt-4">
              Five steps. Each one leaves a document you can forward to your client.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-1.5">
            <p className="lede max-w-[46ch]">
              No black box. Every stage produces something written — a scope, a staging link, a checklist, a handover — so you
              always know where the work is without asking.
            </p>
            <div className="mt-5">
              <ArrowLink href="/partner-programme" dark>
                What happens after the first brief
              </ArrowLink>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <ol ref={listRef} className="lg:col-span-5">
            {steps.map((s, i) => (
              <li
                key={s.id}
                data-step={i}
                className={cn(
                  "relative border-l py-7 pl-7 transition-colors duration-500 lg:min-h-[15rem] lg:py-8",
                  active === i ? "border-volt" : "border-er-line",
                )}
              >
                <span
                  className={cn(
                    "mono absolute -left-[5px] top-[34px] h-[9px] w-[9px] rounded-full transition-colors duration-500 lg:top-[38px]",
                    active === i ? "bg-volt" : "bg-er-line",
                  )}
                  aria-hidden="true"
                />
                <span className="mono text-xs uppercase tracking-[0.12em] text-volt">Step {i + 1}</span>
                <h3 className={cn("mt-2 text-2xl font-semibold tracking-[-0.01em] transition-colors duration-500 md:text-[28px]", active === i ? "text-er-ink" : "text-er-muted")}>
                  {s.name}
                </h3>
                <p className="mono mt-2 text-[12px] uppercase tracking-[0.08em] text-er-muted">{s.turnaround}</p>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-er-muted md:text-base">{s.summary}</p>
                <div className="mt-6 lg:hidden">
                  <Artefact kind={s.artefact} />
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden lg:col-span-7 lg:block">
            {/* pinned nearer the middle of the viewport: the artefact is short and
                the step list is long, so an top-anchored pin leaves all the empty
                space below it. This splits that space above and below instead. */}
            <div className="sticky top-[18vh]">
              <div className="relative min-h-[320px]">
                {steps.map((s, i) => (
                  <div
                    key={s.id}
                    aria-hidden={active !== i}
                    className={cn(
                      "absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                      active === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                    )}
                  >
                    <Artefact kind={s.artefact} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2" aria-hidden="true">
                {steps.map((s, i) => (
                  <span key={s.id} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= active ? "bg-volt" : "bg-er-line")} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the documents each step produces (illustrative mocks) ---------- */

function Doc({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return (
    <div className="card mono overflow-hidden text-[12px] leading-relaxed">
      <div className="flex items-center justify-between border-b border-er-line px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] text-er-muted">
        <span className="text-er-ink">{title}</span>
        <span>{meta}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Row({ k, v, volt = false }: { k: string; v: string; volt?: boolean }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 border-b border-er-line py-2 last:border-b-0">
      <span className="text-er-muted">{k}</span>
      <span className={volt ? "text-volt" : "text-er-ink"}>{v}</span>
    </div>
  );
}

function Artefact({ kind }: { kind: string }) {
  switch (kind) {
    case "brief":
      return (
        <Doc title="Brief received" meta="northwind-digital · 17:04 London">
          <Row k="Client" v="Harbour Dental (name shared after NDA)" />
          <Row k="Work" v="Build · WooCommerce booking + 14 pages" />
          <Row k="Have" v="Figma file, live URL, brand guide" />
          <Row k="Deadline" v="Client launch in 5 weeks" />
          <Row k="NDA" v="Mutual NDA sent before client details" volt />
        </Doc>
      );
    case "scope":
      return (
        <Doc title="Scope & quote" meta="v1 · within 2 business days">
          <Row k="Deliverables" v="14 templates · booking flow · Klarna + Stripe · GA4 events" />
          <Row k="Timeline" v="Build 3 wks · QA 4 days · handover 1 day" />
          <Row k="Revisions" v="2 rounds per template, written in" />
          <Row k="Price" v="Fixed. Changes quoted before they are built." volt />
          <Row k="Starts" v="On your written approval" />
        </Doc>
      );
    case "staging":
      return (
        <Doc title="Production" meta="staging.northwind-digital.co.uk">
          <div className="mb-4 rounded-md border border-er-line bg-er-raised px-3 py-2 text-[11px] text-er-muted">
            <span className="text-volt">●</span> live · branch northwind-digital/harbour-dental · deploy #23
          </div>
          <div className="space-y-2.5">
            {[
              ["Producer", "Booking flow is on staging. Klarna sandbox works end to end — can you check the copy on the confirmation step?"],
              ["You", "Checked. Client wants the emergency banner higher. Sending a Loom."],
              ["Producer", "Done in #24. Also moved LCP from 4.1s to 1.6s on the treatments page while I was there."],
            ].map(([who, msg], i) => (
              <div key={i} className="grid grid-cols-[72px_1fr] gap-3">
                <span className={who === "You" ? "text-volt" : "text-er-muted"}>{who}</span>
                <span className="text-er-ink">{msg}</span>
              </div>
            ))}
          </div>
        </Doc>
      );
    case "qa":
      return (
        <Doc title="QA checklist" meta="42 checks · published">
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              "Chrome, Safari, Firefox, Edge",
              "iPhone SE → Pro Max, Pixel, Galaxy",
              "Keyboard navigation, visible focus",
              "Colour contrast WCAG 2.2 AA",
              "Forms: validation, errors, success",
              "Checkout: 4 payment paths tested",
              "Core Web Vitals on real devices",
              "404, redirects, canonical tags",
              "GA4 events fire once, with consent",
              "Backups + rollback rehearsed",
            ].map((c) => (
              <li key={c} className="flex gap-2 text-er-ink">
                <span className="text-volt">✓</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Doc>
      );
    default:
      return (
        <Doc title="Handover" meta="northwind-digital · launch day">
          <Row k="Documentation" v="Editing guide, page map, plugin list" />
          <Row k="Credentials" v="Transferred via shared vault, ours revoked" volt />
          <Row k="Staging" v="Kept live 14 days after launch" />
          <Row k="Credit" v="Website by Northwind Digital" />
          <Row k="Our name" v="Appears nowhere" volt />
        </Doc>
      );
  }
}
