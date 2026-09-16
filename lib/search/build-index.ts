/**
 * Builds the site search index from the same content the pages render.
 * Runs at build time only (app/search-index.json/route.ts is force-static).
 */
import { cms } from "@/lib/cms";
import { stack } from "@/content/stack";
import { searchPages, popularSearches, searchQuickLinks } from "@/content/search";
import { PLATFORMS } from "@/lib/forms/brief-schema";
import { normalize } from "@/lib/search/engine";
import type { SearchIndex, SearchItem } from "@/lib/search/types";

const firstSentence = (text: string) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
const unique = (list: string[]) => [...new Set(list.map((s) => s.trim()).filter(Boolean))];

export async function buildSearchIndex(): Promise<SearchIndex> {
  const [pillars, agencyTypes, work, workCategories, faqs, pricingFaqs, team] = await Promise.all([
    cms.getPillars(),
    cms.getAgencyTypes(),
    cms.getWork(),
    cms.getWorkCategories(),
    cms.getFaqs(),
    cms.getPricingFaqs(),
    cms.getTeam(),
  ]);

  const items: SearchItem[] = [];
  const serviceTools: string[] = [];

  for (const pillar of pillars) {
    for (const service of pillar.services) {
      const page = await cms.getService(service.slug);
      if (!page) continue;
      serviceTools.push(...page.stack);
      items.push({
        id: `service:${service.slug}`,
        kind: "service",
        title: page.title,
        name: service.name,
        url: `/services/${service.slug}`,
        description: service.summary,
        meta: pillar.name,
        keywords: unique([service.name, pillar.name, ...page.stack]),
        body: [page.intro, ...page.deliverables, ...page.signals].join(" "),
      });
    }
  }

  for (const type of agencyTypes) {
    items.push({
      id: `agency:${type.slug}`,
      kind: "agency",
      title: type.name,
      url: `/for/${type.slug}`,
      description: type.relief,
      meta: "Agency solution",
      keywords: unique([type.name]),
      body: [type.problem, type.intro, ...type.workflow].join(" "),
    });
  }

  for (const w of work) {
    items.push({
      id: `work:${w.slug}`,
      kind: "work",
      title: w.title,
      url: `/case-studies/${w.slug}`,
      description: firstSentence(w.summary),
      meta: `${w.region} · ${w.category}`,
      keywords: unique([w.category, w.client, w.region, ...w.stack]),
      body: [w.summary, w.role, ...w.delivered].join(" "),
    });
  }

  const teamWords = team.flatMap((m) => [m.name, m.role]);
  for (const page of searchPages) {
    items.push({
      id: `page:${page.url}`,
      kind: "page",
      title: page.title,
      url: page.url,
      description: page.description,
      meta: "Page",
      keywords: unique([...page.keywords, ...(page.url === "/about#founder" ? teamWords : [])]),
      body: "",
    });
  }

  faqs.forEach((f, i) => {
    items.push({ id: `faq:home:${i}`, kind: "faq", title: f.q, url: "/#faq", description: f.a, meta: "FAQ", keywords: [], body: "" });
  });
  pricingFaqs.forEach((f, i) => {
    items.push({ id: `faq:rates:${i}`, kind: "faq", title: f.q, url: "/rates#faq", description: f.a, meta: "FAQ · Rates", keywords: ["pricing"], body: "" });
  });

  // Autocomplete vocabulary: the names of things — services, tools, platforms,
  // projects, pages — not the generic words used only for matching. The first
  // spelling wins, so curated and proper-cased names come first.
  const candidates = new Map<string, string>();
  for (const name of [
    ...popularSearches,
    ...pillars.flatMap((p) => [p.name, ...p.services.map((s) => s.name)]),
    ...items.filter((i) => i.kind === "service").map((i) => i.title),
    ...stack.map((t) => t.name),
    ...serviceTools,
    ...work.flatMap((w) => w.stack),
    ...agencyTypes.map((a) => a.name),
    ...work.map((w) => w.title),
    ...workCategories.filter((c) => c !== "All"),
    ...searchPages.map((p) => p.title),
    ...PLATFORMS.filter((p) => p !== "Other"),
  ]) {
    const key = normalize(name);
    if (key && !candidates.has(key)) candidates.set(key, name.trim());
  }
  const haystacks = items.map((i) => ` ${normalize([i.title, ...i.keywords, i.description, i.body].join(" "))} `);
  const popular = new Set(popularSearches.map(normalize));
  const keywords = [...candidates]
    .map(([key, display], order) => ({ display, order, weight: haystacks.filter((h) => h.includes(` ${key}`)).length + (popular.has(key) ? 100 : 0) }))
    .filter((k) => k.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.display.length - b.display.length || a.order - b.order)
    .map((k) => k.display);

  return {
    items,
    keywords,
    popular: popularSearches,
    quickLinks: searchQuickLinks.map((url) => `page:${url}`),
  };
}
