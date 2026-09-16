import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "For agencies — who we work with",
  description: "White-label production and growth for digital marketing, SEO, PPC, branding, web design and full-service agencies. How each engagement runs, and which services fit.",
  alternates: { canonical: "/for" },
};

export default async function ForIndexPage() {
  const types = await cms.getAgencyTypes();
  return (
    <>
      <PageHero
        crumbs={[{ name: "For agencies", href: "/for" }]}
        eyebrow="Who we help"
        title="Built for agencies that have already sold the work."
        lede="You own the client, the strategy and the invoice. We take the part that is blocking your calendar. Pick the kind of agency you are and see how the engagement runs."
      />
      <section className="container-x border-t border-line py-14 md:py-20">
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {types.map((a, i) => (
            <li key={a.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <Link href={`/for/${a.slug}`} className="card card-lift shadow-soft group flex h-full flex-col p-7">
                <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink">{a.name}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{a.problem}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">→ {a.relief}</p>
                <span className="mono mt-auto pt-6 text-[11px] uppercase tracking-[0.1em] text-accent">How we work with you →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
