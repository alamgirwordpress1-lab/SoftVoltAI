import type { Metadata } from "next";
import { StickyCta } from "@/components/layout/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { CapabilityMarquee } from "@/components/sections/CapabilityMarquee";
import { PromiseBar } from "@/components/sections/PromiseBar";
import { EngineRoomDemo } from "@/components/sections/EngineRoomDemo";
import { ServicePillars } from "@/components/sections/ServicePillars";
import { Comparison } from "@/components/sections/Comparison";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Protection } from "@/components/sections/Protection";
import { Founder } from "@/components/sections/Founder";
import { Rates } from "@/components/sections/Rates";
import { Faq } from "@/components/sections/Faq";
import { BriefCta } from "@/components/sections/BriefCta";
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
  const [copy, comparison, globeCards, globeLocations, promises, pillars, work, workCategories, clauses, team, models, faqs] = await Promise.all([
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
    cms.getEngagementModels(),
    cms.getFaqs(),
  ]);

  return (
    <>
      {/* Narrative order: who we are → what we do → why it is safe → the build-or-buy
          case → what it costs → proof → who → answers → brief. The grounds alternate
          paper / white from Services down, so no two pale sections meet: Protection,
          Rates and Founder sit on the white band, the rest on paper. The stack, hours,
          process and agency-type sections live on /about, /for and /services. */}
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
      <PromiseBar promises={promises} />
      <EngineRoomDemo copy={copy.demo} />
      <CapabilityMarquee pillars={pillars} />
      <ServicePillars pillars={pillars} copy={copy.services} />
      <Protection clauses={clauses} copy={copy.protection} tone="alt" />
      <Comparison rows={comparison.rows} source={comparison.source} copy={copy.comparison} />
      <Rates models={models} copy={copy.rates} tone="alt" />
      <WorkGrid items={work} categories={workCategories} limit={3} copy={copy.work} />
      <Founder team={team} copy={copy.team} />
      <Faq faqs={faqs} copy={copy.faq} />
      {/* the brief form is the page’s closing call: a CtaBand under it would only repeat the ask */}
      <BriefCta copy={copy.brief} form={copy.brief_form} />
      <StickyCta cta={chrome.cta} />
    </>
  );
}
