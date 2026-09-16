import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Rates } from "@/components/sections/Rates";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Rates — simple monthly plans for agencies",
  description: "How SoftVolt AI prices white-label work for agencies: monthly plans sized by how many client projects you run in parallel, with anything outside a plan scoped and quoted in writing first.",
  alternates: { canonical: "/rates" },
};

export default async function RatesPage() {
  const [models, pricingFaqs, process] = await Promise.all([cms.getEngagementModels(), cms.getPricingFaqs(), cms.getProcess()]);
  const scope = process.find((p) => p.id === "scope");
  return (
    <>
      <PageHero
        crumbs={[{ name: "Rates", href: "/rates" }]}
        eyebrow="Rates"
        title="Simple monthly plans, priced up front."
        lede="Match your spend to your actual client workload instead of committing to a full-time salary. Pick the plan that fits how many active projects you run, and move up or down as that number changes."
        highlights={[
          { label: "Plans", value: `${models.length} monthly tiers` },
          { label: "Outside a plan", value: "Scoped and quoted in writing" },
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
        ]}
      />
      <Rates models={models} showHeading={false} />
      <div className="border-t border-line">
        <Faq faqs={pricingFaqs} />
      </div>
      <CtaBand />
    </>
  );
}
