import { Button } from "@/components/ui/Button";
import { getSiteChrome } from "@/lib/cms/site";

export interface CtaBandCopy {
  pill: string;
  heading: string;
  /** Set in volt straight after the heading; empty for none. */
  accent: string;
  lede: string;
}

/**
 * Closing band above the footer on inner pages: headline left, reassurance and
 * actions right. The words come from the page's "Closing call to action" tab;
 * the two buttons are the site-wide calls to action from the settings screen.
 */
export async function CtaBand({ copy }: { copy: CtaBandCopy }) {
  const { cta } = await getSiteChrome();

  return (
    <section id="next-step" className="er relative overflow-hidden" aria-labelledby="cta-band-title">
      <div className="grid-lines" aria-hidden="true" />
      <div className="glow -bottom-72 left-1/2 h-[560px] w-[min(1100px,90vw)] -translate-x-1/2" aria-hidden="true" />
      <div className="container-x section relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-7" data-reveal>
          {copy.pill ? <span className="pill">{copy.pill}</span> : null}
          <h2 id="cta-band-title" className="display display-lg mt-6 max-w-[20ch]">
            {copy.heading} {copy.accent ? <span className="text-volt">{copy.accent}</span> : null}
          </h2>
        </div>
        <div className="lg:col-span-5" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
          <p className="max-w-[48ch] text-lg leading-relaxed text-er-ink/85">{copy.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={cta.primary.href} variant="onDark">
              {cta.primary.label}
            </Button>
            <Button href={cta.secondary.href} variant="outlineDark">
              {cta.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
