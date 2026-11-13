import Link from "@/components/ui/Link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import type { LinkedHeadingCopy } from "@/lib/cms/copy-types";

export interface CoreServiceItem {
  name: string;
  url: string;
  outcome: string;
  /** One deliverable per line. */
  includes: string;
  /** "From $1,500" — left empty, the card shows no price. */
  price: string;
  /** "10–15 working days" — left empty, the card shows no time. */
  time: string;
}

export interface CoreServicesCopy extends LinkedHeadingCopy {
  items: CoreServiceItem[];
}

/**
 * The four things agencies brief us for most, each as a card a client can
 * read in ten seconds: what it is, what comes back, what it costs and how
 * long it takes. Everything else we do lives on /services, one click away.
 */
export function CoreServices({
  copy,
  tone = "base",
}: {
  copy: CoreServicesCopy;
  tone?: "base" | "alt";
}) {
  const cards = copy.items.filter((s) => s.name);
  return (
    <section
      id="services"
      className={tone === "alt" ? "section section-alt" : "section"}
      aria-labelledby="services-title"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={<span id="services-title">{copy.heading}</span>}
          lede={copy.lede}
          aside={
            copy.link.text ? (
              <ArrowLink href={copy.link.url}>{copy.link.text}</ArrowLink>
            ) : undefined
          }
        />

        <ul className="fx-spot mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((s, i) => {
            const includes = s.includes
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            const facts = [s.price, s.time].filter(Boolean);
            return (
              <li
                key={s.name}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
              >
                <article className="card card-lift shadow-soft group/card relative flex h-full flex-col overflow-hidden p-6 md:p-7">
                  <span
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover/card:scale-x-100"
                    aria-hidden="true"
                  />
                  <span className="mono text-[12px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display mt-3 text-[26px] leading-[1.1]">
                    <Link
                      href={s.url}
                      prefetch={false}
                      className="after:absolute after:inset-0"
                    >
                      {s.name}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">
                    {s.outcome}
                  </p>

                  {includes.length ? (
                    <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                      {includes.map((line) => (
                        <li
                          key={line}
                          className="flex gap-2.5 text-[14px] leading-snug text-ink"
                        >
                          <svg
                            viewBox="0 0 16 16"
                            width="16"
                            height="16"
                            className="mt-[1px] shrink-0 text-accent"
                            aria-hidden="true"
                          >
                            <path
                              d="M3.5 8.5l3 3 6-7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-auto pt-6">
                    {facts.length ? (
                      <p className="mono rounded-[10px] bg-paper px-3.5 py-2.5 text-[12px] uppercase tracking-[0.06em] text-ink">
                        {facts.join(" · ")}
                      </p>
                    ) : null}
                    <p className="ui mt-4 text-[14px] font-bold text-ink transition-colors group-hover/card:text-accent">
                      See what is included <span aria-hidden="true">→</span>
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
