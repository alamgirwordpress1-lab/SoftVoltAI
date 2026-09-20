import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { site } from "@/content/site";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on white-label delivery: how agency work is scoped, built, automated and reported on. Written by the people who do the work, published from our own CMS.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog · SoftVolt AI", url: `${site.url}/blog` },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function BlogPage() {
  const [posts, opener] = await Promise.all([cms.getPosts(24), cms.getOpener("/blog")]);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Blog", href: "/blog" }]}
        eyebrow={opener?.eyebrow || "Blog"}
        title={opener?.heading.join(" ") || "What we learn on agency work, written down."}
        lede={
          opener?.lede ||
          "Scoping, build notes, automation patterns and the reporting agencies actually forward to their clients. Every post is written by whoever did the work."
        }
        highlights={
          opener?.highlights.length
            ? opener.highlights
            : [
                { label: "Written by", value: "The delivery team" },
                { label: "Published from", value: "Our own CMS" },
                { label: "Posts", value: String(posts.length) },
              ]
        }
      />

      <PageIntro
        eyebrow={opener?.intro?.eyebrow || "What you will find here"}
        title={opener?.intro?.title || "Method, not marketing."}
        subtitle={opener?.intro?.subtitle || "The same notes we send partners when they ask how something was done."}
        body={
          opener?.intro?.body.length
            ? opener.intro.body
            : [
          <>
            This is the working half of the site. The service pages say what we deliver; these posts say how a particular job went — the constraint that shaped
            it, the approach we took, and what we would do differently next time.
          </>,
          <>
            Everything here is published from the same WordPress install that runs the rest of the site, so an editor can post without a developer and the page
            you are reading updates within seconds.
          </>,
              ]
        }
        points={opener?.intro?.points.length ? opener.intro.points : undefined}
        jump={
          opener?.intro?.jump.length
            ? opener.intro.jump
            : [
                { label: "All services", href: "/services" },
                { label: "Case studies", href: "/case-studies" },
                { label: "Talk to us", href: "/contact" },
              ]
        }
      />

      <section id="posts" aria-labelledby="posts-title" className="border-b border-line">
        <div className="container-x py-16 md:py-24">
          <h2 id="posts-title" className="display display-lg max-w-[18ch]">
            {posts.length ? "Latest posts" : "Nothing published yet"}
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
                          Read the post
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
              <p className="text-[15px] leading-relaxed text-muted">
                The first posts are being written. In the meantime the case studies carry the same detail — what was built, on what stack, and what it changed.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/case-studies">Read the case studies</Button>
                <Button href="/contact" variant="secondary">
                  Ask us something
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
