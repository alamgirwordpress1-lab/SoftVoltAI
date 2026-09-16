import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { site, cta } from "@/content/site";
import { cms } from "@/lib/cms";

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
  const process = await cms.getProcess();
  const scope = process.find((p) => p.id === "scope");

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
        eyebrow={`${service.pillarGroup.name} · white-label`}
        title={service.title}
        lede={service.intro}
        highlights={[
          { label: "Tooling", value: service.stack.slice(0, 3).join(" · ") },
          ...(service.agencies[0] ? [{ label: "Best for", value: service.agencies[0].name }] : []),
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href={cta.primary.href}>{cta.primary.label}</Button>
          <Button href={cta.secondary.href} variant="secondary">
            {cta.secondary.label}
          </Button>
        </div>
      </PageHero>

      <section className="container-x grid gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-12" aria-labelledby="deliverables-title">
        <div className="lg:col-span-4" data-reveal>
          <span className="eyebrow">What ships</span>
          <h2 id="deliverables-title" className="display display-md mt-4">
            What you get, written into the scope.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">Every item here appears in the scope document with a price against it. Nothing starts until you approve it.</p>
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

      <section className="er relative overflow-hidden" aria-labelledby="signals-title">
        <div className="glow -right-20 -top-20 h-[420px] w-[420px]" aria-hidden="true" />
        <div className="container-x relative grid gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">When to send this brief</span>
            <h2 id="signals-title" className="display display-md mt-4">
              You will recognise the moment.
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
            <span className="eyebrow">How it runs</span>
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
              <span className="eyebrow">Tooling</span>
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
        <section className="container-x py-14 md:py-20" aria-labelledby="for-title">
          <span className="eyebrow">Built for</span>
          <h2 id="for-title" className="display display-md mt-4">
            Agencies that send this brief most often.
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {service.agencies.map((a, i) => (
              <li key={a.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                <Link href={`/for/${a.slug}`} className="card card-lift shadow-soft group flex h-full flex-col p-6">
                  <h3 className="text-lg font-semibold text-ink">{a.name}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{a.relief}</p>
                  <span className="mono mt-auto pt-5 text-[11px] uppercase tracking-[0.1em] text-accent">How we work with you →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="container-x border-t border-line py-14 md:py-20" aria-labelledby="related-title">
        <span className="eyebrow">Also in {service.pillarGroup.name}</span>
        <h2 id="related-title" className="display display-md mt-4">
          Related services.
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

      <CtaBand
        title="Send the brief —"
        accent="get a fixed price within two business days."
        lede={`Tell us what the ${service.name} project needs and when. Client names can wait until the NDA is signed; a named producer replies within one business day.`}
      />
    </>
  );
}
