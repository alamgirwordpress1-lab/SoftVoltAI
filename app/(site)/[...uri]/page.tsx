import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { PageIntro } from "@/components/ui/PageIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { cms } from "@/lib/cms";

/**
 * Whatever an editor publishes as a WordPress page.
 *
 * This route only ever sees a path no file in app/ matched, so the designed
 * pages always win and a page an editor adds in WordPress — a policy, a
 * landing page, a campaign — appears without a deploy.
 */

/** A page added after the last build renders on first request, then caches. */
export const dynamicParams = true;

/** Paths that belong to this app; a WordPress page cannot take one over. */
const RESERVED = new Set(["about", "api", "blog", "case-studies", "contact", "for", "partner-programme", "preview", "rates", "security", "services"]);

export async function generateStaticParams() {
  const slugs = await cms.getWpSlugs();
  return (slugs?.pages ?? [])
    .map((p) => p.uri.replace(/^\/+|\/+$/g, "").split("/"))
    .filter((segments) => segments.length > 0 && segments[0] !== "" && !RESERVED.has(segments[0]))
    .map((uri) => ({ uri }));
}

async function read(uri: string[]) {
  if (!uri.length || RESERVED.has(uri[0])) return null;
  return cms.getPage(`/${uri.join("/")}`);
}

export async function generateMetadata({ params }: { params: Promise<{ uri: string[] }> }): Promise<Metadata> {
  const { uri } = await params;
  const page = await read(uri);
  if (!page) return {};
  const path = `/${uri.join("/")}`;
  // Yoast first, then the editor's lede, then the page's own opening lines: a
  // page an editor added in a hurry still reaches search with a description.
  const description = page.seo.description || page.lede || page.excerpt;
  return {
    title: page.title,
    description: description || undefined,
    alternates: { canonical: path },
    openGraph: {
      title: page.seo.ogTitle || page.title,
      description: page.seo.ogDescription || description || undefined,
      url: `${site.url}${path}`,
      images: page.image ? [{ url: page.image.src }] : undefined,
    },
  };
}

export default async function WordPressPage({ params }: { params: Promise<{ uri: string[] }> }) {
  const { uri } = await params;
  const page = await read(uri);
  if (!page) notFound();
  const path = `/${uri.join("/")}`;
  const description = page.seo.description || page.lede || page.excerpt;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: description || undefined,
          url: `${site.url}${path}`,
          dateModified: page.modified || undefined,
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
        }}
      />

      <PageHero
        crumbs={[{ name: page.title, href: path }]}
        eyebrow={page.eyebrow || "SoftVolt AI"}
        title={page.title}
        lede={page.lede || undefined}
      />

      {page.intro ? (
        <PageIntro
          eyebrow={page.eyebrow || "In short"}
          title={page.intro.title}
          subtitle={page.intro.subtitle || undefined}
          body={page.intro.body.length ? page.intro.body.map((paragraph, i) => <span key={i}>{paragraph}</span>) : [<span key="0">{page.lede}</span>]}
        />
      ) : null}

      {page.image ? (
        <section className="container-x pt-14 md:pt-20" aria-label={`${page.title} image`}>
          <div className="card shadow-float overflow-hidden" data-reveal>
            <div className="relative aspect-[16/9] bg-raised">
              <Image src={page.image.src} alt={page.image.alt || page.title} fill sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover" priority />
            </div>
          </div>
        </section>
      ) : null}

      <section id="content" aria-labelledby="content-title" className="border-b border-line bg-surface">
        <div className="container-x py-16 md:py-24">
          <h2 id="content-title" className="sr-only">
            {page.title}
          </h2>
          {/* the editor's own HTML, styled by .prose-site */}
          <div className="prose-site max-w-[70ch]" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </section>
    </>
  );
}
