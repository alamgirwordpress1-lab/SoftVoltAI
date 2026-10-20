import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { Founder } from "@/components/sections/Founder";
import { FollowTheSun } from "@/components/sections/FollowTheSun";
import { ProcessEngine } from "@/components/sections/ProcessEngine";
import { CtaBand } from "@/components/sections/CtaBand";
import { aboutCopy } from "@/content/copy/about";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { getSiteChrome } from "@/lib/cms/site";
import { countWord } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { ServiceArt } from "@/components/illustrations/ServiceArt";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(aboutCopy);
}

export default async function AboutPage() {
  const [team, clocks, process, chrome, draft] = await Promise.all([cms.getTeam(), cms.getClocks(), cms.getProcess(), getSiteChrome(), getCopy(aboutCopy)]);
  // the heading over the rules counts them, so it always matches the cards under it
  const count = countWord(draft.values.list.length);
  const copy = await getCopy(aboutCopy, { Count: count.charAt(0).toUpperCase() + count.slice(1), count });

  return (
    <>
      {/* the people behind the work, as Person data tied to the company: answer engines weigh named, checkable experts */}
      <JsonLd
        data={team.map((m) => ({
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.name,
          jobTitle: m.role,
          ...(m.bio ? { description: m.bio.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") } : {}),
          ...(m.photo ? { image: m.photo.startsWith("http") ? m.photo : `${site.url}${m.photo}` } : {}),
          ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
          worksFor: { "@id": `${site.url}/#organization` },
        }))}
      />
      <PageHero
        crumbs={[{ name: "About", href: "/about" }]}
        {...bannerProps(copy.banner, [
          { label: "Based in", value: `${chrome.location} · ${chrome.utcOffset}` },
          { label: "Hours", value: "UK & US overlap, daily" },
          ...(team[0] ? [{ label: "Founded by", value: team[0].name }] : []),
        ])}
      />

      <PageIntro
        id="story"
        {...introProps(copy.intro, {
          // the story closes on its point, set in ink rather than muted
          paragraph: (node, i, all) =>
            all.length > 2 && i === all.length - 1 ? (
              <span key={i} className="text-ink">
                {node}
              </span>
            ) : (
              node
            ),
        })}
      />

      <Founder team={team} copy={copy.team} />

      <section id="why" className="section container-x border-t border-line" aria-labelledby="why-title">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal>
            <span className="eyebrow">{copy.values.eyebrow}</span>
            <h2 id="why-title" className="display display-lg mt-4 max-w-[20ch]">
              {copy.values.heading}
            </h2>
          </div>
          {/* one team across time zones: our own drawing, no words */}
          <ServiceArt variant="team" className="max-w-[360px] lg:col-span-5 lg:ml-auto lg:max-w-[420px]" />
        </div>
        <ul className="fx-spot mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.values.list.map((v, i) => (
            <li key={v.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="card shadow-soft p-6">
              <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{v.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <ProcessEngine steps={process} copy={copy.process} />
      <FollowTheSun clocks={clocks} copy={copy.hours} />
      <CtaBand copy={copy.cta} />
    </>
  );
}
