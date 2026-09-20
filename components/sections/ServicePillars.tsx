import Link from "next/link";
import type { PillarGroup } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

/**
 * The page's one bento block. Build is the wide cell with its six most-sent
 * briefs; the rest of its list lives on the services page.
 */
export function ServicePillars({ pillars }: { pillars: PillarGroup[] }) {
  const byId = Object.fromEntries(pillars.map((p) => [p.id, p])) as Record<string, PillarGroup>;
  return (
    <section id="services" className="section container-x" aria-labelledby="services-title">
      <SectionHeading
        eyebrow="Services"
        title={<span id="services-title">Build, automate, grow, support — one partner, one contract.</span>}
        lede="Most white-label shops sell hours of development. Agencies also need the automation, the SEO implementation, the ad execution and the maintenance that keep a client. We cover all four."
        aside={<ArrowLink href="/services">Explore every service</ArrowLink>}
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <PillarCard pillar={byId.build} className="lg:col-span-2" visual={<BuildVisual />} wide featured={8} />
        <PillarCard pillar={byId.automate} visual={<AutomateVisual />} delay={80} />
        <PillarCard pillar={byId.grow} visual={<GrowVisual />} delay={120} />
        <PillarCard pillar={byId.support} visual={<SupportVisual />} delay={160} />

        <article data-reveal style={{ ["--reveal-delay" as string]: "200ms" }} className="er relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] p-6 md:p-8">
          <div className="grid-lines" aria-hidden="true" />
          <div className="relative">
            <span className="pill">Not sure where it fits?</span>
            <h3 className="display mt-5 text-[26px] leading-[1.1]">Send the brief. The scope tells you which service — and what it costs.</h3>
            {/* what the brief actually gets back, so the card is an answer rather than a slogan */}
            <ol className="mt-7 space-y-3.5">
              {[
                { k: "01", t: "A named producer replies", m: "Within 1 business day" },
                { k: "02", t: "Scope, line by line, priced", m: "Within 2 business days" },
                { k: "03", t: "Work starts on your approval", m: "Fixed price, your brand" },
              ].map((s) => (
                <li key={s.k} className="grid grid-cols-[28px_1fr] gap-3 border-t border-er-line pt-3.5">
                  <span className="mono text-[12px] text-volt">{s.k}</span>
                  <span>
                    <span className="ui block text-[14px] font-bold leading-snug text-er-ink">{s.t}</span>
                    <span className="mono mt-1 block text-[11px] uppercase tracking-[0.08em] text-er-muted">{s.m}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative mt-8">
            <Button href="/contact" variant="onDark">
              Send us a brief
            </Button>
            <p className="mt-4 text-[13px] leading-relaxed text-er-muted">Client names can wait until the NDA is signed.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function PillarCard({
  pillar,
  visual,
  wide = false,
  featured,
  delay = 0,
  className,
}: {
  pillar: PillarGroup;
  visual: React.ReactNode;
  wide?: boolean;
  featured?: number;
  delay?: number;
  className?: string;
}) {
  const shown = featured ? pillar.services.slice(0, featured) : pillar.services;
  const hidden = pillar.services.length - shown.length;

  return (
    <article
      data-reveal
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={cn("card card-lift shadow-soft group/card relative flex flex-col overflow-hidden p-6 md:p-8", className)}
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover/card:scale-x-100"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-6">
        <div>
          <span className="eyebrow">{pillar.name}</span>
          <h3 className={cn("display mt-4 max-w-[22ch]", wide ? "display-md" : "text-[26px] leading-[1.1]")}>{pillar.tagline}</h3>
        </div>
        <span className="mono whitespace-nowrap pt-1 text-[12px] text-muted">{pillar.services.length} services</span>
      </div>

      {wide ? (
        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start">
          <div>{visual}</div>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {shown.map((s) => (
              <li key={s.slug} className="border-t border-line pt-3.5">
                <Link href={`/services/${s.slug}`} prefetch={false} className="group/s block">
                  <p className="ui text-[15px] font-bold leading-snug text-ink transition-colors group-hover/s:text-accent">
                    {s.name}
                    <span className="ml-1.5 inline-block opacity-0 transition-[opacity,transform] duration-200 group-hover/s:translate-x-0.5 group-hover/s:opacity-100" aria-hidden="true">
                      →
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="mt-6">{visual}</div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {shown.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} prefetch={false} className="block transition-transform duration-200 hover:-translate-y-0.5">
                  <Chip className="hover:border-accent hover:text-accent">{s.name}</Chip>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-auto pt-7">
        <Link
          href={`/services#pillar-${pillar.id}`}
          className="ui inline-flex items-center gap-2 text-[14px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
        >
          {hidden > 0 ? `All ${pillar.services.length} ${pillar.name.toLowerCase()} services` : `See ${pillar.name.toLowerCase()} services`}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/* ---------- visuals: illustrative, drawn in code, no stock imagery ---------- */

/** What every build ships with, under the mock — it fills the column beside the service list. */
const BUILD_INCLUDES = [
  { k: "Staging", v: "A password-protected link on your domain, from day one" },
  { k: "QA", v: "A checklist signed off before anything reaches your client" },
  { k: "Handover", v: "A document your client can read, and the repo if you want it" },
];

function BuildVisual() {
  return (
    <div>
      <Mocks />
      <dl className="mt-8 space-y-3">
        {BUILD_INCLUDES.map((i) => (
          <div key={i.k} className="grid grid-cols-[76px_1fr] gap-3 border-t border-line pt-3">
            <dt className="mono text-[11px] uppercase tracking-[0.08em] text-accent">{i.k}</dt>
            <dd className="text-[13px] leading-snug text-muted">{i.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Mocks() {
  return (
    <div className="relative h-[210px]" aria-hidden="true">
      {[
        { l: "0%", t: "16%", w: "76%", z: 1, label: "harbour-dental.co.uk" },
        { l: "14%", t: "4%", w: "76%", z: 2, label: "northwind-store.com" },
        { l: "28%", t: "30%", w: "72%", z: 3, label: "app.northwind.io" },
      ].map((f) => (
        <div key={f.label} className="absolute overflow-hidden rounded-lg border border-line bg-surface shadow-soft" style={{ left: f.l, top: f.t, width: f.w, zIndex: f.z }}>
          <div className="flex items-center gap-1.5 border-b border-line bg-raised px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            <span className="h-1.5 w-1.5 rounded-full bg-line-strong" />
            <span className="mono ml-2 truncate text-[9px] text-muted">{f.label}</span>
          </div>
          <div className="space-y-1.5 p-3">
            <span className="block h-2.5 w-3/5 rounded bg-ink/80" />
            <span className="block h-1.5 w-4/5 rounded bg-raised" />
            <span className="block h-1.5 w-2/3 rounded bg-raised" />
            <span className="mt-2 block h-5 w-16 rounded bg-accent/85" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AutomateVisual() {
  const nodes = ["Form", "Claude", "CRM", "Report"];
  return (
    <div className="draw relative" aria-hidden="true">
      <svg viewBox="0 0 300 300" className="h-auto w-full max-w-[300px]">
        <path d="M40 24 V276" className="stroke-line" strokeWidth="1" fill="none" pathLength={1} />
        <path d="M40 24 V276" className="stroke-accent draw-path" strokeWidth="2" fill="none" strokeLinecap="round" pathLength={1} />
        {nodes.map((n, i) => {
          const y = 24 + i * 84;
          return (
            <g key={n}>
              <circle cx="40" cy={y} r="17" className="fill-surface stroke-accent" strokeWidth="1.5" />
              <circle cx="40" cy={y} r="5" className="fill-accent" />
              <text x="72" y={y + 5} className="fill-ink" fontSize="15" fontWeight="600" fontFamily="var(--font-ui)">
                {n}
              </text>
              {i < nodes.length - 1 ? (
                <text x="72" y={y + 46} className="fill-muted" fontSize="12" fontFamily="var(--font-data)">
                  {["qualify the lead", "enrich and route", "weekly summary"][i]}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function GrowVisual() {
  return (
    <div className="draw relative rounded-lg border border-line bg-surface p-3" aria-hidden="true">
      <div className="mono flex items-center justify-between text-[10px] uppercase tracking-[0.08em] text-muted">
        <span>Organic clicks</span>
        <span className="text-accent">↑ trend</span>
      </div>
      <svg viewBox="0 0 300 90" className="mt-2 h-auto w-full">
        <path d="M0 78 C40 76 60 66 90 62 S150 56 180 40 S240 22 300 10" className="stroke-accent draw-path" strokeWidth="2.5" fill="none" strokeLinecap="round" pathLength={1} />
        <path d="M0 78 C40 76 60 66 90 62 S150 56 180 40 S240 22 300 10 V90 H0 Z" className="fill-accent/10" />
      </svg>
    </div>
  );
}

function SupportVisual() {
  return (
    <ul className="mono grid gap-1.5 rounded-lg border border-line bg-surface p-3 text-[11px]" aria-hidden="true">
      {[
        ["Uptime", "monitored · alert in 60s"],
        ["Backups", "nightly · restore rehearsed"],
        ["Updates", "core, plugins, PHP · staged first"],
        ["Security", "hardened · malware scan"],
      ].map(([k, v]) => (
        <li key={k} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-ink">{k}</span>
          <span className="text-muted">{v}</span>
        </li>
      ))}
    </ul>
  );
}
