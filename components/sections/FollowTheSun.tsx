"use client";

import { useMemo } from "react";
import type { CityClock } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useNow } from "@/lib/hooks/useNow";
import { cn } from "@/lib/utils";
import type { HeadingLedeCopy } from "@/lib/cms/copy-types";

export interface HoursCopy extends HeadingLedeCopy {
  city_label: string;
  overlap_label: string;
  footnote: string;
}

// TODO(owner): coverage window in Dhaka local time — a public commitment.
const COVERAGE = { start: 9, end: 23 };
const WORKDAY = { start: 9, end: 18 };

/** Minutes east of UTC for a time zone right now (handles DST via Intl). */
function offsetMinutes(timeZone: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "longOffset" }).formatToParts(now);
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const m = name.match(/([+-])(\d{2}):?(\d{2})?/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

/** A local-hours window expressed as UTC segments on a 0–24 axis (split when it wraps midnight). */
function toUtcSegments(startLocal: number, endLocal: number, offsetMin: number) {
  const off = offsetMin / 60;
  let s = ((startLocal - off) % 24 + 24) % 24;
  const len = endLocal - startLocal;
  const segs: [number, number][] = [];
  while (s + len > 24) {
    segs.push([s, 24]);
    s = s - 24;
  }
  segs.push([Math.max(0, s), s + len]);
  return segs;
}

function overlapHours(a: [number, number][], b: [number, number][]) {
  let total = 0;
  for (const [a0, a1] of a) for (const [b0, b1] of b) total += Math.max(0, Math.min(a1, b1) - Math.max(a0, b0));
  return total;
}

export function FollowTheSun({ clocks, copy }: { clocks: CityClock[]; copy: HoursCopy }) {
  const now = useNow(30_000);

  const rows = useMemo(() => {
    const ref = now ?? new Date();
    const dhaka = clocks[0];
    const dhakaOff = offsetMinutes(dhaka.timeZone, ref);
    const coverage = toUtcSegments(COVERAGE.start, COVERAGE.end, dhakaOff);
    return clocks.map((c, i) => {
      const off = offsetMinutes(c.timeZone, ref);
      const day = i === 0 ? toUtcSegments(COVERAGE.start, COVERAGE.end, off) : toUtcSegments(WORKDAY.start, WORKDAY.end, off);
      const overlap = i === 0 ? null : overlapHours(day, coverage);
      const time = new Intl.DateTimeFormat("en-GB", { timeZone: c.timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(ref);
      const offLabel = `UTC${off >= 0 ? "+" : "−"}${Math.abs(off / 60)}`;
      return { ...c, segments: day, coverage, overlap, time, offLabel };
    });
  }, [clocks, now]);

  const nowUtc = now ? now.getUTCHours() + now.getUTCMinutes() / 60 : null;

  return (
    <section id="hours" className="section section-alt" aria-labelledby="hours-title">
      <div className="container-x">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={<span id="hours-title">{copy.heading}</span>}
        lede={copy.lede}
      />

      <div className="card mt-10 overflow-x-auto bg-paper p-5 md:p-8" data-reveal>
        <div className="min-w-[640px]">
          <div className="mono mb-3 grid grid-cols-[150px_1fr_70px] items-end gap-4 text-[11px] uppercase tracking-[0.08em] text-muted">
            <span>{copy.city_label}</span>
            <div className="relative flex justify-between">
              {[0, 6, 12, 18, 24].map((h) => (
                <span key={h}>{String(h).padStart(2, "0")}:00 UTC</span>
              ))}
            </div>
            <span className="text-right">{copy.overlap_label}</span>
          </div>

          <ul className="space-y-2.5">
            {rows.map((r, i) => (
              <li key={r.city} className="grid grid-cols-[150px_1fr_70px] items-center gap-4">
                <div>
                  <p className="font-medium text-ink">{r.city}</p>
                  <p className="mono text-[12px] text-muted">
                    <span suppressHydrationWarning>{now ? r.time : "--:--"}</span> · {r.offLabel}
                  </p>
                </div>
                <div className="relative h-9 rounded-md bg-raised">
                  {i !== 0 &&
                    r.coverage.map(([a, b], k) => (
                      <span key={`c${k}`} className="absolute inset-y-0 bg-accent/10" style={{ left: `${(a / 24) * 100}%`, width: `${((b - a) / 24) * 100}%` }} aria-hidden="true" />
                    ))}
                  {r.segments.map(([a, b], k) => (
                    <span
                      key={k}
                      className={cn("absolute inset-y-1.5 origin-left rounded-[4px]", i === 0 ? "bg-er-bg" : "bg-ink/70")}
                      style={{ left: `${(a / 24) * 100}%`, width: `${((b - a) / 24) * 100}%` }}
                      aria-hidden="true"
                    />
                  ))}
                  {i !== 0 &&
                    r.segments.flatMap(([a, b], k) =>
                      r.coverage.map(([c, d], m) => {
                        const s = Math.max(a, c);
                        const e = Math.min(b, d);
                        return e > s ? (
                          <span key={`o${k}${m}`} className="absolute inset-y-1.5 rounded-[4px] bg-volt" style={{ left: `${(s / 24) * 100}%`, width: `${((e - s) / 24) * 100}%` }} aria-hidden="true" />
                        ) : null;
                      }),
                    )}
                  {nowUtc !== null ? (
                    <span className="absolute inset-y-0 w-px bg-accent" style={{ left: `${(nowUtc / 24) * 100}%` }} aria-hidden="true">
                      {i === 0 ? <span className="mono absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.1em] text-accent">now</span> : null}
                    </span>
                  ) : null}
                </div>
                <p className="mono text-right text-[15px] text-ink">{r.overlap === null ? <span className="text-muted">coverage</span> : `${r.overlap}h`}</p>
              </li>
            ))}
          </ul>

          {copy.footnote ? <p className="mono mt-5 text-[11px] uppercase tracking-[0.08em] text-muted">{copy.footnote}</p> : null}
        </div>
      </div>
      </div>
    </section>
  );
}
