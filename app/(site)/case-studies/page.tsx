import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Case studies — builds you can open",
  description:
    "Case studies from builds delivered by the SoftVolt AI founder as developer and team lead at a UK agency: headless WordPress + Next.js, WooCommerce stores and technical-SEO-first sites.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const [work, categories] = await Promise.all([cms.getWork(), cms.getWorkCategories()]);
  const regions = [...new Set(work.map((w) => w.region))];
  const toolCount = new Map<string, number>();
  for (const tool of work.flatMap((w) => w.stack)) toolCount.set(tool, (toolCount.get(tool) ?? 0) + 1);
  const topTools = [...toolCount].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([tool]) => tool);
  return (
    <>
      <PageHero
        crumbs={[{ name: "Case studies", href: "/case-studies" }]}
        eyebrow="Case studies"
        title="Builds you can open, not logos you have to trust."
        lede="White-label means partner work is never shown without written permission — and when it is, it carries your name. What we can show are builds our founder delivered as developer, project manager and team lead at a UK agency."
        highlights={[
          { label: "Case studies", value: `${work.length} builds you can open` },
          { label: "Delivered in", value: regions.join(" · ") },
          { label: "Most used", value: topTools.join(" · ") },
        ]}
      />

      <WorkGrid items={work} categories={categories} showHeading={false} />

      <section className="container-x border-t border-line py-14 md:py-20" aria-labelledby="format-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">The format</span>
            <h2 id="format-title" className="display display-md mt-4">
              Anonymised at the partner&apos;s request. Verified outcomes only.
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted lg:col-span-6 lg:col-start-7 md:text-base" data-reveal>
            <p>
              As partner projects launch, their case studies appear here in a fixed shape: the kind of agency and where it is, the
              brief as it arrived, the stack, what shipped, and the outcome we can prove — a Lighthouse score before and after, a
              checkout error rate, a migration with no lost URLs.
            </p>
            <p className="text-ink">
              Never a business metric we cannot see, never a client name without the agency&apos;s written permission, and never a
              logo we have not earned.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
