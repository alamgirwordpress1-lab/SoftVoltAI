import type { Metadata } from "next";
import { site } from "@/content/site";

interface Share {
  title: string;
  description?: string;
  /** The page's path, "/" for the home page. */
  path: string;
  /** "article" for a blog post, with its dates. */
  article?: { publishedTime?: string; modifiedTime?: string };
  /** Only for a route that cannot hold its own opengraph-image file. */
  image?: string;
}

/**
 * The Open Graph and X tags every page sends.
 *
 * Next merges metadata shallowly: a page that sets `openGraph` replaces the
 * layout's whole object, so the site name, locale and card size have to travel
 * with every page's own title. The picture comes from the opengraph-image file
 * in the page's folder, which outranks anything set here.
 */
export function shareMetadata({ title, description, path, article, image }: Share): Pick<Metadata, "openGraph" | "twitter"> {
  const url = `${site.url}${path === "/" ? "" : path}`;
  // An `images` key — even one left undefined — tells Next the page chose its
  // own picture, and the folder's opengraph-image is then dropped. So the key
  // only exists when there is a picture to give.
  const images = image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {};
  const common = { siteName: site.name, locale: "en_GB", title, description, url, ...images };
  return {
    openGraph: article ? { ...common, type: "article", ...article } : { ...common, type: "website" },
    twitter: { card: "summary_large_image", title, description, ...images },
  };
}
