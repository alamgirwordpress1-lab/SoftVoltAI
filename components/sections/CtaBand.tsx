import { Button } from "@/components/ui/Button";
import { cta } from "@/content/site";

const DEFAULT_TITLE = "Let's build your next client project —";
const DEFAULT_ACCENT = "under your brand.";

/**
 * Closing band above the footer on inner pages: headline left, reassurance and
 * actions right. The volt accent tail only accompanies the default headline,
 * or a custom one that passes its own `accent`.
 */
export function CtaBand({
  title,
  accent,
  lede = "Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.",
}: {
  title?: string;
  accent?: string;
  lede?: string;
}) {
  const heading = title ?? DEFAULT_TITLE;
  const tail = title === undefined ? (accent ?? DEFAULT_ACCENT) : accent;

  return (
    <section id="next-step" className="er relative overflow-hidden" aria-labelledby="cta-band-title">
      <div className="grid-lines" aria-hidden="true" />
      <div className="glow -bottom-72 left-1/2 h-[560px] w-[min(1100px,90vw)] -translate-x-1/2" aria-hidden="true" />
      <div className="container-x section relative grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-7" data-reveal>
          <span className="pill">Next step</span>
          <h2 id="cta-band-title" className="display display-lg mt-6 max-w-[20ch]">
            {heading} {tail ? <span className="text-volt">{tail}</span> : null}
          </h2>
        </div>
        <div className="lg:col-span-5" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
          <p className="max-w-[48ch] text-lg leading-relaxed text-er-ink/85">{lede}</p>
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
