"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { WorkItem } from "@/lib/cms/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

/** Filterable gallery — the cards themselves are unchanged, only the set shown. */
export function WorkGrid({
  items,
  categories,
  showHeading = true,
  limit,
  eyebrow = "Work",
  title = "Builds you can open, not logos you have to trust.",
  lede = "Delivered by our founder as developer and team lead at a UK agency. Partner work is only ever shown here with written permission — and with your name on it, not ours.",
  aside = <ArrowLink href="/case-studies">See all case studies</ArrowLink>,
}: {
  items: WorkItem[];
  categories: string[];
  showHeading?: boolean;
  /** Cap the cards shown after filtering — the homepage shows six, /work shows everything. */
  limit?: number;
  /** The heading above the filters. The defaults are the homepage's; /case-studies passes its own. */
  eyebrow?: string;
  title?: React.ReactNode;
  lede?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const [active, setActive] = useState(categories[0] ?? "All");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of categories) map.set(c, c === categories[0] ? items.length : items.filter((w) => w.category === c).length);
    return map;
  }, [categories, items]);

  const filtered = active === categories[0] ? items : items.filter((w) => w.category === active);
  const shown = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section id="work" className={showHeading ? "section container-x" : "container-x py-14 md:py-20"} aria-labelledby={showHeading ? "work-title" : undefined} aria-label={showHeading ? undefined : "Live builds"}>
      {showHeading ? (
        <SectionHeading eyebrow={eyebrow} title={<span id="work-title">{title}</span>} lede={lede} aside={aside} />
      ) : null}

      <div className={cn("flex flex-wrap items-center gap-2", showHeading ? "mt-12" : "")} role="group" aria-label="Filter work by type" data-reveal>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => setActive(c)}
            className={cn(
              "ui inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors duration-200",
              active === c ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface text-ink hover:border-ink",
            )}
          >
            {c}
            <span className={cn("mono text-[12px]", active === c ? "text-paper/60" : "text-muted")}>{counts.get(c) ?? 0}</span>
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {shown.map((w, i) => (
          <li key={w.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}>
            <article className="card card-lift shadow-soft group flex h-full flex-col overflow-hidden">
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="block" aria-label={`Open ${w.title} in a new tab`}>
                <div className="stage-chrome !py-2">
                  <i /> <i /> <i />
                  <span className="url">{w.url?.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
                  {w.image ? (
                    <Image
                      src={w.image}
                      alt={`${w.title} — homepage screenshot`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>
              </a>
              <div className="flex flex-1 flex-col p-6">
                <span className="eyebrow">{w.category}</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink">
                  <Link href={`/case-studies/${w.slug}`} prefetch={false} className="transition-colors hover:text-accent">
                    {w.title}
                  </Link>
                </h3>
                <p className="mono mt-1 text-[12px] uppercase tracking-[0.08em] text-muted">
                  {w.client} · {w.region}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{w.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {w.stack.map((s) => (
                    <li key={s}>
                      <Chip>{s}</Chip>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                  <Link
                    href={`/case-studies/${w.slug}`}
                    prefetch={false}
                    className="ui inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent"
                  >
                    Read the case study
                    <span aria-hidden="true">→</span>
                  </Link>
                  {w.url ? (
                    <a href={w.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink">
                      Live site
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
