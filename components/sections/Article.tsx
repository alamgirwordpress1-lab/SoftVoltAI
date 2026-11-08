import { Rich } from "@/components/ui/Rich";
import type { HeadingLedeCopy } from "@/lib/cms/copy-types";

export interface ArticleCopy extends HeadingLedeCopy {
  /** One block per question the page answers: an H2-level heading and its paragraphs (blank line between them). */
  blocks: { title: string; text: string }[];
}

/**
 * Long-form reading band for the guide pages (/pricing, /how-we-work,
 * /why-softvoltai). A sticky heading on the left, then one block per topic,
 * each with its own heading so a crawler and an answer engine can lift a
 * single answer out of the page. Paragraphs are split on blank lines and
 * accept [label](/url) links.
 */
export function Article({ id, copy, tone }: { id: string; copy: ArticleCopy; tone?: "alt" }) {
  if (!copy.blocks.length) return null;
  return (
    <section id={id} className={tone === "alt" ? "section section-alt" : "section border-t border-line"} aria-labelledby={`${id}-title`}>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start" data-reveal>
          {copy.eyebrow ? <span className="eyebrow">{copy.eyebrow}</span> : null}
          <h2 id={`${id}-title`} className="display display-md mt-4">
            {copy.heading}
          </h2>
          {copy.lede ? <p className="mt-4 text-[15px] leading-relaxed text-muted">{copy.lede}</p> : null}
        </div>
        <div className="space-y-10 lg:col-span-8">
          {copy.blocks.map((b, i) => (
            <article key={b.title} data-reveal style={{ ["--reveal-delay" as string]: `${Math.min(i, 4) * 40}ms` }}>
              <h3 className="ui text-[20px] font-bold leading-snug tracking-[-0.01em] text-ink md:text-[22px]">{b.title}</h3>
              <div className="mt-3 space-y-4 text-[16px] leading-relaxed text-muted">
                {b.text
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((p, j) => (
                    <p key={j}>
                      <Rich text={p} />
                    </p>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
