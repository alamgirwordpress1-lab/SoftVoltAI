import type { ComparisonRow } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LogoMark } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import type { HeadingLedeCopy, LinkCopy } from "@/lib/cms/copy-types";

export interface ComparisonCopy extends HeadingLedeCopy {
  heading_accent: string;
  col_dimension: string;
  col_in_house: string;
  col_freelancer: string;
  footnote: string;
  closing: string;
  closing_button: LinkCopy;
  closing_link: LinkCopy;
}

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" className="mt-[3px] shrink-0 text-line-strong">
      <circle cx="9" cy="9" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="m6.2 6.2 5.6 5.6M11.8 6.2l-5.6 5.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true" className="mt-[3px] shrink-0 text-accent">
      <circle cx="9" cy="9" r="8.25" fill="currentColor" opacity="0.12" />
      <circle cx="9" cy="9" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="m5.5 9.2 2.3 2.3 4.7-4.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Build-or-buy table: a real <table> for screen readers and search, styled as one card with a highlighted column. */
export function Comparison({ rows, source, copy }: { rows: ComparisonRow[]; source: { label: string; href: string }; copy: ComparisonCopy }) {
  return (
    <section id="comparison" className="section container-x" aria-labelledby="comparison-title">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={
          <span id="comparison-title">
            {copy.heading} {copy.heading_accent ? <span className="text-accent">{copy.heading_accent}</span> : null}
          </span>
        }
        lede={copy.lede}
      />

      <div className="card shadow-float relative mt-12 overflow-hidden" data-reveal>
        {/* the highlighted column runs the full height of the card */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[30%] bg-accent-soft/50 lg:block" aria-hidden="true" />
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <caption className="sr-only">
              {copy.col_in_house}, {copy.col_freelancer.toLowerCase()} and SoftVolt AI compared across {rows.length} dimensions
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="ui w-[22%] px-6 py-6 align-bottom text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
                  {copy.col_dimension}
                </th>
                <th scope="col" className="ui w-[24%] px-6 py-6 align-bottom text-[16px] font-bold text-ink">
                  {copy.col_in_house}
                </th>
                <th scope="col" className="ui w-[24%] px-6 py-6 align-bottom text-[16px] font-bold text-ink">
                  {copy.col_freelancer}
                </th>
                <th scope="col" className="w-[30%] px-6 py-5 align-bottom">
                  <span className="ui inline-flex items-center gap-2.5 rounded-full bg-ink px-4 py-2 text-[15px] font-bold text-paper">
                    <LogoMark size={20} id="logo-compare" />
                    SoftVolt AI
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.dimension} className="group border-b border-line last:border-b-0">
                  <th scope="row" className="ui px-6 py-5 align-top text-[14px] font-bold leading-snug text-ink">
                    {r.dimension}
                  </th>
                  <td className="px-6 py-5 align-top text-[14px] leading-relaxed text-muted">
                    <span className="flex gap-2.5">
                      <Cross />
                      {r.inHouse}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top text-[14px] leading-relaxed text-muted">
                    <span className="flex gap-2.5">
                      <Cross />
                      {r.freelancer}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top text-[14px] font-semibold leading-relaxed text-ink transition-colors duration-200 group-hover:bg-accent-soft/60">
                    <span className="flex gap-2.5">
                      <Check />
                      {r.us}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mono mt-4 text-[11px] leading-relaxed text-muted">
        {copy.footnote}{" "}
        <a href={source.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:decoration-accent">
          {source.label}
        </a>
        .
      </p>

      <div className="card shadow-soft mt-6 flex flex-col items-start justify-between gap-6 p-7 md:flex-row md:items-center" data-reveal>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted md:text-base">{copy.closing}</p>
        <div className="flex flex-wrap gap-3">
          {copy.closing_button.text ? <Button href={copy.closing_button.url}>{copy.closing_button.text}</Button> : null}
          {copy.closing_link.text ? (
            <Button href={copy.closing_link.url} variant="secondary">
              {copy.closing_link.text}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
