import Link from "next/link";
import type { Testimonial } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";

const CHECKS = [
  {
    title: "Open the builds",
    body: "Every site in the work gallery is live. Click through, run Lighthouse on it, view the source — that is a harder test than a quote.",
    href: "/case-studies",
    cta: "See the work",
  },
  {
    title: "Read the process",
    body: "The five steps, the turnarounds and the QA checklist are published. You can hold us to them before you have spent anything.",
    href: "/about#how-it-works",
    cta: "How we work",
  },
  {
    title: "Start with one project",
    body: "A fixed-price brief with a written scope. Judge the scope, the communication and the delivery, then decide about the next one.",
    href: "/contact",
    cta: "Send us a brief",
  },
];

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length > 0) {
    return (
      <section id="testimonials" className="section section-alt" aria-labelledby="testimonials-title">
        <div className="container-x">
          <SectionHeading
            eyebrow="Testimonials"
            title={<span id="testimonials-title">What agency partners say.</span>}
            lede="Published with written permission, in the partner's own words. Nothing here is paraphrased or bought."
            aside={<ArrowLink href="/contact">Become a partner</ArrowLink>}
          />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((t, i) => (
              <li key={`${t.agency}-${t.name}`} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }}>
                <figure className="card card-lift shadow-soft flex h-full flex-col bg-paper p-7">
                  <svg width="26" height="20" viewBox="0 0 26 20" aria-hidden="true" className="text-accent/35">
                    <path
                      d="M10.6 0v6.2c-2 0-3.4.5-4.2 1.4-.7.8-1 1.9-1 3.2h5.2V20H0v-8.3C0 7.9.9 5 2.6 3 4.4 1 7.1 0 10.6 0Zm15.4 0v6.2c-2 0-3.4.5-4.2 1.4-.7.8-1 1.9-1 3.2H26V20H15.4v-8.3c0-3.8.9-6.7 2.6-8.7C19.8 1 22.5 0 26 0Z"
                      fill="currentColor"
                    />
                  </svg>
                  <blockquote className="mt-5 flex-1 text-[16px] leading-relaxed text-ink md:text-[17px]">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 border-t border-line pt-5">
                    <p className="ui text-[15px] font-bold text-ink">{t.name}</p>
                    <p className="mt-0.5 text-[14px] text-muted">
                      {t.role} · {t.agency}
                    </p>
                    <p className="mono mt-3 text-[11px] uppercase tracking-[0.1em] text-accent">
                      {t.work} · {t.country}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="section section-alt" aria-labelledby="testimonials-title">
      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <span id="testimonials-title">
              No testimonials yet — <span className="text-accent">and we will not invent any.</span>
            </span>
          }
          lede="SoftVolt AI is new. When a partner is happy and gives written permission, their quote appears here with their name, role and agency — nothing paraphrased, no stock photos. Until then, here are three harder ways to check us."
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {CHECKS.map((c, i) => (
            <li key={c.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
              <article className="card card-lift shadow-soft flex h-full flex-col bg-paper p-7">
                <span className="mono text-[12px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.01em] text-ink">{c.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.body}</p>
                <Link href={c.href} className="ui mt-auto inline-flex items-center gap-2 pt-6 text-[14px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent">
                  {c.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center" data-reveal>
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted md:text-base">
            Want to be the first partner quoted here? Send one brief. If the work lands, we will ask — and you can say no.
          </p>
          <Button href="/contact">Send us a brief</Button>
        </div>
      </div>
    </section>
  );
}
