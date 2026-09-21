import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { Rates } from "@/components/sections/Rates";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { ratesCopy } from "@/content/copy/rates";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { getSiteChrome } from "@/lib/cms/site";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(ratesCopy);
}

export default async function RatesPage() {
  const [models, pricingFaqs, process, chrome] = await Promise.all([cms.getEngagementModels(), cms.getPricingFaqs(), cms.getProcess(), getSiteChrome()]);
  const scope = process.find((p) => p.id === "scope");
  // the words are the WordPress page "Rates"
  const copy = await getCopy(ratesCopy, {
    scope_time: scope ? scope.turnaround.toLowerCase() : "within two business days",
    email: chrome.email,
  });

  return (
    <>
      <PageHero
        crumbs={[{ name: "Rates", href: "/rates" }]}
        {...bannerProps(copy.banner, [
          { label: "Plans", value: `${models.length} monthly tiers` },
          { label: "Outside a plan", value: "Scoped and quoted in writing" },
          ...(scope ? [{ label: scope.name, value: scope.turnaround }] : []),
        ])}
      />
      <PageIntro {...introProps(copy.intro)} />

      <Rates models={models} copy={copy.plans} showHeading={false} />
      <div className="border-t border-line">
        <Faq faqs={pricingFaqs} copy={copy.faq} />
      </div>
      <CtaBand copy={copy.cta} />
    </>
  );
}
