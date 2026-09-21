import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { blogCopy } from "@/content/copy/blog";
import { getCopy } from "@/lib/cms/copy";
import { getSiteChrome } from "@/lib/cms/site";
import { cms } from "@/lib/cms";

/** Posts published after the last build render on first request, then cache. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await cms.getWpSlugs();
  return (slugs?.posts ?? []).map((p) => ({ slug: p.slug }));
}

/** Yoast's description when an editor wrote one, the excerpt when they did not. */
function metaDescription(description: string, excerpt: string) {
  const text = description || excerpt;
  return text.length > 160 ? `${text.slice(0, 157).replace(/[\s,;:—-]+$/, "")}…` : text;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await cms.getPost(slug);
  if (!post) return {};
  const description = metaDescription(post.seo.description, post.excerpt);
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.seo.ogTitle || post.title,
      description: post.seo.ogDescription || description,
      url: `${site.url}/blog/${slug}`,
      publishedTime: post.date || undefined,
      modifiedTime: post.modified || undefined,
      images: post.image ? [{ url: post.image.src }] : undefined,
    },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await cms.getPost(slug);
  if (!post) notFound();

  const [all, chrome, copy] = await Promise.all([cms.getPosts(4), getSiteChrome(), getCopy(blogCopy)]);
  const others = all.filter((p) => p.slug !== slug).slice(0, 3);
  const words = copy.post;
  const published = post.date ? dateFormat.format(new Date(post.date)) : "";

  return (
    <>
      {/* built here rather than taken from Yoast: Yoast's schema carries the CMS
          hostname and the CMS site name, neither of which is this site */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: metaDescription(post.seo.description, post.excerpt),
          datePublished: post.date || undefined,
          dateModified: post.modified || post.date || undefined,
          image: post.image ? [post.image.src] : undefined,
          author: { "@type": post.author ? "Person" : "Organization", name: post.author || site.name },
          publisher: { "@type": "Organization", name: site.name, url: site.url },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${slug}` },
        }}
      />

      <PageHero
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${slug}` },
        ]}
        eyebrow={post.categories[0]?.name ?? "Blog"}
        title={post.title}
        lede={post.excerpt || undefined}
        highlights={[
          ...(published ? [{ label: words.published_label, value: published }] : []),
          ...(post.author ? [{ label: words.author_label, value: post.author }] : []),
          ...(post.categories.length ? [{ label: "Filed under", value: post.categories.map((c) => c.name).join(" · ") }] : []),
        ]}
      />

      {post.image ? (
        <section className="container-x pb-14 pt-14 md:pb-20 md:pt-20" aria-label={`${post.title} illustration`}>
          <div className="card shadow-float overflow-hidden" data-reveal>
            <div className="relative aspect-[16/9] bg-raised">
              <Image src={post.image.src} alt={post.image.alt || post.title} fill sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover" priority />
            </div>
          </div>
        </section>
      ) : null}

      <section id="post" aria-labelledby="post-title" className="border-b border-line bg-surface">
        <div className="container-x grid gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <h2 id="post-title" className="sr-only">
              {post.title}
            </h2>
            {/* the editor's own HTML: headings, lists and links, styled by .prose-site */}
            <div className="prose-site max-w-[68ch]" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <aside className="lg:col-span-4" aria-label="About this post">
            <div className="card sticky top-28 p-7">
              <p className="eyebrow">{words.card_title}</p>
              <dl className="mt-5 space-y-4 text-[15px]">
                {published ? (
                  <div>
                    <dt className="mono text-[12px] uppercase tracking-[0.08em] text-muted">{words.published_label}</dt>
                    <dd className="mt-1 text-ink">
                      <time dateTime={post.date}>{published}</time>
                    </dd>
                  </div>
                ) : null}
                {post.author ? (
                  <div>
                    <dt className="mono text-[12px] uppercase tracking-[0.08em] text-muted">{words.author_label}</dt>
                    <dd className="mt-1 text-ink">{post.author}</dd>
                  </div>
                ) : null}
              </dl>
              {post.categories.length ? (
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {post.categories.map((c) => (
                    <li key={c.slug}>
                      <Chip>{c.name}</Chip>
                    </li>
                  ))}
                </ul>
              ) : null}
              {words.card_text ? <p className="mt-6 text-[15px] leading-relaxed text-muted">{words.card_text}</p> : null}
              <div className="mt-6">
                <Button href={chrome.cta.primary.href}>{chrome.cta.primary.label}</Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {others.length ? (
        <section id="more" aria-labelledby="more-title" className="border-b border-line">
          <div className="container-x py-16 md:py-20">
            <h2 id="more-title" className="display display-lg max-w-[18ch]">
              {words.more_heading}
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <article className="card card-lift shadow-soft h-full p-6">
                    {p.categories.length ? <span className="eyebrow">{p.categories[0].name}</span> : null}
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.01em] text-ink">
                      <Link href={`/blog/${p.slug}`} prefetch={false} className="transition-colors hover:text-accent">
                        {p.title}
                      </Link>
                    </h3>
                    {p.excerpt ? <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.excerpt}</p> : null}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
