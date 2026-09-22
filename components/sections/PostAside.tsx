import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { BlogSearch } from "@/components/search/BlogSearch";
import type { WpPostCard } from "@/lib/cms/wordpress";

export interface PostAsideCopy {
  search_heading: string;
  search_placeholder: string;
  categories_heading: string;
  tags_heading: string;
  recent_heading: string;
  cta_heading: string;
  cta_text: string;
}

const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The column beside a post: search, the topics the blog covers, its tags, what
 * else is worth reading, and the one thing we want a reader to do. It sticks to
 * the top of the viewport on a wide screen and stacks under the post on a
 * narrow one. What this particular post is — published, author, filed under —
 * sits above the words instead, where a reader looks for it.
 */
export function PostAside({
  recent,
  categories,
  tags,
  cta,
  copy,
}: {
  recent: WpPostCard[];
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  cta: { label: string; href: string };
  copy: PostAsideCopy;
}) {
  return (
    <aside className="lg:col-span-4" aria-label={copy.recent_heading}>
      <div className="space-y-6 lg:sticky lg:top-28">
        <BlogSearch label={copy.search_heading} placeholder={copy.search_placeholder} />

        {categories.length ? (
          <div className="card p-6">
            <p className="eyebrow">{copy.categories_heading}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/blog/topic/${c.slug}`} prefetch={false} className="inline-block transition-colors hover:text-ink">
                    <Chip className="hover:border-line-strong">{c.name}</Chip>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {tags.length ? (
          <div className="card p-6">
            <p className="eyebrow">{copy.tags_heading}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {tags.map((t) => (
                <li key={t.slug}>
                  <Link href={`/blog/topic/${t.slug}`} prefetch={false} className="inline-block transition-colors hover:text-ink">
                    <Chip className="hover:border-line-strong">{t.name}</Chip>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {recent.length ? (
          <div className="card p-6">
            <p className="eyebrow">{copy.recent_heading}</p>
            <ul className="mt-5 space-y-4">
              {recent.map((p) => (
                <li key={p.slug} className="border-b border-line pb-4 last:border-b-0 last:pb-0">
                  <Link href={`/blog/${p.slug}`} prefetch={false} className="group flex gap-3">
                    {p.image ? (
                      <span className="relative block h-14 w-16 shrink-0 overflow-hidden rounded-md bg-raised">
                        <Image src={p.image.src} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                    ) : null}
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">{p.title}</span>
                      {p.date ? (
                        <time dateTime={p.date} className="mono mt-1 block text-[11px] uppercase tracking-[0.08em] text-muted">
                          {shortDate.format(new Date(p.date))}
                        </time>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* the one dark card on a light page: .er carries the ground and the ink, the way the service card does */}
        <div className="er overflow-hidden rounded-[var(--radius-lg)] p-6">
          <p className="ui text-lg font-bold text-er-ink">{copy.cta_heading}</p>
          {copy.cta_text ? <p className="mt-2 text-[14px] leading-relaxed text-er-muted">{copy.cta_text}</p> : null}
          <div className="mt-5">
            <Button href={cta.href} variant="onDark">
              {cta.label}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * What this post is, as a strip above the words: when it was published, when it
 * was last changed, who wrote it and what it is filed under.
 */
export function PostMeta({
  post,
  reading,
  copy,
}: {
  post: { date: string; modified: string; author: string; categories: { name: string; slug: string }[] };
  /** "4 min read", counted from the post itself. */
  reading: string;
  copy: { title: string; published_label: string; updated_label: string; author_label: string; reading_label: string; filed_label: string };
}) {
  const published = post.date ? longDate.format(new Date(post.date)) : "";
  const updated = post.modified && post.modified.slice(0, 10) !== post.date.slice(0, 10) ? longDate.format(new Date(post.modified)) : "";

  return (
    <section className="card mt-9 p-6" aria-label={copy.title} data-reveal>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {published ? (
          <div>
            <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.published_label}</dt>
            <dd className="mt-1.5 text-[15px] text-ink">
              <time dateTime={post.date}>{published}</time>
            </dd>
          </div>
        ) : null}
        {updated ? (
          <div>
            <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.updated_label}</dt>
            <dd className="mt-1.5 text-[15px] text-ink">
              <time dateTime={post.modified}>{updated}</time>
            </dd>
          </div>
        ) : null}
        {post.author ? (
          <div>
            <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.author_label}</dt>
            <dd className="mt-1.5 text-[15px] text-ink">{post.author}</dd>
          </div>
        ) : null}
        {reading ? (
          <div>
            <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.reading_label}</dt>
            <dd className="mt-1.5 text-[15px] text-ink">{reading}</dd>
          </div>
        ) : null}
        {post.categories.length ? (
          <div>
            <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.filed_label}</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {post.categories.map((c) => (
                <Link key={c.slug} href={`/blog/topic/${c.slug}`} prefetch={false} className="inline-block transition-colors hover:text-ink">
                  <Chip className="hover:border-line-strong">{c.name}</Chip>
                </Link>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
