import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { CaseByMarketAndStack, CaseByType, CaseSpotlight } from "@/components/sections/CaseAngles";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { caseStudiesCopy } from "@/content/copy/case-studies";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { countWord } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(caseStudiesCopy);
}

export default async function CaseStudiesPage() {
  const [work, categories] = await Promise.all([cms.getWork(), cms.getWorkCategories()]);
  const regions = [...new Set(work.map((w) => w.region))];
  const toolCount = new Map<string, number>();
  for (const tool of work.flatMap((w) => w.stack)) toolCount.set(tool, (toolCount.get(tool) ?? 0) + 1);
  const topTools = [...toolCount]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tool]) => tool);
  const spotlight = work[0];
  // the words are the WordPress page "Case Studies"; {count} and {regions} come from the builds
  const copy = await getCopy(caseStudiesCopy, { count: countWord(work.length), regions: regions.join(", ") });

  return (
    <>
      <PageHero
        crumbs={[{ name: "Case studies", href: "/case-studies" }]}
        {...bannerProps(copy.banner, [
          { label: "Case studies", value: `${work.length} builds you can open` },
          { label: "Delivered in", value: regions.join(" · ") },
          { label: "Most used", value: topTools.join(" · ") },
        ])}
      />

      <PageIntro {...introProps(copy.intro)} />

      {spotlight ? <CaseSpotlight item={spotlight} copy={copy.spotlight} /> : null}

      <CaseByType items={work} categories={categories} copy={copy.by_type} />

      <CaseByMarketAndStack items={work} copy={copy.by_market} />

      <WorkGrid items={work} categories={categories} copy={copy.work} />

      <section id="format" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="format-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">{copy.format.eyebrow}</span>
            <h2 id="format-title" className="display display-md mt-4">
              {copy.format.heading}
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted lg:col-span-6 lg:col-start-7 md:text-base" data-reveal>
            <p>{copy.format.paragraph}</p>
            {copy.format.closing ? <p className="text-ink">{copy.format.closing}</p> : null}
          </div>
        </div>
      </section>

      <CtaBand copy={copy.cta} />
    </>
  );
}
