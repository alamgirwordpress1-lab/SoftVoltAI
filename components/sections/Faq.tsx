import Link from "next/link";
import type { Faq as FaqItem } from "@/lib/cms/types";
import { Button } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import type { HeadingCopy, LinkCopy } from "@/lib/cms/copy-types";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";

/** Plain text for structured data: no tags, and [label](url) links reduced to their label. */
const plain = (text: string) =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export interface FaqCopy extends HeadingCopy {
  card_title: string;
  card_text: string;
  card_button: LinkCopy;
  card_link: LinkCopy;
}

/**
 * Native <details> accordion: readable without JavaScript and indexable as
 * visible HTML. Google no longer shows FAQ rich results, but the FAQPage data
 * below is still read by answer engines (AI Overviews, ChatGPT, Perplexity).
 */
export function Faq({ faqs, copy }: { faqs: FaqItem[]; copy: FaqCopy }) {
  return (
    <section id="faq" className="section container-x" aria-labelledby="faq-title">
      {faqs.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: plain(f.q), acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
          }}
        />
      ) : null}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28" data-reveal>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 id="faq-title" className="display display-lg mt-4">
              {copy.heading}
            </h2>
            <div className="card shadow-soft mt-8 p-6">
              <p className="ui text-[15px] font-bold text-ink">{copy.card_title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                <Rich text={copy.card_text} />
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {copy.card_button.text ? <Button href={copy.card_button.url}>{copy.card_button.text}</Button> : null}
                {copy.card_link.text ? (
                  <Link
                    href={copy.card_link.url}
                    className="ui inline-flex items-center gap-2 py-3 text-[14px] font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
                  >
                    {copy.card_link.text} <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <FaqList faqs={faqs} className="lg:col-span-8" />
      </div>
    </section>
  );
}

/** The questions on their own, for a page that sets its own heading beside them (the service pages). */
export function FaqList({ faqs, className }: { faqs: FaqItem[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3", className)}>
      {faqs.map((f, i) => (
        <li key={f.q} data-reveal style={{ ["--reveal-delay" as string]: `${Math.min(i, 4) * 50}ms` }}>
          <details className="faq card group overflow-hidden transition-colors duration-200 open:border-line-strong hover:border-line-strong">
            <summary className="flex cursor-pointer items-start gap-4 p-6">
              <span className="mono mt-1 text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="ui flex-1 text-[17px] font-bold leading-snug text-ink">{f.q}</span>
              <span className="faq-icon mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-colors group-open:border-accent" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <div className="faq-body px-6 pb-6 pl-[4.25rem]">
              <p className="max-w-[68ch] text-[15px] leading-relaxed text-muted md:text-base">{f.a}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
