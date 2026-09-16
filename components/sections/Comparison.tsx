import type { ComparisonRow } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LogoMark } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";

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
export function Comparison({ rows, source }: { rows: ComparisonRow[]; source: { label: string; href: string } }) {
  return (
    <section id="comparison" className="section container-x" aria-labelledby="comparison-title">
      <SectionHeading
        eyebrow="The comparison"
        title={
          <span id="comparison-title">
            In-house hire vs. freelancer vs. <span className="text-accent">a white-label partner.</span>
          </span>
        }
        lede="Every agency hits the same build-or-buy decision once client demand stops arriving on a predictable schedule. Here is how the three options compare on the things that decide your margin."
      />

      <div className="card shadow-float relative mt-12 overflow-hidden" data-reveal>
        {/* the highlighted column runs the full height of the card */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[30%] bg-accent-soft/50 lg:block" aria-hidden="true" />
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <caption className="sr-only">An in-house hire, a freelancer and SoftVolt AI compared across nine dimensions</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="ui w-[22%] px-6 py-6 align-bottom text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
                  Dimension
                </th>
                <th scope="col" className="ui w-[24%] px-6 py-6 align-bottom text-[16px] font-bold text-ink">
                  In-house hire
                </th>
                <th scope="col" className="ui w-[24%] px-6 py-6 align-bottom text-[16px] font-bold text-ink">
                  Freelancer
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
        * Median annual pay for web developers in the US, May 2025, excluding benefits, taxes and equipment. Source:{" "}
        <a href={source.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-2 hover:decoration-accent">
          {source.label}
        </a>
        .
      </p>

      <div className="card shadow-soft mt-6 flex flex-col items-start justify-between gap-6 p-7 md:flex-row md:items-center" data-reveal>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted md:text-base">
          If hiring is what is capping your agency&apos;s growth, this table usually settles it. Start with one brief and judge the
          delivery, not the pitch.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact">Send us a brief</Button>
          <Button href="/about#how-it-works" variant="secondary">
            See how it runs
          </Button>
        </div>
      </div>
    </section>
  );
}
