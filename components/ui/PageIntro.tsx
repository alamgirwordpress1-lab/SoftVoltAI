import Link from "next/link";
import { cn } from "@/lib/utils";

export interface IntroPoint {
  /** Two or three words. */
  title: string;
  text: string;
}

export interface JumpLink {
  label: string;
  /** An anchor on this page (#section) or another page. */
  href: string;
}

/**
 * The band directly under every page banner: one H2, a sub-heading and the
 * copy that says what the page covers, plus the links that jump into it.
 *
 * It is deliberately not the banner. The banner is the paper rail with the
 * grid, the H1 and the orbit; this sits on surface, opens with a rule beside
 * the heading and runs in two columns, so the page reads as banner → intro →
 * sections rather than one long opener.
 */
export function PageIntro({
  eyebrow,
  title,
  subtitle,
  body,
  points,
  jump,
  id = "intro",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  /** One line under the heading, in ink: the page's promise in a sentence. */
  subtitle?: React.ReactNode;
  /** The paragraphs. Two is usually right; three is the most that reads. */
  body: React.ReactNode[];
  /** Up to four short definitions shown under the copy. */
  points?: IntroPoint[];
  /** "On this page" links — anchors the reader (and a crawler) can follow into the sections below. */
  jump?: JumpLink[];
  id?: string;
  className?: string;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("border-b border-line bg-surface", className)}>
      <div className="container-x grid gap-10 py-14 md:py-[4.5rem] lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5" data-reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h2 id={headingId} className="display display-lg mt-5 max-w-[17ch]">
            {title}
          </h2>
          {subtitle ? <p className="ui mt-5 max-w-[40ch] text-lg font-semibold leading-snug text-ink md:text-xl">{subtitle}</p> : null}
        </div>

        <div className="lg:col-span-6 lg:col-start-7" data-reveal style={{ ["--reveal-delay" as string]: "90ms" }}>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted md:text-base">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {points?.length ? (
            <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {points.map((p) => (
                <div key={p.title} className="border-t border-line pt-4">
                  <dt className="ui text-[15px] font-bold text-ink">{p.title}</dt>
                  <dd className="mt-1.5 text-[14px] leading-relaxed text-muted">{p.text}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {jump?.length ? (
            <nav className="mt-9" aria-label="On this page">
              <p className="mono text-[11px] uppercase tracking-[0.1em] text-muted">On this page</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {jump.map((j) => (
                  <li key={j.href}>
                    <Link
                      href={j.href}
                      className="ui inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-paper px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors duration-200 hover:border-ink"
                    >
                      {j.label}
                      <span aria-hidden="true" className="text-accent">
                        ↓
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </section>
  );
}
