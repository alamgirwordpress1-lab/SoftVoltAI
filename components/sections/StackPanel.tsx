import type { TechItem } from "@/lib/cms/types";
import { LiveVitals } from "@/components/sections/LiveVitals";
import { Chip } from "@/components/ui/Chip";
import type { HeadingLedeCopy } from "@/lib/cms/copy-types";

/** Engine room #2: the stack, and this site measured live in the visitor's own browser. */
export function StackPanel({ stack, copy }: { stack: TechItem[]; copy: HeadingLedeCopy & { vitals_heading: string; vitals_points: string[] } }) {
  const groups = Array.from(new Set(stack.map((s) => s.group)));
  return (
    <section id="stack" className="er section" aria-labelledby="stack-title">
      <div className="container-x">
        {/* heading and the live card share the top row; the stack list then runs
            the full width underneath, so neither column is left with a void */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6" data-reveal>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 id="stack-title" className="display display-lg mt-4">
              {copy.heading}
            </h2>
            <p className="lede mt-5">{copy.lede}</p>
          </div>

          <div className="lg:col-span-6" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            <LiveVitals heading={copy.vitals_heading} points={copy.vitals_points} />
          </div>
        </div>

        <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
          {groups.map((g) => (
            <div key={g}>
              <dt className="mono text-[11px] uppercase tracking-[0.12em] text-volt">{g}</dt>
              <dd className="mt-2.5 flex flex-wrap gap-2">
                {stack
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <Chip key={s.name} tone="dark">
                      {s.name}
                    </Chip>
                  ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
