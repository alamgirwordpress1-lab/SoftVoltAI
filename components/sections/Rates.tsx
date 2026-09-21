import type { EngagementModel } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import type { LinkCopy, LinkedHeadingCopy } from "@/lib/cms/copy-types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" className="mt-[3px] shrink-0 text-accent">
      <circle cx="9" cy="9" r="9" fill="currentColor" />
      <path d="m5.2 9.2 2.4 2.4 5.2-5.2" fill="none" stroke="var(--color-surface)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Plan cards: name, who it is for, the price band, what is included, one action.
 * The price band reads from `model.from` — while that is null it says the work is
 * quoted per scope, which is true today. Set `from` in content/stack.ts and the
 * figure renders in its place; no placeholder number is ever shown.
 */
export interface RatesCopy extends LinkedHeadingCopy {
  button: LinkCopy;
  price_note: string;
  no_price: string;
  no_price_note: string;
  note: string;
}

export function Rates({ models, copy, showHeading = true }: { models: EngagementModel[]; copy: RatesCopy; showHeading?: boolean }) {
  return (
    <section
      id="rates"
      className={showHeading ? "section container-x" : "container-x py-14 md:py-20"}
      aria-labelledby={showHeading ? "rates-title" : undefined}
      aria-label={showHeading ? undefined : "Engagement models"}
    >
      {showHeading ? (
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={<span id="rates-title">{copy.heading}</span>}
          lede={copy.lede}
          aside={copy.link.text ? <ArrowLink href={copy.link.url}>{copy.link.text}</ArrowLink> : undefined}
        />
      ) : null}

      <ul className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-4", showHeading && "mt-10")}>
        {models.map((m, i) => (
          <li key={m.id} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
            <article className={cn("card card-lift shadow-soft flex h-full flex-col overflow-hidden", m.badge && "ring-2 ring-accent")}>
              <div className="p-7 pb-6">
                {/* badge sits beside the name, not above it, so the price bands
                    and buttons stay on one line across all three cards */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="ui text-xl font-bold tracking-[-0.01em] text-ink">{m.name}</h3>
                  {m.badge ? (
                    <span className="ui shrink-0 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-paper">
                      {m.badge}
                    </span>
                  ) : null}
                </div>
                {/* holds three lines at the four-column width so every price band lines up */}
                <p className="mt-2 min-h-[4.5rem] text-[15px] leading-relaxed text-muted">{m.bestFor}</p>
              </div>

              <div className="border-y border-line bg-paper px-7 py-6">
                {m.from ? (
                  <p className="flex items-baseline gap-1.5">
                    <span className="display text-[36px] leading-none text-ink">{m.from}</span>
                    {m.period ? <span className="mono text-[13px] text-muted">{m.period}</span> : null}
                  </p>
                ) : (
                  <p className="display text-[32px] leading-none text-ink">{copy.no_price}</p>
                )}
                <p className="mono mt-2 text-[12px] leading-relaxed text-muted">
                  {m.from ? copy.price_note : copy.no_price_note}
                </p>
              </div>

              <ul className="flex flex-1 flex-col gap-3 p-7 text-[14px] leading-relaxed text-ink">
                {m.includes.map((inc) => (
                  <li key={inc} className="flex gap-2.5">
                    <Tick />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>

              <div className="px-7 pb-7 [&>*]:w-full [&>*]:justify-center">
                {copy.button.text ? <Button href={copy.button.url}>{copy.button.text}</Button> : null}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* Every card already carries the action, so this is a note, not another button. */}
      {copy.note ? (
        <p className="mt-7 text-[14px] leading-relaxed text-muted" data-reveal>
          {copy.note}
        </p>
      ) : null}
    </section>
  );
}
