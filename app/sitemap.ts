import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { cms } from "@/lib/cms";

/** Top-level paths this app owns; a WordPress page with the same slug is never reachable. */
const RESERVED = new Set(["about", "api", "blog", "case-studies", "contact", "for", "home", "not-found", "partner-programme", "preview", "products", "rates", "security", "services", "thank-you"]);

/**
 * When the site's own content last changed, for the times WordPress cannot say
 * (no CMS, or one with nothing in it). A fixed day, moved by hand when the
 * copy in /content changes. Never the build time: a lastmod that moves on
 * every deploy tells a crawler nothing, and it learns to ignore it.
 */
const CONTENT_UPDATED = "2026-10-16";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, agencyTypes, products, work, wp] = await Promise.all([cms.getServices(), cms.getAgencyTypes(), cms.getProducts(), cms.getWork(), cms.getWpSlugs()]);

  // the newest edit anywhere in WordPress stands for the hub and designed pages,
  // which list or quote that content; without WordPress, the date above
  const dates = [...(wp?.services ?? []), ...(wp?.agencyTypes ?? []), ...(wp?.caseStudies ?? []), ...(wp?.posts ?? []), ...(wp?.pages ?? [])]
    .map((entry) => entry.modified)
    .filter((modified) => !Number.isNaN(Date.parse(modified)));
  const updated = dates.reduce((newest, modified) => (Date.parse(modified) > Date.parse(newest) ? modified : newest), dates[0] ?? CONTENT_UPDATED);

  /** Each entry's own modified date, by slug, for the pages built from one WordPress entry. */
  const modifiedBySlug = (entries: { slug: string; modified: string }[] | undefined) => new Map((entries ?? []).filter((e) => e.modified).map((e) => [e.slug, e.modified]));
  const serviceDates = modifiedBySlug(wp?.services);
  const agencyTypeDates = modifiedBySlug(wp?.agencyTypes);
  const caseStudyDates = modifiedBySlug(wp?.caseStudies);

  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly", lastModified: Date | string = updated) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  // Posts and pages live only in WordPress, so their own modified dates are the
  // honest lastModified; so are a service's, an agency type's and a case study's.
  const posts = wp?.posts ?? [];
  const wpPages = (wp?.pages ?? []).filter((p) => !RESERVED.has(p.uri.replace(/^\//, "").split("/")[0]));
  return [
    page("/", 1, "weekly"),
    page("/services", 0.9, "weekly"),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8, "monthly", serviceDates.get(s.slug) || updated)),
    page("/for", 0.8),
    ...agencyTypes.map((a) => page(`/for/${a.slug}`, 0.7, "monthly", agencyTypeDates.get(a.slug) || updated)),
    page("/products", 0.7),
    ...products.map((p) => page(`/products/${p.slug}`, 0.7)),
    page("/case-studies", 0.8),
    ...work.map((w) => page(`/case-studies/${w.slug}`, 0.6, "monthly", caseStudyDates.get(w.slug) || updated)),
    page("/rates", 0.7),
    page("/security", 0.5),
    page("/partner-programme", 0.6),
    page("/about", 0.5),
    page("/contact", 0.8),
    ...(posts.length ? [page("/blog", 0.6, "weekly")] : []),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.5, "monthly", p.modified || updated)),
    ...wpPages.map((p) => page(p.uri, 0.4, "monthly", p.modified || updated)),
  ];
}
