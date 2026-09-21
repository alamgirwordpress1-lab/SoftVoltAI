import Image from "next/image";
import type { TeamMember } from "@/content/founder";
import { ArrowLink } from "@/components/ui/ArrowLink";
import type { HeadingCopy, LinkCopy } from "@/lib/cms/copy-types";

/**
 * Leadership cards. One card per person, side by side once there are two —
 * a single member simply renders one card at half width on desktop.
 * `headline` and `quote` are optional: a quote is that person's own words, so
 * the card just omits the block until they have written one.
 */
export function Founder({ team, copy }: { team: TeamMember[]; copy: HeadingCopy & { link: LinkCopy } }) {
  return (
    <section id="founder" className="section section-alt" aria-labelledby="founder-title">
      <div className="container-x">
        {/* heading left, one action right — same arrangement as the reference */}
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <div>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 id="founder-title" className="display display-lg mt-4 max-w-[18ch]">
              {copy.heading}
            </h2>
          </div>
          {copy.link.text ? <ArrowLink href={copy.link.url}>{copy.link.text}</ArrowLink> : null}
        </div>

        {/* Always two columns: one card keeps the reference proportions, and the
            second person drops in beside it without any layout change. */}
        <ul className="mt-10 grid gap-5 lg:grid-cols-2">
          {team.map((m, i) => (
            <li key={m.name} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
              <article className="card shadow-soft grid h-full overflow-hidden sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
                <div className="relative aspect-[4/5] bg-raised sm:aspect-auto sm:min-h-[320px]">
                  <Image
                    src={m.photo}
                    alt={`${m.name}, ${m.role}`}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
                    className="object-cover object-[center_20%]"
                  />
                </div>

                <div className="flex flex-col p-6 md:p-7">
                  <h3 className="display text-[26px] leading-tight text-ink">{m.name}</h3>
                  <p className="ui mt-1 text-[13px] font-bold uppercase tracking-[0.08em] text-accent">{m.role}</p>

                  {m.headline ? <p className="ui mt-4 text-[15px] font-bold leading-snug text-ink">{m.headline}</p> : null}

                  {m.bio ? <p className="mt-3 text-[15px] leading-relaxed text-muted">{m.bio}</p> : null}

                  {m.quote ? (
                    <blockquote className="mt-5 border-l-2 border-accent bg-accent-soft/40 px-4 py-3 text-[14px] italic leading-relaxed text-ink">
                      &ldquo;{m.quote}&rdquo;
                    </blockquote>
                  ) : null}

                  {m.facts?.length ? (
                    <p className="ui mt-5 text-[13px] font-semibold leading-relaxed text-muted">{m.facts.join(" · ")}</p>
                  ) : null}

                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui mt-auto inline-flex w-max items-center gap-1.5 pt-6 text-[14px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    Visit LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
