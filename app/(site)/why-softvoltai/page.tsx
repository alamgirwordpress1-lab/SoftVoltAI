import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { Comparison } from "@/components/sections/Comparison";
import { Article } from "@/components/sections/Article";
import { CtaBand } from "@/components/sections/CtaBand";
import { whyCopy } from "@/content/copy/why";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(whyCopy);
}

export default async function WhyPage() {
  const [comparison, copy] = await Promise.all([cms.getComparison(), getCopy(whyCopy)]);

  return (
    <>
      <PageHero crumbs={[{ name: "Why SoftVolt AI", href: "/why-softvoltai" }]} {...bannerProps(copy.banner)} />
      <PageIntro {...introProps(copy.intro)} />
      <div className="border-t border-line">
        <Comparison rows={comparison.rows} source={comparison.source} copy={copy.comparison} />
      </div>
      <Article id="guide" copy={copy.guide} tone="alt" />
      <CtaBand copy={copy.cta} />
    </>
  );
}
