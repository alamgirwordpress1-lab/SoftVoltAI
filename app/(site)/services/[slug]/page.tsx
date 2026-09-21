import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { Rich } from "@/components/ui/Rich";
import { getSiteChrome } from "@/lib/cms/site";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { servicesCopy } from "@/content/copy/services";
import { midSentence } from "@/lib/utils";

export async function generateStaticParams() {
  const services = await cms.getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await cms.getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.seo,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title: `${service.title} · SoftVolt AI`, description: service.seo, url: `${site.url}/services/${slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await cms.getService(slug);
  if (!service) notFound();
  const [process, chrome] = await Promise.all([cms.getProcess(), getSiteChrome()]);
  const scope = process.find((p) => p.id === "scope");
  // the words are the "Every service page" tabs on the Services page in WordPress
  const copy = await getCopy(servicesCopy, {
    service: service.name,
    pillar: service.pillarGroup.name,
    deliverables: String(service.deliverables.length),
    tools: service.stack.join(", "),
    often_for: service.agencies.length ? `It is the brief we see most often from ${service.agencies.map((a) => midSentence(a.name)).join(", ")}. ` : "",
  });
  const top = copy.detail_top;
  const band = copy.detail_sections;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.seo,
          serviceType: service.name,
          provider: { "@id": `${site.url}/#organization` },
          areaServed: site.markets.map((name) => ({ "@type": "Country", name })),
          url: `${site.url}/services/${slug}`,
        }}
      />

      <PageHero
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${slug}` },
        ]}
        eyebrow={top.eyebrow}
        title={service.title}
        lede={service.intro}
        highlights={[
          { label: top.fact_tools, value: service.stack.slice(0, 3).join(" · ") },
          ...(service.agencies[0] ? [{ label: top.fact_best_for, value: service.agencies[0].name }] : []),
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href={chrome.cta.primary.href}>{chrome.cta.primary.label}</Button>
          <Button href={chrome.cta.secondary.href} variant="secondary">
            {chrome.cta.secondary.label}
          </Button>
        </div>
      </PageHero>

      <PageIntro
        eyebrow={top.intro_eyebrow}
        title={top.intro_heading}
        subtitle={service.pillarGroup.tagline}
        body={[<Rich key="p1" text={top.intro_p1} />, <Rich key="p2" text={top.intro_p2} />]}
        points={[
          { title: top.point_pillar, text: `${service.pillarGroup.name} — ${service.pillarGroup.tagline}` },
          { title: top.point_tools, text: service.stack.join(" · ") },
          ...(service.agencies[0] ? [{ title: top.point_often, text: service.agencies[0].name }] : []),
          ...(scope ? [{ title: scope.name, text: `${scope.turnaround} — ${scope.artefact}` }] : []),
        ]}
        jump={[
          { label: top.jump_ships, href: "#deliverables" },
          { label: top.jump_signals, href: "#signals" },
          ...(service.agencies.length ? [{ label: top.jump_who, href: "#who-for" }] : []),
          { label: top.jump_related, href: "#related" },
        ]}
      />

      <section id="deliverables" className="container-x grid gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-12" aria-labelledby="deliverables-title">
        <div className="lg:col-span-4" data-reveal>
          <span className="eyebrow">{band.ships_eyebrow}</span>
          <h2 id="deliverables-title" className="display display-md mt-4">
            {band.ships_heading}
          </h2>
          {band.ships_text ? <p className="mt-4 text-[15px] leading-relaxed text-muted">{band.ships_text}</p> : null}
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {service.deliverables.map((d, i) => (
            <li key={d} data-reveal style={{ ["--reveal-delay" as string]: `${i * 50}ms` }} className="card shadow-soft flex gap-3 p-5">
              <span className="mono mt-0.5 text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] leading-relaxed text-ink">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="signals" className="er relative overflow-hidden" aria-labelledby="signals-title">
        <div className="glow -right-20 -top-20 h-[420px] w-[420px]" aria-hidden="true" />
        <div className="container-x relative grid gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">{band.signals_eyebrow}</span>
            <h2 id="signals-title" className="display display-md mt-4">
              {band.signals_heading}
            </h2>
            <ul className="mt-6 space-y-3">
              {service.signals.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-er-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            <span className="eyebrow">{band.runs_eyebrow}</span>
            <ol className="mt-6 space-y-4">
              {process.map((step, i) => (
                <li key={step.id} className="grid grid-cols-[40px_1fr] gap-3 border-t border-er-line pt-4">
                  <span className="mono text-[12px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-semibold text-er-ink">{step.name}</p>
                    <p className="mono mt-0.5 text-[11px] uppercase tracking-[0.08em] text-er-muted">{step.turnaround}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <span className="eyebrow">{band.tools_eyebrow}</span>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.stack.map((t) => (
                  <li key={t}>
                    <Chip tone="dark">{t}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {service.agencies.length ? (
        <section id="who-for" className="container-x py-14 md:py-20" aria-labelledby="for-title">
          <span className="eyebrow">{band.who_eyebrow}</span>
          <h2 id="for-title" className="display display-md mt-4">
            {band.who_heading}
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {service.agencies.map((a, i) => (
              <li key={a.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                <Link href={`/for/${a.slug}`} className="card card-lift shadow-soft group flex h-full flex-col p-6">
                  <h3 className="text-lg font-semibold text-ink">{a.name}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{a.relief}</p>
                  {band.who_link ? <span className="mono mt-auto pt-5 text-[11px] uppercase tracking-[0.1em] text-accent">{band.who_link}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="related" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="related-title">
        <span className="eyebrow">{band.related_eyebrow}</span>
        <h2 id="related-title" className="display display-md mt-4">
          {band.related_heading}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.related.map((r) => (
            <li key={r.slug}>
              <Link href={`/services/${r.slug}`} className="card card-lift shadow-soft flex h-full flex-col p-5">
                <h3 className="font-semibold text-ink">{r.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{r.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* the closing band's words live on the Services page in WordPress, one set for every service */}
      <CtaBand copy={copy.detail_cta} />
    </>
  );
}
