"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link";
import { Chip } from "@/components/ui/Chip";
import { LiveVisit } from "@/components/ui/LiveVisit";
import type { PortfolioDesign } from "@/content/portfolios";

/** The design gallery: one block per category, each card opens the live demo in the device viewer. */
export function PortfolioGrid({ designs, categories }: { designs: PortfolioDesign[]; categories: string[] }) {
  const groups = categories.map((name) => ({ name, list: designs.filter((d) => d.category === name) })).filter((g) => g.list.length);

  return (
    <div className="container-x py-14 md:py-20">
      {groups.map((g, gi) => (
        <section key={g.name} id={slugify(g.name)} aria-labelledby={`${slugify(g.name)}-title`} className={gi ? "mt-16 md:mt-24" : ""}>
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4" data-reveal>
            <h2 id={`${slugify(g.name)}-title`} className="display display-md">
              {g.name} designs
            </h2>
            <span className="mono text-[13px] text-muted">
              {g.list.length} {g.list.length === 1 ? "design" : "designs"}
            </span>
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {g.list.map((d, i) => (
              <li key={d.slug} id={d.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}>
                <DesignCard design={d} index={i} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function DesignCard({ design: d, index }: { design: PortfolioDesign; index: number }) {
  return (
    <article className="card card-lift shadow-soft group flex h-full flex-col overflow-hidden">
      <div className="stage-chrome !py-2">
        <i /> <i /> <i />
        <span className="url">
          {d.category} · {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="relative">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
          {d.image ? (
            <Image src={d.image} alt={`${d.name} website design`} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover object-top" />
          ) : (
            <LivePreview src={d.demo} name={d.name} />
          )}
        </div>
        <LiveVisit url={d.demo} title={`${d.name} website design`} check={false} siteLabel={d.name} className="absolute bottom-3 right-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="eyebrow">{d.category}</span>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink">{d.name}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{d.summary}</p>
        {d.tags.length ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {d.tags.map((t) => (
              <li key={t}>
                <Chip>{t}</Chip>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto pt-6">
          <Link
            href={`/contact?design=${encodeURIComponent(d.name)}#message`}
            prefetch={false}
            className="ui inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
          >
            I want this design
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * The live page itself as the card's picture: rendered at desktop width (1440px)
 * and scaled down to the card. It only loads once the card is near the screen,
 * and it is only a picture: no clicks, no focus, hidden from screen readers.
 */
function LivePreview({ src, name }: { src: string; name: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const size = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1440));
    size.observe(el);
    const seen = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "300px" });
    seen.observe(el);
    return () => {
      size.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {near && scale ? (
        <iframe
          src={src}
          title={`${name} preview`}
          tabIndex={-1}
          // a picture, so no scrollbar down its side (the attribute is old but still the only switch)
          scrolling="no"
          sandbox="allow-scripts allow-same-origin"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white"
          style={{ width: 1440, height: 900, transform: `scale(${scale})` }}
        />
      ) : null}
    </div>
  );
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
