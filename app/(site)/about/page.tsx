import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Founder } from "@/components/sections/Founder";
import { FollowTheSun } from "@/components/sections/FollowTheSun";
import { ProcessEngine } from "@/components/sections/ProcessEngine";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";
import { site } from "@/content/site";
import { countWord } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — the team behind the agencies",
  description: "The Dhaka team behind agencies in the UK and US: senior WordPress, Next.js and SEO production, founded by a nine-year agency developer.",
  alternates: { canonical: "/about" },
};

const localValues = [
  { title: "Invisible by design", body: "Your brand on the staging URL, the commits, the reports and the handover. Ours nowhere. That is the product." },
  { title: "Written, not remembered", body: "Scope, price, checklist, handover — if it matters, it is a document you can forward to the client." },
  { title: "Senior hands", body: "The people who scope the work are the people who build it. No hand-off to a junior pool after the sales call." },
  { title: "Honest numbers", body: "We publish measurements we can prove and nothing we cannot. No invented client counts, no guaranteed rankings." },
];

export default async function AboutPage() {
  const [team, clocks, process, opener] = await Promise.all([cms.getTeam(), cms.getClocks(), cms.getProcess(), cms.getOpener("/about")]);
  const values = opener?.list.length ? opener.list : localValues;
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", href: "/about" }]}
        eyebrow={opener?.eyebrow || "About SoftVolt AI"}
        title={opener?.heading.join(" ") || "The digital team behind agencies."}
        lede={
          opener?.lede ||
          "SoftVolt AI exists so agencies can sell websites, apps, automation, SEO and paid media without building a bigger team. We are based in Dhaka, work UK and US hours, and never appear in front of your client."
        }
        highlights={
          opener?.highlights.length
            ? opener.highlights
            : [
                { label: "Based in", value: `${site.location} · ${site.utcOffset}` },
                { label: "Hours", value: "UK & US overlap, daily" },
                ...(team[0] ? [{ label: "Founded by", value: team[0].name }] : []),
              ]
        }
      />

      <PageIntro
        id="story"
        eyebrow={opener?.intro?.eyebrow || "Our story"}
        title={opener?.intro?.title || "Built from nine years inside agencies."}
        subtitle={
          opener?.intro?.subtitle || "The people who take your brief are the ones who build it — senior WordPress, Next.js and SEO hands, on your working day."
        }
        body={
          opener?.intro?.body.length
            ? opener.intro.body
            : [
          <>
            SoftVolt AI grew out of nine years of doing this work from the inside — building WordPress and WooCommerce sites for clients in the UK and
            Bangladesh, and most recently leading the WordPress team at a UK agency.
          </>,
          <>
            The pattern never changed. The agency won the client, then the build waited on developers who were already fully booked. Deadlines slipped,
            margins shrank, and the client relationship took the hit.
          </>,
          <span key="closing" className="text-ink">
            SoftVolt AI is the team that fixes that: senior production capacity that works under your brand, overlaps with your working day, and writes every
            step down.
          </span>,
              ]
        }
        points={opener?.intro?.points.length ? opener.intro.points : undefined}
        jump={
          opener?.intro?.jump.length
            ? opener.intro.jump
            : [
                { label: "The team", href: "#founder" },
                { label: "Our rules", href: "#why" },
                { label: "How we work", href: "#how-it-works" },
                { label: "Our hours", href: "#hours" },
              ]
        }
      />

      <Founder team={team} />

      <section id="why" className="section container-x border-t border-line" aria-labelledby="why-title">
        <span className="eyebrow">{opener?.sections.why?.eyebrow || "Why SoftVolt AI"}</span>
        <h2 id="why-title" className="display display-lg mt-4 max-w-[20ch]">
          {opener?.sections.why?.title || (
            <>
              <span className="capitalize">{countWord(values.length)}</span> rules we keep on every project.
            </>
          )}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={v.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="card shadow-soft p-6">
              <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{v.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{v.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <ProcessEngine steps={process} />
      <FollowTheSun clocks={clocks} />
      <CtaBand />
    </>
  );
}
