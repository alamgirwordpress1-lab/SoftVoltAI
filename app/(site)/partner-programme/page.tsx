import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { CtaBand } from "@/components/sections/CtaBand";
import { partnerProgrammeCopy } from "@/content/copy/partner-programme";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";
import { countWord } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(partnerProgrammeCopy);
}

const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export default async function PartnerProgrammePage() {
  const [models, promises] = await Promise.all([cms.getEngagementModels(), cms.getPromises()]);
  // the words are the WordPress page "Partner programme"; {Count} is the number of plans
  const copy = await getCopy(partnerProgrammeCopy, { Count: capital(countWord(models.length)), count: countWord(models.length) });
  const steps = copy.steps.list;

  return (
    <>
      <PageHero
        crumbs={[{ name: "Partner programme", href: "/partner-programme" }]}
        {...bannerProps(
          copy.banner,
          steps.slice(0, 3).map((s, i) => ({ label: `Step ${i + 1}`, value: s.title })),
        )}
      >
        <div className="flex flex-wrap gap-3">
          {copy.banner.button.text ? <Button href={copy.banner.button.url}>{copy.banner.button.text}</Button> : null}
          {copy.banner.button_secondary.text ? (
            <Button href={copy.banner.button_secondary.url} variant="secondary">
              {copy.banner.button_secondary.text}
            </Button>
          ) : null}
        </div>
      </PageHero>

      <PageIntro {...introProps(copy.intro)} />

      <section id="steps" className="container-x border-t border-line py-14 md:py-20" aria-labelledby="steps-title">
        <span className="eyebrow">{copy.steps.eyebrow}</span>
        <h2 id="steps-title" className="display display-md mt-4">
          {copy.steps.heading}
        </h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="card shadow-soft p-6">
              <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="models" className="er relative overflow-hidden" aria-labelledby="models-title">
        <div className="glow -right-24 -top-24 h-[420px] w-[420px]" aria-hidden="true" />
        <div className="container-x relative py-14 md:py-20">
          <span className="eyebrow">{copy.models.eyebrow}</span>
          <h2 id="models-title" className="display display-md mt-4">
            {copy.models.heading}
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
        <span className="eyebrow">{copy.terms.eyebrow}</span>
        <h2 id="terms-title" className="display display-md mt-4">
          {copy.terms.heading}
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

      <CtaBand copy={copy.cta} />
    </>
  );
}
