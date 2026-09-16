import type { PillarGroup } from "@/lib/cms/types";

/** A single quiet strip of everything we ship — pauses on hover, static under reduced motion. */
export function CapabilityMarquee({ pillars }: { pillars: PillarGroup[] }) {
  const items = pillars.flatMap((p) => p.services.map((s) => s.name));
  const track = [...items, ...items];
  return (
    <div className="marquee-wrap overflow-hidden border-y border-line bg-surface py-4" aria-label="Capabilities">
      <ul className="marquee">
        {track.map((name, i) => (
          <li key={`${name}-${i}`} className="mono flex items-center gap-6 pr-6 text-[12px] uppercase tracking-[0.12em] text-muted" aria-hidden={i >= items.length}>
            <span>{name}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-volt shadow-[0_0_0_3px_rgba(101,245,69,0.18)]" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}
