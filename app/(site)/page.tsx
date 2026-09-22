import type { Metadata } from "next";
import { StickyCta } from "@/components/layout/StickyCta";
import { Hero } from "@/components/sections/Hero";
import { CapabilityMarquee } from "@/components/sections/CapabilityMarquee";
import { PromiseBar } from "@/components/sections/PromiseBar";
import { EngineRoomDemo } from "@/components/sections/EngineRoomDemo";
import { ServicePillars } from "@/components/sections/ServicePillars";
import { AgencyTypes } from "@/components/sections/AgencyTypes";
import { Comparison } from "@/components/sections/Comparison";
import { ProcessEngine } from "@/components/sections/ProcessEngine";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { FollowTheSun } from "@/components/sections/FollowTheSun";
import { StackPanel } from "@/components/sections/StackPanel";
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
  const [copy, comparison, globeCards, globeLocations, promises, agencyTypes, pillars, process, work, workCategories, clocks, stack, clauses, team, models, faqs] =
    await Promise.all([
      // every word on this page is in WordPress, on the page called "Home"
      getCopy(homeCopy, { email: chrome.email, location: chrome.location, offset: chrome.utcOffset }),
      cms.getComparison(),
      cms.getGlobeCards(),
      cms.getGlobeLocations(),
      cms.getPromises(),
      cms.getAgencyTypes(),
      cms.getPillars(),
      cms.getProcess(),
      cms.getWork(),
      cms.getWorkCategories(),
      cms.getClocks(),
      cms.getStack(),
      cms.getProtectionClauses(),
      cms.getTeam(),
      cms.getEngagementModels(),
      cms.getFaqs(),
    ]);

  return (
    <>
      {/* Narrative order: who we are → what we do → why us → the build-or-buy
          case → how it runs → what it costs → who it is for → proof → answers. */}
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
      <StackPanel stack={stack} copy={copy.stack} />
      <Protection clauses={clauses} copy={copy.protection} />
      <FollowTheSun clocks={clocks} copy={copy.hours} />
      <Comparison rows={comparison.rows} source={comparison.source} copy={copy.comparison} />
      <ProcessEngine steps={process} copy={copy.process} />
      <Rates models={models} copy={copy.rates} />
      <AgencyTypes items={agencyTypes} copy={copy.agencies} />
      <WorkGrid items={work} categories={workCategories} limit={6} copy={copy.work} />
      <Founder team={team} copy={copy.team} />
      <Faq faqs={faqs} copy={copy.faq} />
      {/* the brief form is the page’s closing call: a CtaBand under it would only repeat the ask */}
      <BriefCta copy={copy.brief} form={copy.brief_form} />
      <StickyCta cta={chrome.cta} />
    </>
  );
}
