import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { blogCopy } from "@/content/copy/blog";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(blogCopy);
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function BlogPage() {
  const posts = await cms.getPosts(24);
  // the words are the WordPress page "Blog"; {count} is the number of posts
  const copy = await getCopy(blogCopy, { count: String(posts.length) });

  return (
    <>
      <PageHero crumbs={[{ name: "Blog", href: "/blog" }]} {...bannerProps(copy.banner)} />

      <PageIntro {...introProps(copy.intro)} />

      <section id="posts" aria-labelledby="posts-title" className="border-b border-line">
        <div className="container-x py-16 md:py-24">
          <h2 id="posts-title" className="display display-lg max-w-[18ch]">
            {posts.length ? copy.posts.heading : copy.posts.empty_heading}
          </h2>

          {posts.length ? (
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {posts.map((post, i) => (
                <li key={post.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}>
                  <article className="card card-lift shadow-soft group flex h-full flex-col overflow-hidden">
                    {post.image ? (
                      <Link href={`/blog/${post.slug}`} prefetch={false} className="block" aria-label={post.title}>
                        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
                          <Image
                            src={post.image.src}
                            alt={post.image.alt || post.title}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="object-cover transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                          />
                        </div>
                      </Link>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      {post.categories.length ? <span className="eyebrow">{post.categories[0].name}</span> : null}
                      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink">
                        <Link href={`/blog/${post.slug}`} prefetch={false} className="transition-colors hover:text-accent">
                          {post.title}
                        </Link>
                      </h3>
                      {post.date ? (
                        <p className="mono mt-1 text-[12px] uppercase tracking-[0.08em] text-muted">
                          <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                          {post.author ? ` · ${post.author}` : ""}
                        </p>
                      ) : null}
                      {post.excerpt ? <p className="mt-4 text-[15px] leading-relaxed text-muted">{post.excerpt}</p> : null}
                      {post.categories.length > 1 ? (
                        <ul className="mt-5 flex flex-wrap gap-1.5">
                          {post.categories.slice(1).map((c) => (
                            <li key={c.slug}>
                              <Chip>{c.name}</Chip>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="mt-auto pt-6">
                        <Link
                          href={`/blog/${post.slug}`}
                          prefetch={false}
                          className="ui inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line underline-offset-4 transition-colors group-hover:decoration-accent"
                        >
                          {copy.posts.read_more}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card mt-10 max-w-[60ch] p-8">
              <p className="text-[15px] leading-relaxed text-muted">{copy.posts.empty_text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {copy.posts.empty_button.text ? <Button href={copy.posts.empty_button.url}>{copy.posts.empty_button.text}</Button> : null}
                {copy.posts.empty_button_secondary.text ? (
                  <Button href={copy.posts.empty_button_secondary.url} variant="secondary">
                    {copy.posts.empty_button_secondary.text}
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
