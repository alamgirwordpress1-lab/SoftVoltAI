import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { shareMetadata } from "@/lib/seo/share";
import { Rich } from "@/components/ui/Rich";
import { getSiteChrome } from "@/lib/cms/site";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { forCopy } from "@/content/copy/for";
import { countWord, midSentence } from "@/lib/utils";

export async function generateStaticParams() {
  const types = await cms.getAgencyTypes();
  return types.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const type = await cms.getAgencyType(slug);
  if (!type) return {};
  const { detail_top: top } = await getCopy(forCopy, { agency: midSentence(type.name) });
  return {
    title: top.seo_title,
    description: type.seo,
    alternates: { canonical: `/for/${slug}` },
    ...shareMetadata({ title: `${top.seo_title} · SoftVolt AI`, description: type.seo, path: `/for/${slug}` }),
  };
}

const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export default async function AgencyTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = await cms.getAgencyType(slug);
  if (!type) notFound();
  const [promises, process, chrome] = await Promise.all([cms.getPromises(), cms.getProcess(), getSiteChrome()]);
  const scope = process.find((p) => p.id === "scope");
  const noContact = promises.find((p) => p.id === "no-contact");
  // the words are the "Every agency page" tabs on the Agency Solutions page in WordPress
  const copy = await getCopy(forCopy, {
    agency: midSentence(type.name),
    problem: type.problem,
    scope_time: scope ? scope.turnaround.toLowerCase() : "within two business days",
    top_services: type.serviceItems
      .slice(0, 4)
      .map((s) => midSentence(s.name))
      .join(", "),
    commitment: noContact ? `${noContact.label}: ${noContact.detail}` : "",
    Count: capital(countWord(type.workflow.length)),
  });
  const top = copy.detail_top;
  const band = copy.detail_sections;

  return (
    <>
      <PageHero
        crumbs={[
          { name: "For agencies", href: "/for" },
          { name: type.name, href: `/for/${slug}` },
        ]}
        eyebrow={top.eyebrow}
        title={top.heading}
        lede={type.intro}
        highlights={[
          { label: top.fact_services, value: type.serviceItems.slice(0, 2).map((s) => s.name).join(" · ") },
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
          ...(noContact ? [{ label: top.fact_commitment, value: noContact.label }] : []),
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
        subtitle={type.relief}
        body={[<Rich key="p1" text={top.intro_p1} />, <Rich key="p2" text={top.intro_p2} />]}
        points={[
          { title: top.point_problem, text: type.problem },
          { title: top.point_relief, text: type.relief },
          ...(scope ? [{ title: scope.name, text: `${scope.turnaround} — ${scope.artefact}` }] : []),
          ...(noContact ? [{ title: noContact.label, text: noContact.detail }] : []),
        ]}
        jump={[
          { label: top.jump_problem, href: "#problem" },
          { label: top.jump_workflow, href: "#workflow" },
          { label: top.jump_services, href: "#services-for" },
          { label: top.jump_promises, href: "#promises" },
        ]}
      />

      <section id="problem" className="container-x grid gap-10 border-t border-line py-14 md:py-20 lg:grid-cols-12" aria-labelledby="problem-title">
        <div className="lg:col-span-5" data-reveal>
          <span className="eyebrow">{band.problem_eyebrow}</span>
          <h2 id="problem-title" className="display display-md mt-4">
            {type.problem}
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7" data-reveal style={{ ["--reveal-delay" as string]: "100ms" }}>
          <span className="eyebrow">{band.relief_eyebrow}</span>
          <p className="display display-md mt-4 text-accent">{type.relief}</p>
        </div>
      </section>

      <section id="workflow" className="er relative overflow-hidden" aria-labelledby="workflow-title">
        <div className="glow -left-24 -bottom-24 h-[420px] w-[420px]" aria-hidden="true" />
        <div className="container-x relative py-14 md:py-20">
          <span className="eyebrow">{band.workflow_eyebrow}</span>
          <h2 id="workflow-title" className="display display-md mt-4 max-w-[22ch]">
            {band.workflow_heading}
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
        <span className="eyebrow">{band.services_eyebrow}</span>
        <h2 id="services-for-title" className="display display-md mt-4">
          {band.services_heading}
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
        <span className="eyebrow">{band.promises_eyebrow}</span>
        <h2 id="promises-title" className="display display-md mt-4">
          {band.promises_heading}
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
      <CtaBand copy={copy.detail_cta} />
    </>
  );
}
