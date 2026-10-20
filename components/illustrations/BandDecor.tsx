import { cn } from "@/lib/utils";
import "./illustrations.css";

/**
 * Orbit lines behind a dark engine-room band: two slow rings and two volt
 * pulses running round them. Purely decorative; sits under the content.
 */
export function BandDecor({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <svg className={cn("band-decor", side === "left" && "band-decor-left")} viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <circle cx="300" cy="300" r="280" className="bd-dash bd-spin" />
      <circle cx="300" cy="300" r="210" />
      <circle cx="300" cy="300" r="140" className="bd-dash bd-spin-rev" />
      <circle cx="300" cy="300" r="70" />
      <path d="M300 20 V580 M20 300 H580 M102 102 L498 498 M498 102 L102 498" className="bd-dash" />
      <circle cx="300" cy="300" r="210" className="bd-volt" pathLength={418} />
      <circle cx="300" cy="300" r="140" className="bd-volt bd-volt-2" pathLength={418} />
      <g className="bd-spin">
        <circle cx="300" cy="20" r="5" className="bd-node" />
        <circle cx="580" cy="300" r="3.5" className="bd-node" />
      </g>
    </svg>
  );
}

/**
 * The line joining a band of numbered step cards, one dot per card. Mirrors the
 * cards' grid (same count and gap) so each dot sits over its card's number.
 */
export function StepLine({ count, gap = 20, inset = 24, className }: { count: number; gap?: number; inset?: number; className?: string }) {
  if (count < 2) return null;
  return (
    <div className={cn("step-line", className)} data-reveal aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="step-line-dot"
          style={{ left: `calc((100% + ${gap}px) * ${i / count} + ${inset}px)`, animationDelay: `${0.2 + i * 0.25}s` }}
        />
      ))}
    </div>
  );
}
