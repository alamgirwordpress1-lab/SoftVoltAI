import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Chip } from "@/components/ui/Chip";
import { JsonLd } from "@/components/seo/JsonLd";
import { PostAside } from "@/components/sections/PostAside";
import { PostComments } from "@/components/sections/PostComments";
import { PostNav } from "@/components/sections/PostNav";
import { site } from "@/content/site";
import { shareMetadata } from "@/lib/seo/share";
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
    // the card itself, featured image included, is this folder's opengraph-image
    ...shareMetadata({
      title: post.seo.ogTitle || post.title,
      description: post.seo.ogDescription || description,
      path: `/blog/${slug}`,
      article: { publishedTime: post.date || undefined, modifiedTime: post.modified || undefined },
    }),
  };
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** About 200 words a minute, counted from the post's own words. */
function readingMinutes(html: string) {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await cms.getPost(slug);
  if (!post) notFound();

  const [all, chrome, copy] = await Promise.all([cms.getPosts(24), getSiteChrome(), getCopy(blogCopy)]);
  const words = copy.post;

  // getPosts returns newest first, so the post before this one in the list is
  // the newer one and the post after it is the older one
  const index = all.findIndex((p) => p.slug === slug);
  const newer = index > 0 ? all[index - 1] : null;
  const older = index >= 0 && index < all.length - 1 ? all[index + 1] : null;
  const recent = all.filter((p) => p.slug !== slug).slice(0, 4);
  const categories = Array.from(new Map(all.flatMap((p) => p.categories).map((c) => [c.slug, c])).values());

  const published = post.date ? dateFormat.format(new Date(post.date)) : "";
  const minutes = words.reading_time.replace("{minutes}", String(readingMinutes(post.content)));

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
          commentCount: post.comments.length || undefined,
        }}
      />

      {/* the same banner on every post: the post's own title belongs to the
          article below it, where a reader expects to find it */}
      <PageHero
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${slug}` },
        ]}
        eyebrow={copy.post_banner.eyebrow}
        title={copy.post_banner.heading}
        lede={copy.post_banner.lede}
        titleAs="p"
      />

      <div className="container-x grid gap-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-14">
        <article className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2" data-reveal>
            {post.categories.length ? <Chip>{post.categories[0].name}</Chip> : null}
            <span className="mono text-[12px] uppercase tracking-[0.08em] text-muted">
              {published ? <time dateTime={post.date}>{published}</time> : null}
              {published && minutes ? " · " : null}
              {minutes}
            </span>
          </div>

          <h1 className="display display-lg mt-5 max-w-[24ch]" data-reveal>
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="lede mt-5 max-w-[62ch]" data-reveal>
              {post.excerpt}
            </p>
          ) : null}

          {post.image ? (
            <figure className="mt-9 overflow-hidden rounded-lg border border-line bg-raised" data-reveal>
              <div className="relative aspect-[16/9]">
                <Image src={post.image.src} alt={post.image.alt || post.title} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" priority />
              </div>
            </figure>
          ) : null}

          {/* the editor's own HTML: headings, lists and links, styled by .prose-site */}
          <div className="prose-site mt-10 max-w-[68ch]" dangerouslySetInnerHTML={{ __html: post.content }} />

          <PostComments postId={post.id} open={post.commentsOpen} comments={post.comments} copy={copy.post_comments} />

          <PostNav previous={older} next={newer} labels={{ previous: words.prev_label, next: words.next_label }} />
        </article>

        <PostAside
          post={post}
          recent={recent}
          categories={categories}
          cta={chrome.cta.primary}
          copy={{
            published_label: words.published_label,
            updated_label: words.updated_label,
            author_label: words.author_label,
            filed_label: words.filed_label,
            card_title: words.card_title,
            recent_heading: words.recent_heading,
            categories_heading: words.categories_heading,
            cta_heading: words.cta_heading,
            cta_text: words.cta_text,
          }}
        />
      </div>
    </>
  );
}
