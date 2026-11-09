import { Button } from "@/components/ui/Button";
import type { LinkCopy } from "@/lib/cms/copy-types";

export interface BundleCopy {
  eyebrow: string;
  name: string;
  lede: string;
  price: string;
  compare: string;
  includes: string;
  button: LinkCopy;
  button_2: LinkCopy;
}

/**
 * The featured package at the top of /pricing: one wide card, the offer on the
 * left and the price and what is included on the right. Words come from the
 * Pricing page in WordPress (AI-ready website bundle).
 */
export function BundleCard({ copy }: { copy: BundleCopy }) {
  if (!copy.name) return null;
  const lines = copy.includes.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  return (
    <section id="bundle" className="py-12 md:py-16" aria-labelledby="bundle-title">
      <div className="container-x">
        <article className="card shadow-soft grid overflow-hidden ring-2 ring-accent lg:grid-cols-12" data-reveal>
          <div className="p-7 md:p-10 lg:col-span-7">
            {copy.eyebrow ? (
              <span className="ui inline-flex rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-paper">
                {copy.eyebrow}
              </span>
            ) : null}
            <h2 id="bundle-title" className="display display-md mt-5">
              {copy.name}
            </h2>
            <p className="lede mt-4 max-w-[52ch]">{copy.lede}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {copy.button.text ? <Button href={copy.button.url}>{copy.button.text}</Button> : null}
              {copy.button_2.text ? (
                <Button href={copy.button_2.url} variant="secondary">
                  {copy.button_2.text}
                </Button>
              ) : null}
            </div>
          </div>
          <div className="border-t border-line bg-paper p-7 md:p-10 lg:col-span-5 lg:border-l lg:border-t-0">
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="display text-[44px] leading-none text-ink">{copy.price}</span>
              {copy.compare ? <span className="mono text-[13px] text-muted">{copy.compare}</span> : null}
            </p>
            <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-ink">
              {lines.map((l) => (
                <li key={l} className="flex gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" className="mt-[4px] shrink-0 text-accent">
                    <circle cx="9" cy="9" r="9" fill="currentColor" />
                    <path d="m5.2 9.2 2.4 2.4 5.2-5.2" fill="none" stroke="var(--color-surface)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
