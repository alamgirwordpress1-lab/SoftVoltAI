import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Rates } from "@/components/sections/Rates";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Rates — simple monthly plans for agencies",
  description: "White-label pricing for agencies: monthly plans sized by how many client projects you run, with anything outside a plan scoped and quoted first.",
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
      <PageIntro
        eyebrow="How pricing works"
        title="Priced by workload, not by hours."
        subtitle="A plan covers the projects you run in parallel; anything bigger is scoped and quoted before it starts."
        body={[
          <>
            Hourly billing punishes the agency for asking questions and rewards the supplier for being slow. We do the opposite. Pick the monthly plan that
            matches how many client projects you have open at once, and the production capacity comes with it — builds, fixes, automation, SEO
            implementation and the maintenance that keeps a site alive.
          </>,
          <>
            Work that sits outside a plan — a migration, a store from scratch, a rescue — gets its own written scope with a fixed price, sent
            {scope ? ` ${scope.turnaround.toLowerCase()}` : " within two business days"} of the brief. No plan is required to send that first brief, and
            moving between tiers takes a message, not a renegotiation.
          </>,
        ]}
        points={[
          { title: "No lock-in", text: "Monthly, cancel or change tier as your pipeline changes." },
          { title: "Fixed-price projects", text: "Every scope is agreed in writing before work begins." },
          { title: "Your margin is yours", text: "What you charge your client is never our business." },
          { title: "Nothing hidden", text: "Third-party costs are passed through at cost, listed by name." },
        ]}
        jump={[
          { label: "The plans", href: "#rates" },
          { label: "Pricing questions", href: "#faq" },
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
