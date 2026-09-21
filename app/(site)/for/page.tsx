import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { CtaBand } from "@/components/sections/CtaBand";
import { forCopy } from "@/content/copy/for";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { countWord } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(forCopy);
}

export default async function ForIndexPage() {
  const [types, promises] = await Promise.all([cms.getAgencyTypes(), cms.getPromises()]);
  // the words are the WordPress page "Agency Solutions"; {count} is the number of agency types
  const copy = await getCopy(forCopy, { count: countWord(types.length) });
  const short = (list: typeof types) => list.map((t) => t.name.replace(/ agencies$/i, "")).join(" · ");
  const noContact = promises.find((p) => p.id === "no-contact");

  return (
    <>
      <PageHero
        crumbs={[{ name: "For agencies", href: "/for" }]}
        {...bannerProps(copy.banner, [
          { label: "Built for", value: short(types.slice(0, 3)) },
          { label: "And for", value: short(types.slice(3)) },
          ...(noContact ? [{ label: "Commitment", value: noContact.label }] : []),
        ])}
      />
      <PageIntro {...introProps(copy.intro)} />

      <section id="agency-types" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="agency-types-title">
        <span className="eyebrow">{copy.types.eyebrow}</span>
        <h2 id="agency-types-title" className="display display-md mt-4 max-w-[20ch]">
          {copy.types.heading}
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {types.map((a, i) => (
            <li key={a.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link href={`/for/${a.slug}`} prefetch={false} className="card card-lift shadow-soft group flex h-full flex-col p-7">
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-ink">{a.name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.problem}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">→ {a.relief}</p>
                {copy.types.card_link ? <span className="mono mt-auto pt-6 text-[11px] uppercase tracking-[0.1em] text-accent">{copy.types.card_link}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand copy={copy.cta} />
    </>
  );
}
