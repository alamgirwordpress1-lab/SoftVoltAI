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
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export default async function HomePage() {
  const [comparison, globeCards, globeLocations, promises, agencyTypes, pillars, process, work, workCategories, clocks, stack, clauses, team, models, faqs] =
    await Promise.all([
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
      <Hero cards={globeCards} locations={globeLocations} />
      <PromiseBar promises={promises} />
      <EngineRoomDemo />
      <CapabilityMarquee pillars={pillars} />
      <ServicePillars pillars={pillars} />
      <StackPanel stack={stack} />
      <Protection clauses={clauses} />
      <FollowTheSun clocks={clocks} />
      <Comparison rows={comparison.rows} source={comparison.source} />
      <ProcessEngine steps={process} />
      <Rates models={models} />
      <AgencyTypes items={agencyTypes} />
      <WorkGrid items={work} categories={workCategories} limit={6} />
      <Founder team={team} />
      <Faq faqs={faqs} />
      <BriefCta />
      <CtaBand />
      <StickyCta />
    </>
  );
}
