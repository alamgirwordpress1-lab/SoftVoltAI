import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CtaBand } from "@/components/sections/CtaBand";
import { site, cta } from "@/content/site";
import { cms } from "@/lib/cms";

export async function generateStaticParams() {
  const work = await cms.getWork();
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await cms.getWorkItem(slug);
  if (!item) return {};
  const head = `${item.title} — ${item.category} build for a ${item.client.toLowerCase()} in ${item.region}. `;
  // meta descriptions are cut off past about 160 characters, so the summary fills whatever is left
  const description = (head + item.summary).slice(0, 157).replace(/[\s,;:—-]+$/, "") + "…";
  return {
    title: `${item.title} — case study`,
    description,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: { title: `${item.title} · SoftVolt AI case study`, description, url: `${site.url}/case-studies/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await cms.getWorkItem(slug);
  if (!item) notFound();
  const process = await cms.getProcess();

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Case studies", href: "/case-studies" },
          { name: item.title, href: `/case-studies/${slug}` },
        ]}
        eyebrow={item.category}
        title={item.title}
        lede={item.summary}
        highlights={[
          { label: "Client", value: item.client },
          { label: "Region", value: item.region },
          { label: "Stack", value: item.stack.slice(0, 3).join(" · ") },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          {item.url ? (
            <Button href={item.url} target="_blank" rel="noopener noreferrer">
              Open the live site <span aria-hidden="true">↗</span>
            </Button>
          ) : null}
          <Button href={cta.primary.href} variant="secondary">
            {cta.primary.label}
          </Button>
        </div>
      </PageHero>

      {item.image ? (
        <section className="container-x pb-14 md:pb-20" aria-label={`${item.title} screenshot`}>
          <div className="card shadow-float overflow-hidden" data-reveal>
            <div className="stage-chrome">
              <i /> <i /> <i />
              <span className="url">{item.url?.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
            </div>
            <div className="relative aspect-[16/10] bg-raised">
              <Image src={item.image} alt={`${item.title} — homepage`} fill sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover object-top" priority />
            </div>
          </div>
        </section>
      ) : null}

      <PageIntro
        eyebrow="At a glance"
        title={`${item.category} for a ${item.client.toLowerCase()}.`}
        subtitle={item.role}
        body={[
          <>
            This one is on the site because it can be checked. It was delivered for a {item.client.toLowerCase()} in {item.region}, our founder&apos;s part
            in it was {item.role.toLowerCase()}, and everything claimed below is either visible in the running site or in the code behind it.
          </>,
          <>
            {item.delivered.length} things shipped in this build, listed in full below. It was made with {item.stack.join(", ")} for a client in{" "}
            {item.region}
            {item.url ? ", and the site is still live — open it and check the claims against the real thing." : "."}
          </>,
        ]}
        points={[
          { title: "Client", text: item.client },
          { title: "Market", text: item.region },
          { title: "Our role", text: item.role },
          { title: "Built with", text: item.stack.join(" · ") },
        ]}
        jump={[
          { label: "What shipped", href: "#delivered" },
          { label: "As a partner brief", href: "#as-partner" },
          { label: "Related builds", href: "#related" },
        ]}
      />

      <section id="delivered" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="delivered-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4" data-reveal>
            <span className="eyebrow">What shipped</span>
            <h2 id="delivered-title" className="display display-md mt-4">
              The work, in plain terms.
            </h2>
            <dl className="mt-8 space-y-5 text-[15px]">
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Client</dt>
                <dd className="mt-1 text-ink">
                  {item.client} · {item.region}
                </dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Role</dt>
                <dd className="mt-1 text-ink">{item.role}</dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {item.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {item.delivered.map((d, i) => (
              <li key={d} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="card shadow-soft flex gap-3 p-5">
                <span className="mono mt-0.5 text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] leading-relaxed text-ink">{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mono mt-10 max-w-[70ch] text-[12px] leading-relaxed text-muted" data-reveal>
          No traffic, revenue or ranking figures are published here. We only publish numbers we can show you — a Lighthouse run, a
          Search Console export, an error rate — and for this project we do not hold them.
        </p>
      </section>

      <section id="as-partner" className="er relative overflow-hidden" aria-labelledby="as-partner-title">
        <div className="grid-lines" aria-hidden="true" />
        <div className="container-x relative grid gap-10 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">If this were your brief</span>
            <h2 id="as-partner-title" className="display display-md mt-4">
              The same build, delivered under your brand.
            </h2>
            <p className="lede mt-5">
              As a white-label project this runs through the same five steps, with your agency on the staging URL, the commits and
              the handover — and our name nowhere.
            </p>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
            {process.map((step, i) => (
              <li key={step.id} className="grid grid-cols-[42px_1fr] gap-3 border-t border-er-line py-4 first:border-t-0 first:pt-0">
                <span className="mono text-[12px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="ui font-bold text-er-ink">{step.name}</p>
                  <p className="mono mt-0.5 text-[11px] uppercase tracking-[0.08em] text-er-muted">{step.turnaround}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="related" className="container-x py-14 md:py-20" aria-labelledby="related-title">
        <span className="eyebrow">More work</span>
        <h2 id="related-title" className="display display-md mt-4">
          Related builds.
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {item.related.map((r, i) => (
            <li key={r.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link href={`/case-studies/${r.slug}`} className="card card-lift shadow-soft flex h-full flex-col overflow-hidden">
                {r.image ? (
                  <span className="relative block aspect-[16/10] border-b border-line bg-raised">
                    <Image src={r.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-top" />
                  </span>
                ) : null}
                <span className="flex flex-1 flex-col p-5">
                  <span className="eyebrow">{r.category}</span>
                  <span className="ui mt-2 text-lg font-bold text-ink">{r.title}</span>
                  <span className="mono mt-1 text-[11px] uppercase tracking-[0.08em] text-muted">
                    {r.client} · {r.region}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title="Send the brief —" accent="get a fixed price within two business days." />
    </>
  );
}
