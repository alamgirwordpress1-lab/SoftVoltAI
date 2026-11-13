import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { Rates, packagesToModels } from "@/components/sections/Rates";
import { BundleCard } from "@/components/sections/BundleCard";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { Article } from "@/components/sections/Article";
import { ratesCopy } from "@/content/copy/rates";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { getSiteChrome } from "@/lib/cms/site";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(ratesCopy);
}

export default async function PricingPage() {
  const [models, pricingFaqs, process, chrome] = await Promise.all([cms.getEngagementModels(), cms.getPricingFaqs(), cms.getProcess(), getSiteChrome()]);
  const scope = process.find((p) => p.id === "scope");
  // the words are the WordPress page "Pricing" (slug pricing; it was "Rates" at /rates)
  const copy = await getCopy(ratesCopy, {
    scope_time: scope ? scope.turnaround.toLowerCase() : "within two business days",
    email: chrome.email,
  });

  return (
    <>
      <PageHero
        crumbs={[{ name: "Pricing", href: "/pricing" }]}
        {...bannerProps(copy.banner, [
          { label: "Websites", value: "Fixed price, in USD" },
          { label: "After launch", value: "Care, SEO and AI monthly" },
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
        ])}
      />
      <PageIntro {...introProps(copy.intro)} />

      <BundleCard copy={copy.bundle} />
      <Rates id="builds" models={packagesToModels(copy.builds.packages)} copy={copy.builds} columns={3} tone="alt" />
      <Rates id="monthly" models={packagesToModels(copy.monthly.packages)} copy={copy.monthly} columns={4} />
      <Rates id="ai" models={packagesToModels(copy.ai.packages)} copy={copy.ai} columns={2} tone="alt" />
      <Rates id="team" models={models} copy={copy.plans} />
      <Article id="guide" copy={copy.guide} tone="alt" />
      <div className="border-t border-line">
        <Faq faqs={pricingFaqs} copy={copy.faq} />
      </div>
      <CtaBand copy={copy.cta} />
    </>
  );
}
