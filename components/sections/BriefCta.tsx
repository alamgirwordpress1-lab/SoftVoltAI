import Link from "next/link";
import { BriefForm } from "@/components/sections/BriefForm";
import type { BriefFormCopy } from "@/lib/cms/copy-types";
import { getSiteChrome } from "@/lib/cms/site";
import type { HeadingLedeCopy } from "@/lib/cms/copy-types";

export interface BriefCopy extends HeadingLedeCopy {
  call_label: string;
  call_link: string;
  call_text: string;
  email_label: string;
  hours_label: string;
  hours_text: string;
  later_label: string;
  later_links: { text: string; url: string }[];
}

/**
 * The home page's closing band: the four-step brief form, with the ways to
 * reach us beside it. The words are the home page's "Brief form" tab; the
 * booking link and the email are the site settings.
 */
export async function BriefCta({ copy, form }: { copy: BriefCopy; form: BriefFormCopy }) {
  const { calUrl, email } = await getSiteChrome();

  return (
    <section id="brief" className="border-t border-line bg-surface" aria-labelledby="brief-title">
      <div className="container-x section relative grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5" data-reveal>
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2 id="brief-title" className="display display-md mt-4">
            {copy.heading}
          </h2>
          <p className="lede mt-5">{copy.lede}</p>
          <dl className="mt-8 grid gap-x-8 gap-y-5 text-[15px] sm:grid-cols-2">
            <div>
              <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{copy.call_label}</dt>
              <dd className="mt-1 text-ink">
                {calUrl ? (
                  <a href={calUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:decoration-accent">
                    {copy.call_link}
                  </a>
                ) : (
                  copy.call_text
                )}
              </dd>
            </div>
            <div>
              <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{copy.email_label}</dt>
              <dd className="mt-1">
                <a href={`mailto:${email}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent">
                  {email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{copy.hours_label}</dt>
              <dd className="mt-1 text-ink">{copy.hours_text}</dd>
            </div>
          </dl>

          {/* the page ends on this form, so the last word goes to the reader who
              is not ready to fill it in yet */}
          {copy.later_links.length ? (
            <div className="mt-10 border-t border-line pt-6">
              {copy.later_label ? <p className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{copy.later_label}</p> : null}
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {copy.later_links.map((l) => (
                  <li key={l.url + l.text}>
                    <Link href={l.url} className="ui text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent">
                      {l.text} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="lg:col-span-7" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
          <BriefForm copy={form} />
        </div>
      </div>
    </section>
  );
}
