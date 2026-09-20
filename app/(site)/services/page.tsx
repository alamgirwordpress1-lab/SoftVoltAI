import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services — build, automate, grow, support",
  description: "Every white-label service for agencies: WordPress, WooCommerce, headless Next.js, Shopify, Webflow, AI automation, SEO, ads and maintenance.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const pillars = await cms.getPillars();
  const count = (ids: string[]) => pillars.filter((p) => ids.includes(p.id)).reduce((n, p) => n + p.services.length, 0);
  const total = pillars.reduce((n, p) => n + p.services.length, 0);
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", href: "/services" }]}
        eyebrow="Services"
        title="Four pillars. One partner. Your brand on everything."
        lede="Every service is delivered under your agency's name with a written scope, a named producer and a fixed price. Pick the one that matches the brief, or send the brief and let the scope tell you."
        highlights={[
          { label: "Build", value: `${count(["build"])} services` },
          { label: "Automate", value: `${count(["automate"])} services` },
          { label: "Grow & Support", value: `${count(["grow", "support"])} services` },
        ]}
      />

      <PageIntro
        eyebrow="What we cover"
        title={`${total} services, one white-label contract.`}
        subtitle="One partner for the build, the automation, the traffic and the upkeep — under your agency's name, start to finish."
        body={[
          <>
            Agencies come to us with one of four problems: a build they cannot staff, a manual process eating the team&apos;s week, traffic that has stalled,
            or a live site nobody is looking after. Each pillar below answers one of those. Inside them sit the specifics — WordPress and WooCommerce,
            headless front ends on Next.js with Payload or Sanity, Shopify and Webflow, AI automation and internal tools, technical and local SEO, Google and
            Meta ads, maintenance, migration and rescue.
          </>,
          <>
            Every service is scoped in writing before anything starts, carries a fixed price and a named producer, and ships under your brand. Your client
            never sees us, and your team keeps the relationship, the strategy and the invoice.
          </>,
        ]}
        points={[
          { title: "Written scope first", text: "Line-by-line, priced, agreed before a single commit." },
          { title: "One producer", text: "A named person answers on your hours, not a ticket queue." },
          { title: "Your brand throughout", text: "Staging URLs, documents and handover all carry your name." },
          { title: "Defects on us", text: "Anything that breaks against the agreed scope is fixed at our cost." },
        ]}
        jump={pillars.map((p) => ({ label: p.name, href: `#pillar-${p.id}` }))}
      />

      {pillars.map((p, i) => (
        <section key={p.id} id={`pillar-${p.id}`} className="container-x border-t border-line py-14 md:py-20" aria-labelledby={`pillar-title-${p.id}`}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <span className="eyebrow">
                {String(i + 1).padStart(2, "0")} · {p.name}
              </span>
              <h2 id={`pillar-title-${p.id}`} className="display display-md mt-4">
                {p.tagline}
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {p.services.map((s, j) => (
                <li key={s.slug} data-reveal style={{ ["--reveal-delay" as string]: `${j * 50}ms` }}>
                  <Link href={`/services/${s.slug}`} className="card card-lift shadow-soft group flex h-full flex-col p-6">
                    <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{s.name}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.summary}</p>
                    <span className="mono mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] uppercase tracking-[0.1em] text-accent">
                      Read more <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
