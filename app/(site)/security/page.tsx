import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { Protection } from "@/components/sections/Protection";
import { CtaBand } from "@/components/sections/CtaBand";
import { securityCopy } from "@/content/copy/security";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { countWord } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(securityCopy);
}

export default async function SecurityPage() {
  const [clauses, draft] = await Promise.all([cms.getProtectionClauses(), getCopy(securityCopy)]);
  // the heading counts the practices, so it can never say "eight" above seven cards
  const count = countWord(draft.practices.list.length);
  const copy = await getCopy(securityCopy, { Count: count.charAt(0).toUpperCase() + count.slice(1), count });

  return (
    <>
      <PageHero crumbs={[{ name: "Security & confidentiality", href: "/security" }]} {...bannerProps(copy.banner)} />
      <PageIntro {...introProps(copy.intro)} />

      <section id="practices" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="practices-title">
        <span className="eyebrow">{copy.practices.eyebrow}</span>
        <h2 id="practices-title" className="display display-md mt-4">
          {copy.practices.heading}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.practices.list.map((p, i) => (
            <li key={p.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 50}ms` }} className="card shadow-soft p-6">
              <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <div className="border-t border-line">
        <Protection clauses={clauses} copy={copy.protection} linkToSecurity={false} />
      </div>
      <CtaBand copy={copy.cta} />
    </>
  );
}
