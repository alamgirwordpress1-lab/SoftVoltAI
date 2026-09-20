import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { CaseByMarketAndStack, CaseByType, CaseSpotlight } from "@/components/sections/CaseAngles";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Case studies — builds you can open",
  description: "Eight live builds you can open: headless WordPress on Next.js, WooCommerce stores and technical-SEO sites, read by type, market and stack.",
  alternates: { canonical: "/case-studies" },
};

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

      <PageIntro
        eyebrow="How to read these"
        title="Eight builds, four ways in."
        subtitle="Every one is live, public and linked — open them before you read a word we wrote."
        body={[
          <>
            Most agency portfolios are a wall of logos. This page is the opposite: {work.length} finished websites, each with the brief it answered, the
            stack it was built on and a link to the running site. They were delivered for clients in {regions.join(", ")} — WooCommerce stores, headless
            WordPress front ends on Next.js, and corporate sites where the forms have to work every day.
          </>,
          <>
            Read them the way that matches your brief. Start with the spotlight, browse by the kind of work, check the market and the stack, or filter the
            full set at the bottom. Whichever way you come in, the facts are the same ones — nothing on this page is an outcome we cannot show you.
          </>,
        ]}
        points={[
          { title: "Delivered, not pitched", text: "Each build shipped and is still live. The links go to the real site, not a screenshot." },
          { title: "Named honestly", text: "These are our founder's builds at a UK agency, said plainly on every card." },
          { title: "Your name on the next one", text: "Partner work only appears with written permission — and under your agency's brand." },
          { title: "Same team, same hours", text: "The people who built these are the ones who take your brief, on UK and US hours." },
        ]}
        jump={[
          { label: "Spotlight", href: "#spotlight" },
          { label: "By what we built", href: "#by-type" },
          { label: "By market and stack", href: "#by-market" },
          { label: "Every build", href: "#work" },
          { label: "How we publish", href: "#format" },
        ]}
      />

      {spotlight ? <CaseSpotlight item={spotlight} /> : null}

      <CaseByType items={work} categories={categories} />

      <CaseByMarketAndStack items={work} />

      <WorkGrid
        items={work}
        categories={categories}
        eyebrow="Every build"
        title="All eight, filtered the way you work."
        lede="The full set, in one grid. Filter by the kind of build, open the live site from the card, or read the case study behind it."
        aside={null}
      />

      <section id="format" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="format-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">The format</span>
            <h2 id="format-title" className="display display-md mt-4">
              Anonymised at the partner&apos;s request. Verified outcomes only.
            </h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-muted lg:col-span-6 lg:col-start-7 md:text-base" data-reveal>
            <p>
              As partner projects launch, their case studies appear here in a fixed shape: the kind of agency and where it is, the brief as it arrived, the
              stack, what shipped, and the outcome we can prove — a Lighthouse score before and after, a checkout error rate, a migration with no lost URLs.
            </p>
            <p className="text-ink">
              Never a business metric we cannot see, never a client name without the agency&apos;s written permission, and never a logo we have not earned.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
