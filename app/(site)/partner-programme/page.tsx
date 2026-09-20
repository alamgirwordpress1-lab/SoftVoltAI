import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { cms } from "@/lib/cms";
import { countWord } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Partner programme — become an agency partner",
  description: "Partner with SoftVolt AI: one fixed-price project first, then a retainer if the briefs keep coming. NDA and protection terms signed once.",
  alternates: { canonical: "/partner-programme" },
};

const localSteps = [
  { title: "Start with one brief", body: "No onboarding fee, no minimum. Send a real project and judge the scope, the communication and the delivery on that." },
  { title: "Sign the paperwork once", body: "Mutual NDA, agency protection terms and, for EU/UK data, the DPA — signed once, covering every project after." },
  { title: "Move to a retainer if it is recurring", body: "When the briefs keep coming, a monthly block of hours with a named producer costs less and schedules faster than project by project." },
  { title: "Resell what we maintain", body: "Care plans, hosting management and reporting are built to be resold under your brand at your margin." },
];

export default async function PartnerProgrammePage() {
  const [models, promises, opener] = await Promise.all([cms.getEngagementModels(), cms.getPromises(), cms.getOpener("/partner-programme")]);
  const steps = opener?.list.length ? opener.list : localSteps;
  return (
    <>
      <PageHero
        crumbs={[{ name: "Partner programme", href: "/partner-programme" }]}
        eyebrow={opener?.eyebrow || "Become a partner"}
        title={opener?.heading.join(" ") || "Partnership starts with one project, not a pitch deck."}
        lede={
          opener?.lede ||
          "We do not ask agencies to commit before they have seen the work. The first brief is a fixed-price project; everything after it gets easier."
        }
        highlights={opener?.highlights.length ? opener.highlights : steps.slice(0, 3).map((s, i) => ({ label: `Step ${i + 1}`, value: s.title }))}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/contact">Send the first brief</Button>
          <Button href="/rates" variant="secondary">
            See how pricing works
          </Button>
        </div>
      </PageHero>

      <PageIntro
        eyebrow={opener?.intro?.eyebrow || "What a partnership is"}
        title={opener?.intro?.title || "A supplier you can put in front of nobody."}
        subtitle={
          opener?.intro?.subtitle || "No exclusivity, no minimum spend, no logo on your work — the partnership is simply that the next brief is easier than the last."
        }
        body={
          opener?.intro?.body.length
            ? opener.intro.body
            : [
          <>
            Most white-label arrangements start with a contract nobody has earned yet. Ours starts with a project. You send one brief, we scope it in
            writing, build it under your brand and hand it over with the documents your client can read. If that goes well, the second brief skips the
            introductions — we already know your stack, your conventions and how you like a handover written.
          </>,
          <>
            Partners get the same production team, the same fixed prices and the same hours as anyone else. What changes is the paperwork: one NDA and one
            master agreement cover everything that follows, so each new project is a scope and a start date rather than a negotiation.
          </>,
              ]
        }
        points={
          opener?.intro?.points.length
            ? opener.intro.points
            : [
                { title: "One agreement", text: "Signed once, covering every project that follows it." },
                { title: "Your brand only", text: "We are never named to your client, in writing or in a call." },
                { title: "No exclusivity", text: "Keep your other suppliers. We are not asking for the lot." },
                { title: "Leave any time", text: "Plans are monthly; projects end when the handover is signed." },
              ]
        }
        jump={
          opener?.intro?.jump.length
            ? opener.intro.jump
            : [
                { label: "How it starts", href: "#steps" },
                { label: "Ways to work", href: "#models" },
                { label: "The terms", href: "#terms" },
              ]
        }
      />

      <section id="steps" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="steps-title">
        <span className="eyebrow">How it starts</span>
        <h2 id="steps-title" className="display display-md mt-4">
          From first brief to standing retainer.
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="card shadow-soft p-6">
              <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="models" className="er relative overflow-hidden" aria-labelledby="models-title">
        <div className="glow -right-24 -top-24 h-[420px] w-[420px]" aria-hidden="true" />
        <div className="container-x relative py-14 md:py-20">
          <span className="eyebrow">Ways to work</span>
          <h2 id="models-title" className="display display-md mt-4">
            <span className="capitalize">{countWord(models.length)}</span> engagement models.
          </h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {models.map((m) => (
              <li key={m.id} className="card p-6">
                <h3 className="text-lg font-semibold text-er-ink">{m.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-er-muted">{m.bestFor}</p>
                <ul className="mt-4 space-y-1.5 text-[14px] text-er-ink">
                  {m.includes.map((inc) => (
                    <li key={inc} className="flex gap-2">
                      <span className="text-volt" aria-hidden="true">
                        ✓
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="terms" className="container-x py-14 md:py-20" aria-labelledby="terms-title">
        <span className="eyebrow">Signed once</span>
        <h2 id="terms-title" className="display display-md mt-4">
          What every partner gets in writing.
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {promises.map((p) => (
            <li key={p.id} className="card p-5">
              <p className="text-[15px] font-semibold leading-snug text-ink">{p.label}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-muted">{p.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand title="Send the first brief. Judge us on that." lede="Scope and fixed price within two business days. The NDA, if you want it first, arrives before anything else." />
    </>
  );
}
