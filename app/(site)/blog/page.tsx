import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { Button } from "@/components/ui/Button";
import { BlogList } from "@/components/sections/BlogList";
import { FeaturedPost } from "@/components/sections/FeaturedPost";
import { CtaBand } from "@/components/sections/CtaBand";
import { bannerProps, introProps } from "@/components/ui/copy-props";
import { blogCopy } from "@/content/copy/blog";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

export async function generateMetadata(): Promise<Metadata> {
  return copyMetadata(blogCopy);
}

export default async function BlogPage() {
  const posts = await cms.getPosts(24);
  // the words are the WordPress page "Blog"; {count} is the number of posts
  const copy = await getCopy(blogCopy, { count: String(posts.length) });

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero crumbs={[{ name: "Blog", href: "/blog" }]} {...bannerProps(copy.banner)} />

      <PageIntro {...introProps(copy.intro)} />

      {featured ? <FeaturedPost post={featured} eyebrow={copy.posts.featured_eyebrow} readMore={copy.posts.read_more} /> : null}

      {rest.length ? <BlogList posts={rest} heading={copy.posts.heading} allLabel={copy.posts.filter_all} readMore={copy.posts.read_more} /> : null}

      {/* nothing published yet: say so, and point at the work that is */}
      {!featured ? (
        <section className="container-x py-16 md:py-24" aria-labelledby="empty-title">
          <h2 id="empty-title" className="display display-lg max-w-[18ch]">
            {copy.posts.empty_heading}
          </h2>
          <div className="card mt-8 max-w-[60ch] p-8">
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
        </section>
      ) : null}

      <CtaBand copy={copy.cta} />
    </>
  );
}
