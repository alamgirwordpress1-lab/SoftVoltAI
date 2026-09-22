import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { BlogList } from "@/components/sections/BlogList";
import { CtaBand } from "@/components/sections/CtaBand";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { blogCopy } from "@/content/copy/blog";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import type { WpPostCard } from "@/lib/cms/wordpress";

/** A topic added after the last build renders on first request, then caches. */
export const dynamicParams = true;

/** Every category and tag the posts are filed under, by slug. */
async function topics() {
  const posts = await cms.getPosts(100);
  const names = new Map<string, string>();
  for (const post of posts) for (const t of [...post.categories, ...post.tags]) names.set(t.slug, t.name);
  return { posts, names };
}

const filed = (posts: WpPostCard[], slug: string) => posts.filter((p) => [...p.categories, ...p.tags].some((t) => t.slug === slug));

export async function generateStaticParams() {
  const { names } = await topics();
  return [...names.keys()].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { names } = await topics();
  const name = names.get(slug);
  if (!name) return {};
  const copy = await getCopy(blogCopy, { topic: name });
  return {
    title: copy.topic.heading,
    description: copy.topic.lede,
    alternates: { canonical: `/blog/topic/${slug}` },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts, names } = await topics();
  const name = names.get(slug);
  if (!name) notFound();

  const shown = filed(posts, slug);
  const copy = await getCopy(blogCopy, { topic: name, count: String(shown.length) });

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Blog", href: "/blog" },
          { name, href: `/blog/topic/${slug}` },
        ]}
        eyebrow={copy.topic.eyebrow}
        title={copy.topic.heading}
        lede={copy.topic.lede}
      >
        {copy.topic.back.text ? <ArrowLink href={copy.topic.back.url}>{copy.topic.back.text}</ArrowLink> : null}
      </PageHero>

      <BlogList posts={shown} heading={copy.topic.heading_list} allLabel={copy.posts.filter_all} readMore={copy.posts.read_more} />

      <CtaBand copy={copy.cta} />
    </>
  );
}
