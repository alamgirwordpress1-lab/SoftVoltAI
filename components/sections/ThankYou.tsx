import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

interface Step {
  title: string;
  text: string;
}

interface PageLink {
  title: string;
  text: string;
  url: string;
}

/**
 * The page both forms land on once they have sent. The banner and the three
 * steps belong to the form that sent (message or brief); the links under them
 * are shared. Every word is on the "Thank you" page in WordPress.
 */
export function ThankYou({
  crumb,
  facts,
  sent,
  next,
}: {
  crumb: { name: string; href: string };
  /** The three cards on the right of the banner, the same on both pages. */
  facts: { label: string; value: string }[];
  sent: { eyebrow: string; heading: string; lede: string; steps: Step[] };
  next: { steps_eyebrow: string; eyebrow: string; heading: string; links: PageLink[]; call: string; button: { text: string; url: string } };
}) {
  const steps = sent.steps.filter((s) => s.title);
  const links = next.links.filter((l) => l.title && l.url);

  return (
    <>
      <PageHero crumbs={[{ name: "Contact", href: "/contact" }, crumb]} eyebrow={sent.eyebrow} title={sent.heading} lede={sent.lede} highlights={facts}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href={next.button.url}>{next.button.text}</Button>
          {site.calUrl && next.call ? (
            <a
              href={site.calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ui text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
            >
              {next.call}
            </a>
          ) : null}
        </div>
      </PageHero>

      {steps.length ? (
        <section className="container-x py-14 md:py-20" aria-labelledby="next-steps-title">
          <span id="next-steps-title" className="eyebrow">
            {next.steps_eyebrow}
          </span>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="card shadow-soft p-6">
                <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-semibold text-ink">{step.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {links.length ? (
        <section className="border-t border-line bg-surface" aria-labelledby="while-you-wait-title">
          <div className="container-x py-14 md:py-20">
            <span className="eyebrow">{next.eyebrow}</span>
            <h2 id="while-you-wait-title" className="display display-md mt-4">
              {next.heading}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {links.map((l, i) => (
                <li key={l.url} data-reveal style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}>
                  <Link href={l.url} prefetch={false} className="card card-lift shadow-soft flex h-full flex-col p-6">
                    <h3 className="text-lg font-semibold text-ink">{l.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{l.text}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
