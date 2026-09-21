import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import type { HeadingLedeCopy } from "@/lib/cms/copy-types";

type Notes = { name: string; note: string }[];
const noteFor = (notes: Notes, name: string) => notes.find((n) => n.name.trim().toLowerCase() === name.trim().toLowerCase())?.note;

/** Tools that have a service page of their own; anything else stays a plain chip. */
const TOOL_SERVICE: Record<string, string> = {
  WordPress: "/services/white-label-wordpress-development",
  WooCommerce: "/services/woocommerce-development",
  "Headless WordPress": "/services/headless-wordpress-development",
  Elementor: "/services/elementor-development",
  Shopify: "/services/shopify-development",
  "Technical SEO": "/services/technical-seo-services",
  "Local SEO": "/services/local-seo-services",
  "Next.js": "/services/nextjs-postgres-apps",
  Payload: "/services/nextjs-payload-postgresql",
  Maintenance: "/services/website-maintenance",
};

/** The build that shows the most of how we work — the first one in the content file. */
export function CaseSpotlight({ item, copy }: { item: WorkItem; copy: HeadingLedeCopy & { link: string } }) {
  return (
    <section id="spotlight" className="container-x border-b border-line py-14 md:py-20" aria-labelledby="spotlight-title">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={<span id="spotlight-title">{copy.heading}</span>}
        lede={copy.lede}
      />

      <div className="card shadow-soft mt-10 grid gap-0 overflow-hidden lg:grid-cols-12" data-reveal>
        {item.image ? (
          <div className="relative aspect-[16/10] border-b border-line bg-raised lg:col-span-7 lg:aspect-auto lg:border-b-0 lg:border-r">
            <Image src={item.image} alt={`${item.title} — the live site`} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-top" />
          </div>
        ) : null}
        <div className="p-6 md:p-9 lg:col-span-5">
          <span className="mono text-[11px] uppercase tracking-[0.1em] text-accent">
            {item.category} · {item.region}
          </span>
          <h3 className="display display-md mt-3">{item.title}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{item.summary}</p>
          <ul className="mt-6 space-y-2.5">
            {item.delivered.slice(0, 3).map((d) => (
              <li key={d} className="flex gap-3 text-[14px] leading-relaxed text-ink">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {copy.link ? <ArrowLink href={`/case-studies/${item.slug}`}>{copy.link}</ArrowLink> : null}
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="ui text-[14px] font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
                Open the live site
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Angle one: the kind of work, with every build in the group listed by name. */
export function CaseByType({ items, categories, copy }: { items: WorkItem[]; categories: string[]; copy: HeadingLedeCopy & { notes: Notes } }) {
  const groups = categories
    .filter((c) => c !== categories[0])
    .map((name) => ({ name, note: noteFor(copy.notes, name), builds: items.filter((w) => w.category === name) }))
    .filter((g) => g.builds.length);

  return (
    <section id="by-type" className="container-x border-b border-line py-14 md:py-20" aria-labelledby="by-type-title">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={<span id="by-type-title">{copy.heading}</span>}
        lede={copy.lede}
      />

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {groups.map((g, i) => (
          <li key={g.name} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
            <div className="card shadow-soft flex h-full flex-col p-6 md:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{g.name}</h3>
                <span className="mono text-[12px] text-muted">
                  {g.builds.length} {g.builds.length === 1 ? "build" : "builds"}
                </span>
              </div>
              {g.note ? <p className="mt-2.5 text-[14px] leading-relaxed text-muted">{g.note}</p> : null}
              <ul className="mt-5 space-y-2 border-t border-line pt-4">
                {g.builds.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/case-studies/${b.slug}`} prefetch={false} className="ui group flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink hover:text-accent">
                      <span>{b.title}</span>
                      <span className="mono text-[11px] uppercase tracking-[0.08em] text-muted transition-colors group-hover:text-accent">{b.region}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Angles two and three, side by side: the market a build was for, and what it was made with. */
export interface MarketCopy extends HeadingLedeCopy {
  markets_heading: string;
  markets: Notes;
  stack_heading: string;
  stack_lede: string;
  stack_note: string;
}

export function CaseByMarketAndStack({ items, copy }: { items: WorkItem[]; copy: MarketCopy }) {
  const regions = [...new Set(items.map((w) => w.region))].map((region) => ({
    region,
    note: noteFor(copy.markets, region),
    builds: items.filter((w) => w.region === region),
  }));

  const tools = new Map<string, number>();
  for (const tool of items.flatMap((w) => w.stack)) tools.set(tool, (tools.get(tool) ?? 0) + 1);
  const ranked = [...tools].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <section id="by-market" className="container-x border-b border-line py-14 md:py-20" aria-labelledby="by-market-title">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={<span id="by-market-title">{copy.heading}</span>}
        lede={copy.lede}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <h3 className="ui text-[15px] font-bold text-ink">{copy.markets_heading}</h3>
          <ul className="mt-5 space-y-4">
            {regions.map((r, i) => (
              <li key={r.region} className="card shadow-soft p-5 md:p-6" data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="ui text-[15px] font-bold text-ink">{r.region}</h4>
                  <span className="mono text-[12px] text-muted">
                    {r.builds.length} {r.builds.length === 1 ? "build" : "builds"}
                  </span>
                </div>
                {r.note ? <p className="mt-2 text-[14px] leading-relaxed text-muted">{r.note}</p> : null}
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  {r.builds.map((b, k) => (
                    <span key={b.slug}>
                      {k > 0 ? " · " : ""}
                      <Link href={`/case-studies/${b.slug}`} prefetch={false} className="text-ink underline-offset-4 hover:text-accent hover:underline">
                        {b.title}
                      </Link>
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <h3 className="ui text-[15px] font-bold text-ink">{copy.stack_heading}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">{copy.stack_lede}</p>
          <ul className="mt-5 flex flex-wrap gap-2" data-reveal>
            {ranked.map(([tool, n]) => {
              const href = TOOL_SERVICE[tool];
              const body = (
                <>
                  {tool}
                  <span className="mono text-[11px] text-muted">{n}</span>
                </>
              );
              return (
                <li key={tool}>
                  {href ? (
                    <Link
                      href={href}
                      prefetch={false}
                      className="ui inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors duration-200 hover:border-ink hover:text-accent"
                    >
                      {body}
                    </Link>
                  ) : (
                    <span className="ui inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] font-semibold text-muted">{body}</span>
                  )}
                </li>
              );
            })}
          </ul>
          {copy.stack_note ? <p className="mt-6 text-[14px] leading-relaxed text-muted">{copy.stack_note}</p> : null}
        </div>
      </div>
    </section>
  );
}
