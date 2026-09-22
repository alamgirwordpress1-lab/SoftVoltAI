"use client";

import { useEffect, useState } from "react";

type Vitals = {
  lcp: number | null; // ms
  cls: number | null;
  ttfb: number | null; // ms
  jsKb: number | null;
  cssKb: number | null;
  fontFiles: number | null;
  requests: number | null;
};

const EMPTY: Vitals = { lcp: null, cls: null, ttfb: null, jsKb: null, cssKb: null, fontFiles: null, requests: null };

/**
 * Real numbers from the visitor's own browser via PerformanceObserver and the
 * resource timing API. Nothing is sent anywhere; nothing is faked. When an API
 * is unavailable (older Safari for LCP/CLS) the tile says so.
 */
/** What the card says when WordPress has nothing to say about it. */
const HEADING = "This page, in your browser";
const POINTS = [
  "Rendered on the server, hydrated only where something moves",
  "Dashes mean your browser does not expose that metric — we do not guess",
];

export function LiveVitals({ heading = HEADING, points = POINTS }: { heading?: string; points?: string[] }) {
  const [v, setV] = useState<Vitals>(EMPTY);
  const [measuredAt, setMeasuredAt] = useState<string>("");

  useEffect(() => {
    const update = (patch: Partial<Vitals>) => setV((prev) => ({ ...prev, ...patch }));
    const observers: PerformanceObserver[] = [];
    let later: number | undefined;

    const sumResources = () => {
      const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const kb = (pred: (r: PerformanceResourceTiming) => boolean) =>
        Math.round(res.filter(pred).reduce((n, r) => n + (r.transferSize || r.encodedBodySize || 0), 0) / 1024);
      update({
        jsKb: kb((r) => r.initiatorType === "script" || /\.js(\?|$)/.test(r.name)),
        cssKb: kb((r) => r.initiatorType === "link" && /\.css(\?|$)/.test(r.name)),
        fontFiles: res.filter((r) => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name)).length,
        requests: res.length + 1,
      });
    };
    // Measure after commit, not during it: the browser APIs are the external system here.
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav) update({ ttfb: Math.round(nav.responseStart) });
      sumResources();
      later = window.setTimeout(sumResources, 2500);

      if ("PerformanceObserver" in window) {
        try {
          const lcp = new PerformanceObserver((list) => {
            const last = list.getEntries().at(-1);
            if (last) update({ lcp: Math.round(last.startTime) });
          });
          lcp.observe({ type: "largest-contentful-paint", buffered: true });
          observers.push(lcp);
        } catch {}
        try {
          let cls = 0;
          const clsObs = new PerformanceObserver((list) => {
            for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
              if (!e.hadRecentInput) cls += e.value;
            }
            update({ cls: Math.round(cls * 1000) / 1000 });
          });
          clsObs.observe({ type: "layout-shift", buffered: true });
          observers.push(clsObs);
          update({ cls: 0 });
        } catch {}
      }
      setMeasuredAt(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    };
    const first = window.setTimeout(measure, 0);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(later);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  const fmt = (n: number | null, unit: string, digits = 0) => (n === null ? "—" : `${n.toFixed(digits)}${unit}`);
  // Only Google's published Core Web Vitals thresholds get a pass/fail colour; the rest are plain measurements.
  const grade = (ok: boolean | null) => (ok === null ? "text-er-ink" : ok ? "text-volt" : "text-[#f5b14a]");

  const tiles = [
    { k: "LCP", v: v.lcp === null ? "—" : `${(v.lcp / 1000).toFixed(2)}s`, ok: v.lcp === null ? null : v.lcp <= 2500, hint: "good ≤ 2.5s" },
    { k: "CLS", v: v.cls === null ? "—" : v.cls.toFixed(3), ok: v.cls === null ? null : v.cls <= 0.1, hint: "good ≤ 0.1" },
    { k: "TTFB", v: fmt(v.ttfb, "ms"), ok: v.ttfb === null ? null : v.ttfb <= 800, hint: "good ≤ 800ms" },
    { k: "JS transferred", v: fmt(v.jsKb, " KB"), ok: null, hint: "compressed, whole page" },
    { k: "CSS transferred", v: fmt(v.cssKb, " KB"), ok: null, hint: "compressed" },
    { k: "Font files", v: v.fontFiles === null ? "—" : String(v.fontFiles), ok: null, hint: "self-hosted via next/font" },
  ];

  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-er-ink">{heading}</h3>
        <span className="mono text-[11px] uppercase tracking-[0.1em] text-er-muted">{measuredAt ? `measured ${measuredAt}` : "measuring…"}</span>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
        {tiles.map((t) => (
          <div key={t.k}>
            <dt className="mono text-[11px] uppercase tracking-[0.1em] text-er-muted">{t.k}</dt>
            <dd className={`mono mt-1 text-[26px] leading-none ${grade(t.ok)}`}>{t.v}</dd>
            <dd className="mt-1.5 text-[12px] text-er-muted">{t.hint}</dd>
          </div>
        ))}
      </dl>
      <ul className="mono mt-8 space-y-1.5 border-t border-er-line pt-5 text-[12px] text-er-muted">
        <li>
          <span className="text-volt">✓</span> {v.requests === null ? "—" : `${v.requests} requests`} for the whole page, cookies: none
        </li>
        {points.map((point) => (
          <li key={point}>
            <span className="text-volt">✓</span> {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
