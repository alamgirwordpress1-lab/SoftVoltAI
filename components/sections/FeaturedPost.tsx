import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import type { WpPostCard } from "@/lib/cms/wordpress";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/**
 * The newest post, given the room a lead story deserves: the picture on one
 * side, the words on the other, and one link over the whole card. On a narrow
 * screen it simply stacks.
 */
export function FeaturedPost({ post, eyebrow, readMore }: { post: WpPostCard; eyebrow: string; readMore: string }) {
  const published = post.date ? dateFormat.format(new Date(post.date)) : "";

  return (
    <section className="container-x pt-14 md:pt-20" aria-labelledby="featured-title">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      {/* one link over the whole card: the title carries it and stretches across, so
          clicking the picture or "read the post" opens the post too */}
      <article className="card card-lift shadow-float group relative mt-6 grid cursor-pointer overflow-hidden lg:grid-cols-[1.05fr_1fr]" data-reveal>
        <div className="block">
          <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised lg:h-full lg:border-b-0 lg:border-r">
            {post.image ? (
              <Image
                src={post.image.src}
                alt={post.image.alt || post.title}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
                className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 md:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {post.categories.length ? <Chip>{post.categories[0].name}</Chip> : null}
            {published ? (
              <span className="mono text-[12px] uppercase tracking-[0.08em] text-muted">
                <time dateTime={post.date}>{published}</time>
                {post.author ? ` · ${post.author}` : ""}
              </span>
            ) : null}
          </div>

          <h2 id="featured-title" className="display display-md mt-5">
            <Link href={`/blog/${post.slug}`} prefetch={false} className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent">
              {post.title}
            </Link>
          </h2>

          {post.excerpt ? <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted md:text-[17px]">{post.excerpt}</p> : null}

          <span className="ui mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent">
            {readMore}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </article>
    </section>
  );
}
