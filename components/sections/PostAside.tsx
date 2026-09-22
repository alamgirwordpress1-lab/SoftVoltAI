import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import type { WpPostCard } from "@/lib/cms/wordpress";

export interface PostAsideCopy {
  published_label: string;
  updated_label: string;
  author_label: string;
  filed_label: string;
  card_title: string;
  recent_heading: string;
  categories_heading: string;
  cta_heading: string;
  cta_text: string;
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * The column beside a post: what this post is, what else is worth reading, the
 * topics the blog covers, and the one thing we want a reader to do. It sticks
 * to the top of the viewport on a wide screen and simply stacks under the post
 * on a narrow one.
 */
export function PostAside({
  post,
  recent,
  categories,
  cta,
  copy,
}: {
  post: { date: string; modified: string; author: string; categories: { name: string; slug: string }[] };
  recent: WpPostCard[];
  categories: { name: string; slug: string }[];
  cta: { label: string; href: string };
  copy: PostAsideCopy;
}) {
  const published = post.date ? dateFormat.format(new Date(post.date)) : "";
  const updated = post.modified && post.modified.slice(0, 10) !== post.date.slice(0, 10) ? dateFormat.format(new Date(post.modified)) : "";

  return (
    <aside className="lg:col-span-4" aria-label={copy.card_title}>
      <div className="lg:sticky lg:top-28 lg:space-y-6">
        <div className="card p-6">
          <p className="eyebrow">{copy.card_title}</p>
          <dl className="mt-5 space-y-4 text-[15px]">
            {published ? (
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.published_label}</dt>
                <dd className="mt-1 text-ink">
                  <time dateTime={post.date}>{published}</time>
                </dd>
              </div>
            ) : null}
            {updated ? (
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.updated_label}</dt>
                <dd className="mt-1 text-ink">
                  <time dateTime={post.modified}>{updated}</time>
                </dd>
              </div>
            ) : null}
            {post.author ? (
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.author_label}</dt>
                <dd className="mt-1 text-ink">{post.author}</dd>
              </div>
            ) : null}
            {post.categories.length ? (
              <div>
                <dt className="mono text-[11px] uppercase tracking-[0.08em] text-muted">{copy.filed_label}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {post.categories.map((c) => (
                    <Chip key={c.slug}>{c.name}</Chip>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        {recent.length ? (
          <div className="card mt-6 p-6 lg:mt-0">
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

        {categories.length ? (
          <div className="card mt-6 p-6 lg:mt-0">
            <p className="eyebrow">{copy.categories_heading}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Chip>{c.name}</Chip>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* the one dark card on a light page: .er carries the ground and the ink, the way the service card does */}
        <div className="er mt-6 overflow-hidden rounded-[var(--radius-lg)] p-6 lg:mt-0">
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
