import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";

/** What each category means, so a group reads as a kind of work rather than a tag. */
const CATEGORY_NOTE: Record<string, string> = {
  "Headless & Next.js": "WordPress stays the editor the client already knows; the front end is a Next.js app on its own deploy.",
  "E-commerce": "WooCommerce stores — catalogue, checkout, payment, and the maintenance that follows the launch.",
  Corporate: "Sites where the pages have to be exact, the forms have to work and nothing may break on a Friday.",
  "Agency & SEO": "Builds where the technical SEO shaped the structure instead of being a plugin added at the end.",
};

/** What working from Dhaka means for each market. Hours, not claims. */
const MARKET_NOTE: Record<string, string> = {
  "United Kingdom": "Dhaka is UTC+6. A brief sent at 5pm London is picked up the next morning, with the reply waiting when you open.",
  "United States": "The Dhaka day ends as the US east coast starts, so overnight progress is the normal rhythm rather than the exception.",
  Bangladesh: "Where the team sits. These are builds we can walk through end to end, from the first wireframe to the live site.",
};

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
export function CaseSpotlight({ item }: { item: WorkItem }) {
  return (
    <section id="spotlight" className="container-x border-b border-line py-14 md:py-20" aria-labelledby="spotlight-title">
      <SectionHeading
        eyebrow="Spotlight"
        title={<span id="spotlight-title">Start with the one that shows the most.</span>}
        lede="One build in full: what the brief needed, what was actually made, and the link to open it yourself."
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
            <ArrowLink href={`/case-studies/${item.slug}`}>Read the case study</ArrowLink>
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
export function CaseByType({ items, categories }: { items: WorkItem[]; categories: string[] }) {
  const groups = categories
    .filter((c) => c !== categories[0])
    .map((name) => ({ name, note: CATEGORY_NOTE[name], builds: items.filter((w) => w.category === name) }))
    .filter((g) => g.builds.length);

  return (
    <section id="by-type" className="container-x border-b border-line py-14 md:py-20" aria-labelledby="by-type-title">
      <SectionHeading
        eyebrow="By what we built"
        title={<span id="by-type-title">Four kinds of brief, eight finished builds.</span>}
        lede="The same four kinds of work an agency sends us today. Each group lists the builds it covers, so you can go straight to the one closest to your client&rsquo;s brief."
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
                    <Link href={`/case-studies/${b.slug}`} className="ui group flex items-baseline justify-between gap-3 text-[14px] font-semibold text-ink hover:text-accent">
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
export function CaseByMarketAndStack({ items }: { items: WorkItem[] }) {
  const regions = [...new Set(items.map((w) => w.region))].map((region) => ({
    region,
    note: MARKET_NOTE[region],
    builds: items.filter((w) => w.region === region),
  }));

  const tools = new Map<string, number>();
  for (const tool of items.flatMap((w) => w.stack)) tools.set(tool, (tools.get(tool) ?? 0) + 1);
  const ranked = [...tools].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <section id="by-market" className="container-x border-b border-line py-14 md:py-20" aria-labelledby="by-market-title">
      <SectionHeading
        eyebrow="By market and by stack"
        title={<span id="by-market-title">Where each build was for, and what it was made with.</span>}
        lede="Two more ways to read the same eight builds: the market the client sells in, and the tools the work actually used."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <h3 className="ui text-[15px] font-bold text-ink">The markets</h3>
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
                      <Link href={`/case-studies/${b.slug}`} className="text-ink underline-offset-4 hover:text-accent hover:underline">
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
          <h3 className="ui text-[15px] font-bold text-ink">The stack, counted</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            Every tool named in a case study, with the number of builds it appears in. The ones we offer as a service link through to it.
          </p>
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
          <p className="mt-6 text-[14px] leading-relaxed text-muted">
            Nothing here is a logo wall: every count comes from a build listed on this page, and every tool is one the team uses in production.
          </p>
        </div>
      </div>
    </section>
  );
}
