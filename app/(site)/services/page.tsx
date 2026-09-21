import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { CtaBand } from "@/components/sections/CtaBand";
import { servicesCopy } from "@/content/copy/services";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(servicesCopy);
}

export default async function ServicesPage() {
  const pillars = await cms.getPillars();
  const count = (ids: string[]) => pillars.filter((p) => ids.includes(p.id)).reduce((n, p) => n + p.services.length, 0);
  const total = pillars.reduce((n, p) => n + p.services.length, 0);
  // the words are the WordPress page "Services"; {count} is the number of services
  const copy = await getCopy(servicesCopy, { count: String(total) });

  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", href: "/services" }]}
        {...bannerProps(copy.banner, [
          { label: "Build", value: `${count(["build"])} services` },
          { label: "Automate", value: `${count(["automate"])} services` },
          { label: "Grow & Support", value: `${count(["grow", "support"])} services` },
        ])}
      />

      <PageIntro {...introProps(copy.intro, { links: pillars.map((p) => ({ label: p.name, href: `#pillar-${p.id}` })) })} />

      {pillars.map((p, i) => (
        <section key={p.id} id={`pillar-${p.id}`} className="container-x border-t border-line py-14 md:py-20" aria-labelledby={`pillar-title-${p.id}`}>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <span className="eyebrow">
                {String(i + 1).padStart(2, "0")} · {p.name}
              </span>
              <h2 id={`pillar-title-${p.id}`} className="display display-md mt-4">
                {p.tagline}
              </h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {p.services.map((s, j) => (
                <li key={s.slug} data-reveal style={{ ["--reveal-delay" as string]: `${j * 50}ms` }}>
                  <Link href={`/services/${s.slug}`} prefetch={false} className="card card-lift shadow-soft group flex h-full flex-col p-6">
                    <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink">{s.name}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.summary}</p>
                    <span className="mono mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] uppercase tracking-[0.1em] text-accent">
                      Read more <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <CtaBand copy={copy.cta} />
    </>
  );
}
