import type { Metadata } from "next";
import { ScreenshotPan } from "@/components/ui/ScreenshotPan";
import { LiveVisit } from "@/components/ui/LiveVisit";
import Link from "@/components/ui/Link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CtaBand } from "@/components/sections/CtaBand";
import { shareMetadata } from "@/lib/seo/share";
import { getSiteChrome } from "@/lib/cms/site";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { caseStudiesCopy } from "@/content/copy/case-studies";
import { midSentence } from "@/lib/utils";

export async function generateStaticParams() {
  const work = await cms.getWork();
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await cms.getWorkItem(slug);
  if (!item) return {};
  const head = `${item.title} — ${item.category} build for a ${midSentence(item.client)} in ${item.region}. `;
  // meta descriptions are cut off past about 155 characters, so the summary fills whatever is left (150 + the ellipsis)
  const description = (head + item.summary).slice(0, 150).replace(/[\s,;:—-]+$/, "") + "…";
  const { detail_top: top } = await getCopy(caseStudiesCopy, { title: item.title });
  // a descriptive case study name already carries the keywords; the " — case study · SoftVolt AI" tail would push it past ~65 characters
  return {
    title: item.title.length > 40 ? { absolute: item.title } : top.seo_title,
    description,
    alternates: { canonical: `/case-studies/${slug}` },
    ...shareMetadata({ title: `${item.title} · SoftVolt AI case study`, description, path: `/case-studies/${slug}` }),
  };
}

/**
 * One case study: the banner, then the story of the build — how it was done,
 * what made it complex and how that was solved, how it was completed — and the
 * client's review last. No screenshot: the words carry the page.
 */
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await cms.getWorkItem(slug);
  if (!item) notFound();
  const chrome = await getSiteChrome();
  // the words are the "Every case study page" tabs on the Case Studies page in WordPress
  const copy = await getCopy(caseStudiesCopy, {
    title: item.title,
    category: item.category,
    // mid-sentence casing keeps "UK" and brand names upright: "a UK aggregates supplier"
    client: midSentence(item.client),
    region: item.region,
    role: midSentence(item.role),
    stack: item.stack.join(", "),
  });
  const top = copy.detail_top;
  const band = copy.detail_sections;
  const { story } = item;
  // a case study with nothing written yet still opens with its summary
  const overview = story.overview.length ? story.overview : [item.summary];

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
          { label: top.fact_client, value: item.client },
          { label: top.fact_region, value: item.region },
          ...(item.stack.length ? [{ label: top.fact_stack, value: item.stack.slice(0, 3).join(" · ") }] : []),
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          {item.url ? <LiveVisit url={item.url} title={item.title} image={item.image} variant="button" /> : null}
          {item.url && top.live_button ? (
            <Button href={item.url} target="_blank" rel="noopener noreferrer" variant="secondary">
              {top.live_button}
            </Button>
          ) : null}
          <Button href={chrome.cta.primary.href} variant="secondary">
            {chrome.cta.primary.label}
          </Button>
        </div>
        {!item.url && top.private_note ? <p className="mono mt-5 max-w-[56ch] text-[12px] leading-relaxed text-muted">{top.private_note}</p> : null}
      </PageHero>

      {/* how the project was done */}
      <section id="overview" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="overview-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start" data-reveal>
            <span className="eyebrow">{band.overview_eyebrow}</span>
            <h2 id="overview-title" className="display display-md mt-4">
              {band.overview_heading}
            </h2>
            <dl className="mt-8 space-y-5 text-[15px]">
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{band.label_client}</dt>
                <dd className="mt-1 text-ink">{item.client}</dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{band.label_market}</dt>
                <dd className="mt-1 text-ink">{item.region}</dd>
              </div>
              {item.role ? (
                <div>
                  <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{band.label_role}</dt>
                  <dd className="mt-1 text-ink">{item.role}</dd>
                </div>
              ) : null}
              {item.stack.length ? (
                <div>
                  <dt className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{band.label_stack}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {item.stack.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="space-y-5 lg:col-span-7 lg:col-start-6" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            {overview.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg leading-relaxed text-ink md:text-xl" : "text-[16px] leading-relaxed text-muted md:text-[17px]"}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* what made it complex, and how it was solved */}
      {story.challenges.length ? (
        <section id="challenges" className="border-t border-line bg-raised" aria-labelledby="challenges-title">
          <div className="container-x py-14 md:py-20">
            <div className="max-w-[46rem]" data-reveal>
              <span className="eyebrow">{band.challenges_eyebrow}</span>
              <h2 id="challenges-title" className="display display-md mt-4">
                {band.challenges_heading}
              </h2>
            </div>
            <ol className="mt-10 space-y-4">
              {story.challenges.map((c, i) => (
                <li
                  key={c.problem}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
                  className="card shadow-soft grid gap-0 overflow-hidden md:grid-cols-[64px_1fr_1fr]"
                >
                  <span className="mono flex items-start px-5 pt-5 text-[13px] text-accent md:justify-center md:border-r md:border-line md:px-0 md:py-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="p-5 md:p-6">
                    <p className="mono text-[11px] uppercase tracking-[0.1em] text-muted">{band.label_problem}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink md:text-base">{c.problem}</p>
                  </div>
                  {c.solution ? (
                    <div className="border-t border-line p-5 md:border-l md:border-t-0 md:p-6">
                      <p className="mono text-[11px] uppercase tracking-[0.1em] text-accent">{band.label_solution}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink md:text-base">{c.solution}</p>
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* how it was completed */}
      <section id="outcome" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="outcome-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start" data-reveal>
            <span className="eyebrow">{band.outcome_eyebrow}</span>
            <h2 id="outcome-title" className="display display-md mt-4">
              {band.outcome_heading}
            </h2>
            {story.outcome.map((p, i) => (
              <p key={i} className="lede mt-5">
                {p}
              </p>
            ))}
          </div>

          {item.delivered.length ? (
            <div className="lg:col-span-8">
              <h3 className="mono text-[11px] uppercase tracking-[0.1em] text-muted" data-reveal>
                {band.shipped_label}
              </h3>
              <ul className="fx-spot mt-4 grid content-start gap-4 sm:grid-cols-2">
                {item.delivered.map((d, i) => (
                  <li key={d} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="card shadow-soft flex gap-3 p-5">
                    <span className="mono mt-0.5 text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[15px] leading-relaxed text-ink">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {band.delivered_note ? (
          <p className="mono mt-10 text-[12px] leading-relaxed text-muted" data-reveal>
            {band.delivered_note}
          </p>
        ) : null}
      </section>

      {/* the client's review comes last, and only when they have agreed to it being published */}
      {story.review ? (
        <section id="review" className="er relative overflow-hidden" aria-labelledby="review-title">
          <div className="grid-lines" aria-hidden="true" />
          <div className="container-x relative py-14 md:py-20">
            <span className="eyebrow">{band.review_eyebrow}</span>
            <h2 id="review-title" className="display display-md mt-4 text-er-ink">
              {band.review_heading}
            </h2>
            <figure className="mt-10 max-w-[56rem]" data-reveal>
              <blockquote className="text-xl leading-relaxed text-er-ink md:text-2xl">
                <p>“{story.review.quote}”</p>
              </blockquote>
              <figcaption className="mt-6">
                <span className="ui block font-bold text-er-ink">{story.review.name}</span>
                {story.review.role || story.review.company ? (
                  <span className="mono mt-1 block text-[11px] uppercase tracking-[0.08em] text-er-muted">
                    {[story.review.role, story.review.company].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      <section id="related" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="related-title">
        <span className="eyebrow">{band.related_eyebrow}</span>
        <h2 id="related-title" className="display display-md mt-4">
          {band.related_heading}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {item.related.map((r, i) => (
            <li key={r.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link href={`/case-studies/${r.slug}`} className="card card-lift shadow-soft flex h-full flex-col overflow-hidden">
                {r.image ? (
                  <span className="relative block aspect-[16/10] border-b border-line bg-raised">
                    <ScreenshotPan thumb={r.thumb} image={r.image} alt={`${r.title} website screenshot`} sizes="(min-width: 768px) 33vw, 100vw" />
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

      {/* the closing band's words live on the Case Studies page in WordPress */}
      <CtaBand copy={copy.detail_cta} />
    </>
  );
}
