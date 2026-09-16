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

// TODO(owner): every answer below is a public commitment — confirm each one, and
// keep them consistent with the plan limits set in content/stack.ts.
const pricingFaqs = [
  { q: "What if a project does not fit a plan?", a: "Tell us in the brief. Anything outside a plan — a one-off build, a migration, a rescue — is scoped and quoted separately, with a written scope and a fixed price before any work starts." },
  { q: "What counts as an active project?", a: "One client website in production at a time. You can send as many briefs as you like; the plan limits how many run in parallel, not how many you queue." },
  { q: "What about rush work?", a: "Say so in the brief. If we can hit the date we will tell you what it costs; if we cannot, we will tell you that instead of taking the work and missing it." },
  { q: "Do you mark up third-party costs?", a: "No. Hosting, plugins, ad spend and tools are billed at cost or held in your accounts. We quote our work; everything else is transparent." },
];

export default async function RatesPage() {
  const models = await cms.getEngagementModels();
  return (
    <>
      <PageHero
        crumbs={[{ name: "Rates", href: "/rates" }]}
        eyebrow="Rates"
        title="Simple monthly plans, priced up front."
        lede="Match your spend to your actual client workload instead of committing to a full-time salary. Pick the plan that fits how many active projects you run, and move up or down as that number changes."
      />
      <Rates models={models} showHeading={false} />
      <div className="border-t border-line">
        <Faq faqs={pricingFaqs} />
      </div>
      <CtaBand />
    </>
  );
}
