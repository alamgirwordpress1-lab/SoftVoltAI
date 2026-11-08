import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { faqCopy } from "@/content/copy/faq";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { getSiteChrome } from "@/lib/cms/site";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(faqCopy);
}

/** One normalised key per question, so the same question asked in two lists shows once. */
const key = (q: string) => q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default async function FaqPage() {
  const [general, pricing, chrome] = await Promise.all([cms.getFaqs(), cms.getPricingFaqs(), getSiteChrome()]);
  const copy = await getCopy(faqCopy, { email: chrome.email });

  // general first, then pricing, then the questions only this page has; every question once
  const seen = new Set<string>();
  const all = [...general, ...pricing, ...copy.more.list.filter((f) => f.q && f.a)].filter((f) => {
    const k = key(f.q);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return (
    <>
      <PageHero crumbs={[{ name: "FAQ", href: "/faq" }]} {...bannerProps(copy.banner)} />
      <PageIntro {...introProps(copy.intro)} />
      <div className="border-t border-line">
        <Faq faqs={all} copy={copy.faq} />
      </div>
      <CtaBand copy={copy.cta} />
    </>
  );
}
