import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { bannerProps } from "@/components/ui/copy-props";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { portfoliosCopy } from "@/content/copy/portfolios";
import { portfolioCategories, portfolioDesigns } from "@/content/portfolios";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(portfoliosCopy);
}

/** /portfolios — website designs a visitor can open live and ask us to build. */
export default async function PortfoliosPage() {
  const copy = await getCopy(portfoliosCopy);
  return (
    <>
      <PageHero crumbs={[{ name: "Portfolios", href: "/portfolios" }]} {...bannerProps(copy.banner)} />
      <div className="border-t border-line">
        <PortfolioGrid designs={portfolioDesigns} categories={portfolioCategories} />
      </div>
      <CtaBand copy={copy.cta} />
    </>
  );
}
