import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { site, cta } from "@/content/site";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { forCopy } from "@/content/copy/for";
import { midSentence } from "@/lib/utils";

export async function generateStaticParams() {
  const types = await cms.getAgencyTypes();
  return types.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const type = await cms.getAgencyType(slug);
  if (!type) return {};
  return {
    title: `White-label for ${midSentence(type.name)}`,
    description: type.seo,
    alternates: { canonical: `/for/${slug}` },
    openGraph: { title: `For ${midSentence(type.name)} · SoftVolt AI`, description: type.seo, url: `${site.url}/for/${slug}` },
  };
}

export default async function AgencyTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = await cms.getAgencyType(slug);
  if (!type) notFound();
  const [promises, process] = await Promise.all([cms.getPromises(), cms.getProcess()]);
  const scope = process.find((p) => p.id === "scope");
  const noContact = promises.find((p) => p.id === "no-contact");

  return (
    <>
      <PageHero
        crumbs={[
          { name: "For agencies", href: "/for" },
          { name: type.name, href: `/for/${slug}` },
        ]}
        eyebrow="Who we help"
        title={`For ${midSentence(type.name)}`}
        lede={type.intro}
        highlights={[
          { label: "Services that fit", value: type.serviceItems.slice(0, 2).map((s) => s.name).join(" · ") },
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
          ...(noContact ? [{ label: "Commitment", value: noContact.label }] : []),
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href={cta.primary.href}>{cta.primary.label}</Button>
          <Button href={cta.secondary.href} variant="secondary">
            {cta.secondary.label}
          </Button>
        </div>
      </PageHero>

      <PageIntro
        eyebrow="At a glance"
        title={`What ${midSentence(type.name)} hand over.`}
        subtitle={type.relief}
        body={[
          <>
            {type.problem} That is the part we take. The brief comes to a named producer, goes back to you as a written scope with a fixed price
            {scope ? ` ${scope.turnaround.toLowerCase()}` : ""}, and the build runs under your agency&apos;s name from the staging link to the handover.
          </>,
          <>
            The services that fit this kind of agency most often are {type.serviceItems.slice(0, 4).map((s) => midSentence(s.name)).join(", ")} — but the
            list below is the full set, and a brief can mix them. {noContact ? `${noContact.label}: ${noContact.detail}` : ""}
          </>,
        ]}
        points={[
          { title: "The blocker", text: type.problem },
          { title: "What changes", text: type.relief },
          ...(scope ? [{ title: scope.name, text: `${scope.turnaround} — ${scope.artefact}` }] : []),
          ...(noContact ? [{ title: noContact.label, text: noContact.detail }] : []),
        ]}
        jump={[
          { label: "The problem", href: "#problem" },
          { label: "How it runs", href: "#workflow" },
          { label: "Services that fit", href: "#services-for" },
          { label: "What you get in writing", href: "#promises" },
        ]}
      />

      <section id="problem" className="container-x grid gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-12" aria-labelledby="problem-title">
        <div className="lg:col-span-5" data-reveal>
          <span className="eyebrow">The problem</span>
          <h2 id="problem-title" className="display display-md mt-4">
            {type.problem}
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
          <span className="eyebrow">What changes</span>
          <p className="display display-md mt-4 text-accent">{type.relief}</p>
        </div>
      </section>

      <section id="workflow" className="er relative overflow-hidden" aria-labelledby="workflow-title">
        <div className="glow -left-24 -bottom-24 h-[420px] w-[420px]" aria-hidden="true" />
        <div className="container-x relative py-14 md:py-20">
          <span className="eyebrow">How the engagement runs</span>
          <h2 id="workflow-title" className="display display-md mt-4 max-w-[22ch]">
            Four steps, each one written down.
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {type.workflow.map((w, i) => (
              <li key={w} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="card p-6">
                <span className="mono text-[12px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-[15px] leading-relaxed text-er-ink">{w}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="services-for" className="container-x py-14 md:py-20" aria-labelledby="services-for-title">
        <span className="eyebrow">Services that fit</span>
        <h2 id="services-for-title" className="display display-md mt-4">
          What {midSentence(type.name)} usually send us.
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {type.serviceItems.map((s, i) => (
            <li key={s.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}>
              <Link href={`/services/${s.slug}`} prefetch={false} className="card card-lift shadow-soft flex h-full flex-col p-6">
                <span className="eyebrow">{s.pillar}</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{s.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="promises" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="promises-title">
        <span className="eyebrow">On every project</span>
        <h2 id="promises-title" className="display display-md mt-4">
          The commitments.
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {promises.map((p) => (
            <li key={p.id} className="card p-5">
              <p className="text-[15px] font-semibold leading-snug text-ink">{p.label}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-muted">{p.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* the closing band's words live on the Agency Solutions page in WordPress */}
      <CtaBand copy={(await getCopy(forCopy)).detail_cta} />
    </>
  );
}
