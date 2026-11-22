import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { BriefCta } from "@/components/sections/BriefCta";
import { homeCopy } from "@/content/copy/home";
import { getCopy } from "@/lib/cms/copy";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Get a quote for your website, SEO or AI project",
  description:
    "Tell us what you need: a website, online store, SEO, ads or AI automation. A real person replies within one business day, with a fixed price in two.",
  alternates: { canonical: "/quote" },
};

/**
 * The order form: the four-step brief (kind of work, what exists, timing and
 * budget, where to send the price), on a page of its own so every "get a quote"
 * and "I want this design" link lands on it. /contact stays for questions and support.
 */
export default async function QuotePage() {
  const [copy, process] = await Promise.all([
    getCopy(homeCopy),
    cms.getProcess(),
  ]);
  const brief = process.find((p) => p.id === "brief");
  const scope = process.find((p) => p.id === "scope");
  // written for agencies and business owners alike; the questions are the home page's "Brief form" tab
  const form = {
    ...copy.brief_form,
    agency_label: "Company or agency",
    brief_label: "What you need, in your words",
    brief_placeholder:
      "What the website or project is for, what exists today, and what 'done' looks like. Agencies: client names can wait until the NDA.",
    submit: "Get my quote",
  };
  return (
    <>
      <PageHero
        crumbs={[{ name: "Get a quote", href: "/quote" }]}
        eyebrow="Get a quote"
        title="Tell us what you need. Get a fixed price."
        lede="A website, an online store, SEO, ads or AI automation: answer four short steps and a real person replies within one business day. The written scope and fixed price follow within two, before any work starts."
        highlights={[
          ...(brief ? [{ label: "First reply", value: brief.turnaround }] : []),
          ...(scope ? [{ label: "Fixed price", value: scope.turnaround }] : []),
          { label: "Payment", value: "Nothing until you approve the price" },
        ]}
      />
      <BriefCta copy={copy.brief} form={form} />
    </>
  );
}
