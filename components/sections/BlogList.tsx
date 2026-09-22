"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import type { WpPostCard } from "@/lib/cms/wordpress";
import { cn } from "@/lib/utils";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The posts under the newest one: a button per topic, then a card each.
 *
 * The filter is only drawn when there is something to filter — one topic, or a
 * handful of posts, and a row of buttons is decoration rather than help.
 */
export function BlogList({
  posts,
  heading,
  allLabel,
  readMore,
}: {
  posts: WpPostCard[];
  heading: string;
  allLabel: string;
  readMore: string;
}) {
  const topics = Array.from(new Map(posts.flatMap((p) => p.categories).map((c) => [c.slug, c])).values());
  const [active, setActive] = useState("");
  const shown = active ? posts.filter((p) => p.categories.some((c) => c.slug === active)) : posts;
  const showFilter = topics.length > 1 && posts.length > 3;

  return (
    <section id="posts" aria-labelledby="posts-title" className="container-x py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="posts-title" className="display display-md">
          {heading}
        </h2>

        {showFilter ? (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={allLabel} data-reveal>
            {[{ slug: "", name: allLabel }, ...topics].map((topic) => (
              <button
                key={topic.slug || "all"}
                type="button"
                aria-pressed={active === topic.slug}
                onClick={() => setActive(topic.slug)}
                className={cn(
                  "ui inline-flex items-center rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors duration-200",
                  active === topic.slug ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface text-ink hover:border-ink",
                )}
              >
                {topic.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((post, i) => (
          <li key={post.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}>
            <article className="card card-lift shadow-soft group relative flex h-full cursor-pointer flex-col overflow-hidden">
              <div className="block">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
                  {post.image ? (
                    <Image
                      src={post.image.src}
                      alt={post.image.alt || post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                {post.categories.length ? <span className="eyebrow">{post.categories[0].name}</span> : null}
                <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.01em] text-ink">
                  <Link href={`/blog/${post.slug}`} prefetch={false} className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent">
                    {post.title}
                  </Link>
                </h3>
                {post.date ? (
                  <p className="mono mt-2 text-[11px] uppercase tracking-[0.08em] text-muted">
                    <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                    {post.author ? ` · ${post.author}` : ""}
                  </p>
                ) : null}
                {post.excerpt ? <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">{post.excerpt}</p> : null}
                {post.categories.length > 1 ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {post.categories.slice(1).map((c) => (
                      <li key={c.slug} className="relative z-10">
                        <Link href={`/blog/topic/${c.slug}`} prefetch={false} className="inline-block transition-colors hover:text-ink">
                          <Chip className="hover:border-line-strong">{c.name}</Chip>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-auto pt-6">
                  <span className="ui inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent">
                    {readMore}
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
