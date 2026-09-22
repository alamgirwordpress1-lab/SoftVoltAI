import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { cms } from "@/lib/cms";

/** Top-level paths this app owns; a WordPress page with the same slug is never reachable. */
const RESERVED = new Set(["about", "api", "blog", "case-studies", "contact", "for", "home", "not-found", "partner-programme", "preview", "rates", "security", "services", "thank-you"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, agencyTypes, work, wp] = await Promise.all([cms.getServices(), cms.getAgencyTypes(), cms.getWork(), cms.getWpSlugs()]);
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly", lastModified: Date | string = now) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  // Posts and pages live only in WordPress, so their own modified dates are the
  // honest lastModified; the designed pages move with every deploy.
  const posts = wp?.posts ?? [];
  const wpPages = (wp?.pages ?? []).filter((p) => !RESERVED.has(p.uri.replace(/^\//, "").split("/")[0]));
  return [
    page("/", 1, "weekly"),
    page("/services", 0.9, "weekly"),
    ...services.map((s) => page(`/services/${s.slug}`, 0.8)),
    page("/for", 0.8),
    ...agencyTypes.map((a) => page(`/for/${a.slug}`, 0.7)),
    page("/case-studies", 0.8),
    ...work.map((w) => page(`/case-studies/${w.slug}`, 0.6)),
    page("/rates", 0.7),
    page("/security", 0.5),
    page("/partner-programme", 0.6),
    page("/about", 0.5),
    page("/contact", 0.8),
    ...(posts.length ? [page("/blog", 0.6, "weekly")] : []),
    ...posts.map((p) => page(`/blog/${p.slug}`, 0.5, "monthly", p.modified || now)),
    ...wpPages.map((p) => page(p.uri, 0.4, "monthly", p.modified || now)),
  ];
}
