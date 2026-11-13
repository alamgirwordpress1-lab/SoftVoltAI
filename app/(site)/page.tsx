import type { Metadata } from "next";
import { StickyCta } from "@/components/layout/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { CapabilityMarquee } from "@/components/sections/CapabilityMarquee";
import { EngineRoomDemo } from "@/components/sections/EngineRoomDemo";
import { CoreServices } from "@/components/sections/CoreServices";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { ProofStats } from "@/components/sections/ProofStats";
import { Comparison } from "@/components/sections/Comparison";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Protection } from "@/components/sections/Protection";
import { Founder } from "@/components/sections/Founder";
import { Rates, packagesToModels } from "@/components/sections/Rates";
import { ratesCopy } from "@/content/copy/rates";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { homeCopy } from "@/content/copy/home";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { getSiteChrome } from "@/lib/cms/site";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(homeCopy, { absoluteTitle: true });
}

export default async function HomePage() {
  const chrome = await getSiteChrome();
  const [copy, comparison, globeCards, globeLocations, promises, pillars, work, workCategories, clauses, team, pricing, faqs, products] = await Promise.all([
    // every word on this page is in WordPress, on the page called "Home"
    getCopy(homeCopy, { email: chrome.email, location: chrome.location, offset: chrome.utcOffset }),
    cms.getComparison(),
    cms.getGlobeCards(),
    cms.getGlobeLocations(),
    cms.getPromises(),
    cms.getPillars(),
    cms.getWork(),
    cms.getWorkCategories(),
    cms.getProtectionClauses(),
    cms.getTeam(),
    getCopy(ratesCopy),
    cms.getFaqs(),
    cms.getProducts(),
  ]);

  // The typed facts lead (WordPress → Home → Facts row); a slot left over shows
  // the case-study count, counted from the site, so no figure is ever invented.
  const typed = copy.proof.stats.filter((s) => s.value && s.label);
  const counted = work.length ? [{ value: String(work.length), label: "case studies you can open and check" }] : [];
  const stats = [...typed, ...counted].slice(0, 4);

  return (
    <>
      {/* Narrative order: who we are → proof → white label, shown → what we do →
          what we have built ourselves → why it is safe → build-or-buy → price →
          work → who → answers → brief. Grounds alternate paper / white, so no two pale sections meet;
          everything under the hero is light, and only the closing band is dark. The
          commitments ride under the hero buttons, so they have no row of their own. */}
      <Hero
        cards={globeCards}
        locations={globeLocations}
        eyebrow={copy.banner.eyebrow}
        lines={copy.banner.headline}
        lede={copy.banner.lede}
        trust={promises.map((promise) => promise.label)}
        legend={{ hq: copy.banner.legend_hq, markets: copy.banner.legend_markets, eu: copy.banner.legend_eu, drag: copy.banner.legend_drag }}
        cta={chrome.cta}
      />
      <CapabilityMarquee pillars={pillars} />
      <ProofStats stats={stats} />
      <EngineRoomDemo copy={copy.demo} />
      <CoreServices copy={copy.core} tone="alt" />
      {/* plugins only: themes have their own place on /products and in the menu */}
      <ProductShowcase products={products.filter((p) => p.group === "plugins")} copy={copy.products} />
      <Protection clauses={clauses} copy={copy.protection} tone="alt" />
      <Comparison rows={comparison.rows} source={comparison.source} copy={copy.comparison} />
      {/* the monthly plans from the Pricing page, so the two never disagree */}
      <Rates models={packagesToModels(pricing.monthly.packages)} copy={copy.rates} tone="alt" columns={4} />
      <WorkGrid items={work} categories={workCategories} limit={3} copy={copy.work} />
      <Founder team={team} copy={copy.team} />
      <Faq faqs={faqs} copy={copy.faq} />
      {/* the same closing band as every inner page; the full brief form lives on /contact */}
      <CtaBand copy={copy.cta} />
      <StickyCta cta={chrome.cta} />
    </>
  );
}
