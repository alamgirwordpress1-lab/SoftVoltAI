import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { cms } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, agencyTypes, work] = await Promise.all([cms.getServices(), cms.getAgencyTypes(), cms.getWork()]);
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
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
  ];
}
