import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { ProcessEngine } from "@/components/sections/ProcessEngine";
import { Article } from "@/components/sections/Article";
import { FollowTheSun } from "@/components/sections/FollowTheSun";
import { Protection } from "@/components/sections/Protection";
import { CtaBand } from "@/components/sections/CtaBand";
import { howWeWorkCopy } from "@/content/copy/how-we-work";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(howWeWorkCopy);
}

export default async function HowWeWorkPage() {
  const [process, clocks, clauses, copy] = await Promise.all([cms.getProcess(), cms.getClocks(), cms.getProtectionClauses(), getCopy(howWeWorkCopy)]);

  return (
    <>
      <PageHero crumbs={[{ name: "How we work", href: "/how-we-work" }]} {...bannerProps(copy.banner)} />
      <PageIntro {...introProps(copy.intro)} />
      <ProcessEngine steps={process} copy={copy.process} />
      <Article id="detail" copy={copy.detail} />
      <FollowTheSun clocks={clocks} copy={copy.hours} />
      <Protection clauses={clauses} copy={copy.protection} />
      <CtaBand copy={copy.cta} />
    </>
  );
}
