import Link from "next/link";
import type { AgencyType } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";

const GLYPHS: Record<string, React.ReactNode> = {
  "digital-marketing-agencies": <path d="M3 10v4h3l7 4V6l-7 4H3Zm13-1a3 3 0 0 1 0 6m2-9a6 6 0 0 1 0 12" />,
  "seo-agencies": <path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5M7 10h6M10 7v6" />,
  "google-ads-agencies": <path d="M5 4v12l4-3 2 5 2-1-2-5h5L5 4Z" />,
  "branding-agencies": <path d="M4 20c4-1 5-3 6-6l7-7a2 2 0 0 0-3-3l-7 7c-3 1-5 2-6 6l3 3Zm7-9 3 3" />,
  "web-design-agencies": <path d="M3 5h18v14H3V5Zm0 5h18M9 10v9" />,
  "full-service-agencies": <path d="M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5" />,
};

export function AgencyTypes({ items }: { items: AgencyType[] }) {
  return (
    <section id="who-we-help" className="section section-alt" aria-labelledby="who-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="Who we help"
          title={<span id="who-title">Built for agencies that have already sold the work.</span>}
          lede="You own the client, the strategy and the invoice. We take the part that is blocking your calendar."
          aside={<ArrowLink href="/for">How we work with each agency type</ArrowLink>}
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((a, i) => (
            <li key={a.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link href={`/for/${a.slug}`} prefetch={false} className="card card-lift shadow-soft group flex h-full flex-col bg-paper p-6 md:p-7">
                <span className="icon-tile transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:-rotate-6 group-hover:scale-110">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {GLYPHS[a.slug]}
                  </svg>
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-ink">{a.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  <span className="relative after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-muted after:transition-transform after:duration-500 after:ease-[var(--ease-out-quart)] group-hover:after:scale-x-100">
                    {a.problem}
                  </span>
                </p>
                <p className="mt-4 flex gap-2 border-t border-line pt-4 text-[15px] leading-relaxed text-ink">
                  <span className="mono mt-[3px] shrink-0 text-xs text-accent transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    →
                  </span>
                  <span>{a.relief}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
