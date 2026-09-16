import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Founder } from "@/components/sections/Founder";
import { FollowTheSun } from "@/components/sections/FollowTheSun";
import { ProcessEngine } from "@/components/sections/ProcessEngine";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About — the team behind the agencies",
  description:
    "SoftVolt AI is a Dhaka-based white-label production and growth team founded by a senior WordPress and Next.js developer with nine years of agency work in the UK and Bangladesh.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Invisible by design", body: "Your brand on the staging URL, the commits, the reports and the handover. Ours nowhere. That is the product." },
  { title: "Written, not remembered", body: "Scope, price, checklist, handover — if it matters, it is a document you can forward to the client." },
  { title: "Senior hands", body: "The people who scope the work are the people who build it. No hand-off to a junior pool after the sales call." },
  { title: "Honest numbers", body: "We publish measurements we can prove and nothing we cannot. No invented client counts, no guaranteed rankings." },
];

export default async function AboutPage() {
  const [team, clocks, process] = await Promise.all([cms.getTeam(), cms.getClocks(), cms.getProcess()]);
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", href: "/about" }]}
        eyebrow="About SoftVolt AI"
        title="The digital team behind agencies."
        lede="SoftVolt AI exists so agencies can sell websites, apps, automation, SEO and paid media without building a bigger team. We are based in Dhaka, work UK and US hours, and never appear in front of your client."
      />

      <section id="story" className="section container-x border-t border-line" aria-labelledby="story-title">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5" data-reveal>
            <span className="eyebrow">Our story</span>
            <h2 id="story-title" className="display display-lg mt-4">
              Built from nine years inside agencies.
            </h2>
          </div>
          <div className="space-y-5 text-[16px] leading-relaxed text-muted lg:col-span-6 lg:col-start-7 md:text-[17px]" data-reveal>
            <p>
              SoftVolt AI grew out of nine years of doing this work from the inside — building WordPress and WooCommerce sites for
              clients in the UK and Bangladesh, and most recently leading the WordPress team at a UK agency.
            </p>
            <p>
              The pattern never changed. The agency won the client, then the build waited on developers who were already fully
              booked. Deadlines slipped, margins shrank, and the client relationship took the hit.
            </p>
            <p className="text-ink">
              SoftVolt AI is the team that fixes that: senior production capacity that works under your brand, overlaps with your
              working day, and writes every step down.
            </p>
          </div>
        </div>
      </section>

      <Founder team={team} />

      <section id="why" className="section container-x border-t border-line" aria-labelledby="why-title">
        <span className="eyebrow">Why SoftVolt AI</span>
        <h2 id="why-title" className="display display-lg mt-4 max-w-[20ch]">
          Four rules we keep on every project.
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
