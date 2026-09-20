import "server-only";
import type { AgencyType, Client, EngagementModel, Faq, PillarGroup, Pillar, ProcessStep, Promise as SitePromise, Service, ServiceDetail, Testimonial, WorkItem } from "@/lib/cms/types";
import type { TeamMember } from "@/content/founder";
import { lines, plain, wpTry } from "@/lib/wp/client";
import { AGENCY_TYPES, ALL_SLUGS, CASE_STUDIES, MENUS, PAGE_BY_URI, POST_BY_SLUG, POSTS, SERVICES, SIMPLE_COLLECTIONS, SITE_SETTINGS } from "@/lib/wp/queries";

/**
 * WordPress, mapped onto the types the pages already use.
 *
 * Nothing above this file knows where content comes from: every function here
 * returns exactly what the matching file in /content returns, or null when
 * WordPress has nothing to say — at which point lib/cms/index.ts uses the
 * local content instead. That is what makes the migration safe to do one
 * content type at a time.
 */

const PILLARS: Pillar[] = ["build", "automate", "grow", "support"];
const isPillar = (value: string): value is Pillar => (PILLARS as string[]).includes(value);

/* ------------------------------------------------------------------ header */

export interface WpLink {
  label: string;
  href: string;
}

export interface WpSettings {
  brandName: string;
  tagline: string;
  description: string;
  email: string;
  location: string;
  timeZone: string;
  utcOffset: string;
  calUrl: string;
  siteUrl: string;
  markets: string[];
  footerBlurb: string;
  footerNote: string;
  socialLinks: WpLink[];
  ctaPrimary: WpLink;
  ctaSecondary: WpLink;
  headerCta: WpLink;
  cf7BriefId: string;
  cf7ContactId: string;
}

export async function wpSettings(): Promise<WpSettings | null> {
  const data = await wpTry<{ siteSettings: WpSettings | null }>(SITE_SETTINGS, { tags: ["wp:settings"] });
  return data?.siteSettings?.brandName ? data.siteSettings : null;
}

export interface WpMenuItem extends WpLink {
  description?: string;
  external?: boolean;
  children: WpMenuItem[];
}

interface RawMenuItem {
  id: string;
  label: string;
  uri: string | null;
  url: string | null;
  target: string | null;
  description: string | null;
  childItems?: { nodes: RawMenuItem[] };
}

/** A WordPress menu URL is absolute; the front end wants a path of its own. */
function menuHref(item: RawMenuItem, siteUrl: string): { href: string; external: boolean } {
  const raw = item.uri || item.url || "/";
  if (/^https?:\/\//i.test(raw)) {
    const inside = siteUrl && raw.startsWith(siteUrl);
    return inside ? { href: raw.slice(siteUrl.length) || "/", external: false } : { href: raw, external: true };
  }
  return { href: raw.startsWith("/") ? raw : `/${raw}`, external: false };
}

function toMenuItem(item: RawMenuItem, siteUrl: string): WpMenuItem {
  const { href, external } = menuHref(item, siteUrl);
  return {
    label: plain(item.label),
    href,
    external,
    description: item.description ? plain(item.description) : undefined,
    children: (item.childItems?.nodes ?? []).map((child) => toMenuItem(child, siteUrl)),
  };
}

export async function wpMenus(siteUrl = ""): Promise<Record<string, WpMenuItem[]> | null> {
  const data = await wpTry<{ menus: { nodes: { locations: string[] | null; menuItems: { nodes: RawMenuItem[] } }[] } }>(MENUS, { tags: ["wp:menus"] });
  const nodes = data?.menus?.nodes ?? [];
  if (!nodes.length) return null;

  const byLocation: Record<string, WpMenuItem[]> = {};
  for (const menu of nodes) {
    for (const location of menu.locations ?? []) {
      byLocation[location.toLowerCase()] = (menu.menuItems?.nodes ?? []).map((item) => toMenuItem(item, siteUrl));
    }
  }
  return Object.keys(byLocation).length ? byLocation : null;
}

/* ---------------------------------------------------------------- services */

interface RawService {
  slug: string;
  title: string;
  orderIndex: number;
  pillars: { nodes: { slug: string; name: string; description: string | null }[] };
  serviceFields: {
    heading: string | null;
    summary: string | null;
    intro: string | null;
    deliverables: string | null;
    signals: string | null;
    stack: string | null;
    seoDescription: string | null;
    agencyTypes: { nodes: { slug: string }[] } | null;
  } | null;
}

export interface WpServices {
  pillars: PillarGroup[];
  services: Service[];
  details: Record<string, ServiceDetail>;
}

export async function wpServices(): Promise<WpServices | null> {
  const data = await wpTry<{ services: { nodes: RawService[] } }>(SERVICES, { tags: ["wp:service"] });
  const nodes = data?.services?.nodes ?? [];
  if (!nodes.length) return null;

  const services: Service[] = [];
  const details: Record<string, ServiceDetail> = {};
  const groups = new Map<Pillar, PillarGroup>();

  for (const node of nodes) {
    const term = node.pillars?.nodes?.[0];
    const pillar = term && isPillar(term.slug) ? term.slug : "build";
    const fields = node.serviceFields;

    const service: Service = {
      slug: node.slug,
      name: plain(node.title),
      pillar,
      summary: plain(fields?.summary ?? ""),
    };
    services.push(service);

    details[node.slug] = {
      title: plain(fields?.heading ?? node.title),
      intro: plain(fields?.intro ?? ""),
      deliverables: lines(fields?.deliverables),
      signals: lines(fields?.signals),
      stack: lines(fields?.stack),
      seo: plain(fields?.seoDescription ?? ""),
      agencyTypes: (fields?.agencyTypes?.nodes ?? []).map((a) => a.slug),
    };

    if (term && isPillar(term.slug) && !groups.has(pillar)) {
      groups.set(pillar, { id: pillar, name: plain(term.name), tagline: plain(term.description ?? ""), services: [] });
    }
    groups.get(pillar)?.services.push(service);
  }

  // the four pillars keep their published order, whatever order the terms came back in
  const pillars = PILLARS.map((id) => groups.get(id)).filter((group): group is PillarGroup => Boolean(group));
  return { pillars, services, details };
}

/* ----------------------------------------------------------- agency types */

interface RawAgencyType {
  slug: string;
  title: string;
  agencyTypeFields: {
    problem: string | null;
    relief: string | null;
    intro: string | null;
    workflow: string | null;
    seoDescription: string | null;
    services: { nodes: { slug: string }[] } | null;
  } | null;
}

export async function wpAgencyTypes(): Promise<AgencyType[] | null> {
  const data = await wpTry<{ agencyTypes: { nodes: RawAgencyType[] } }>(AGENCY_TYPES, { tags: ["wp:agency_type"] });
  const nodes = data?.agencyTypes?.nodes ?? [];
  if (!nodes.length) return null;

  return nodes.map((node) => ({
    slug: node.slug,
    name: plain(node.title),
    problem: plain(node.agencyTypeFields?.problem ?? ""),
    relief: plain(node.agencyTypeFields?.relief ?? ""),
    intro: plain(node.agencyTypeFields?.intro ?? ""),
    services: (node.agencyTypeFields?.services?.nodes ?? []).map((s) => s.slug),
    workflow: lines(node.agencyTypeFields?.workflow),
    seo: plain(node.agencyTypeFields?.seoDescription ?? ""),
  }));
}

/* ------------------------------------------------------------ case studies */

interface RawCaseStudy {
  slug: string;
  title: string;
  featuredImage: { node: { sourceUrl: string; altText: string | null } } | null;
  workCategories: { nodes: { name: string }[] };
  regions: { nodes: { name: string }[] };
  caseStudyFields: {
    client: string | null;
    role: string | null;
    summary: string | null;
    delivered: string | null;
    stack: string | null;
    liveUrl: string | null;
  } | null;
}

export interface WpWork {
  work: WorkItem[];
  categories: string[];
}

export async function wpWork(): Promise<WpWork | null> {
  const data = await wpTry<{ caseStudies: { nodes: RawCaseStudy[] } }>(CASE_STUDIES, { tags: ["wp:case_study"] });
  const nodes = data?.caseStudies?.nodes ?? [];
  if (!nodes.length) return null;

  const work: WorkItem[] = nodes.map((node) => ({
    slug: node.slug,
    title: plain(node.title),
    client: plain(node.caseStudyFields?.client ?? ""),
    region: plain(node.regions?.nodes?.[0]?.name ?? ""),
    category: plain(node.workCategories?.nodes?.[0]?.name ?? ""),
    summary: plain(node.caseStudyFields?.summary ?? ""),
    stack: lines(node.caseStudyFields?.stack),
    url: node.caseStudyFields?.liveUrl || undefined,
    image: node.featuredImage?.node?.sourceUrl || undefined,
    role: plain(node.caseStudyFields?.role ?? ""),
    delivered: lines(node.caseStudyFields?.delivered),
  }));

  // "All" first, then the categories in the order the builds are published in
  const categories = ["All", ...[...new Set(work.map((w) => w.category).filter(Boolean))]];
  return { work, categories };
}

/* ------------------------------------------------------ everything smaller */

interface RawSimple {
  processSteps: { nodes: { slug: string; title: string; processStepFields: { stepKey: string | null; turnaround: string | null; summary: string | null; artefact: string | null } | null }[] };
  plans: { nodes: { slug: string; title: string; planFields: { planKey: string | null; bestFor: string | null; includes: string | null; priceFrom: string | null; period: string | null; badge: string | null } | null }[] };
  faqs: { nodes: { slug: string; title: string; faqGroups: { nodes: { slug: string }[] }; faqFields: { answer: string | null } | null }[] };
  promises: { nodes: { slug: string; title: string; promiseFields: { promiseKey: string | null; detail: string | null } | null }[] };
  clauses: { nodes: { slug: string; title: string; clauseFields: { body: string | null } | null }[] };
  teamMembers: { nodes: { slug: string; title: string; featuredImage: { node: { sourceUrl: string } } | null; teamFields: { role: string | null; headline: string | null; bio: string | null; quote: string | null; facts: string | null; linkedin: string | null } | null }[] };
  testimonials: { nodes: { slug: string; title: string; testimonialFields: { quote: string | null; personName: string | null; personRole: string | null; agency: string | null; country: string | null; work: string | null; consent: string | null } | null }[] };
  clients: { nodes: { slug: string; title: string; featuredImage: { node: { sourceUrl: string } } | null; clientFields: { country: string | null; work: string | null; url: string | null; featured: boolean | null; logoFill: boolean | null } | null }[] };
}

export interface WpCollections {
  process: ProcessStep[];
  plans: EngagementModel[];
  faqs: Faq[];
  pricingFaqs: Faq[];
  promises: SitePromise[];
  clauses: { title: string; body: string }[];
  team: TeamMember[];
  testimonials: Testimonial[];
  clients: Client[];
  featuredClients: { id: string; name: string; work: string; country: Client["country"]; logo?: string; logoFill?: boolean }[];
}

export async function wpCollections(): Promise<WpCollections | null> {
  const data = await wpTry<RawSimple>(SIMPLE_COLLECTIONS, { tags: ["wp:process_step", "wp:plan", "wp:faq", "wp:promise", "wp:clause", "wp:team_member", "wp:testimonial", "wp:client"] });
  if (!data) return null;

  const faqNodes = data.faqs?.nodes ?? [];
  const isPricing = (node: (typeof faqNodes)[number]) => (node.faqGroups?.nodes ?? []).some((g) => g.slug === "pricing" || g.slug === "rates");

  const collections: WpCollections = {
    process: (data.processSteps?.nodes ?? []).map((node) => ({
      id: node.processStepFields?.stepKey || node.slug,
      name: plain(node.title),
      turnaround: plain(node.processStepFields?.turnaround ?? ""),
      summary: plain(node.processStepFields?.summary ?? ""),
      artefact: node.processStepFields?.artefact || node.slug,
    })),
    plans: (data.plans?.nodes ?? []).map((node) => ({
      id: node.planFields?.planKey || node.slug,
      name: plain(node.title),
      bestFor: plain(node.planFields?.bestFor ?? ""),
      includes: lines(node.planFields?.includes),
      // an empty price is a quote-only tier, which the front end renders as "Let us talk"
      from: node.planFields?.priceFrom ? plain(node.planFields.priceFrom) : null,
      period: node.planFields?.period ? plain(node.planFields.period) : undefined,
      badge: node.planFields?.badge ? plain(node.planFields.badge) : undefined,
    })),
    faqs: faqNodes.filter((node) => !isPricing(node)).map((node) => ({ q: plain(node.title), a: plain(node.faqFields?.answer ?? "") })),
    pricingFaqs: faqNodes.filter(isPricing).map((node) => ({ q: plain(node.title), a: plain(node.faqFields?.answer ?? "") })),
    promises: (data.promises?.nodes ?? []).map((node) => ({
      id: node.promiseFields?.promiseKey || node.slug,
      label: plain(node.title),
      detail: plain(node.promiseFields?.detail ?? ""),
    })),
    clauses: (data.clauses?.nodes ?? []).map((node) => ({ title: plain(node.title), body: plain(node.clauseFields?.body ?? "") })),
    team: (data.teamMembers?.nodes ?? []).map((node) => ({
      name: plain(node.title),
      role: plain(node.teamFields?.role ?? ""),
      photo: node.featuredImage?.node?.sourceUrl ?? "",
      headline: node.teamFields?.headline ? plain(node.teamFields.headline) : undefined,
      bio: node.teamFields?.bio ? plain(node.teamFields.bio) : undefined,
      quote: node.teamFields?.quote ? plain(node.teamFields.quote) : undefined,
      facts: lines(node.teamFields?.facts),
      linkedin: node.teamFields?.linkedin ?? "",
    })),
    // a testimonial without a recorded permission is not published, ever
    testimonials: (data.testimonials?.nodes ?? [])
      .filter((node) => Boolean(node.testimonialFields?.consent?.trim()))
      .map((node) => ({
        quote: plain(node.testimonialFields?.quote ?? ""),
        name: plain(node.testimonialFields?.personName ?? ""),
        role: plain(node.testimonialFields?.personRole ?? ""),
        agency: plain(node.testimonialFields?.agency ?? ""),
        country: plain(node.testimonialFields?.country ?? ""),
        work: plain(node.testimonialFields?.work ?? ""),
      })),
    clients: (data.clients?.nodes ?? []).map((node) => ({
      name: plain(node.title),
      country: (plain(node.clientFields?.country ?? "UK") as Client["country"]) || "UK",
      work: plain(node.clientFields?.work ?? ""),
      url: node.clientFields?.url || undefined,
    })),
    featuredClients: (data.clients?.nodes ?? [])
      .filter((node) => node.clientFields?.featured)
      .map((node) => ({
        id: node.slug,
        name: plain(node.title),
        work: plain(node.clientFields?.work ?? ""),
        country: (plain(node.clientFields?.country ?? "UK") as Client["country"]) || "UK",
        logo: node.featuredImage?.node?.sourceUrl || undefined,
        logoFill: node.clientFields?.logoFill ?? undefined,
      })),
  };

  return collections;
}

/* -------------------------------------------------------- posts and pages */

/**
 * What Yoast knows about one entry. Only the description and the social
 * strings are used: the title and the canonical Yoast builds carry the CMS's
 * own site name and hostname, which are not this site's.
 */
export interface WpSeo {
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface WpImage {
  src: string;
  alt: string;
}

export interface WpPostCard {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 8601, UTC. */
  date: string;
  modified: string;
  image: WpImage | null;
  categories: { name: string; slug: string }[];
  author: string;
}

export interface WpPost extends WpPostCard {
  /** The editor's HTML, rendered inside .prose-site. */
  content: string;
  seo: WpSeo;
}

export interface WpPage {
  slug: string;
  title: string;
  content: string;
  modified: string;
  image: WpImage | null;
  /** The opener, from the Page fields group; the title is used when they are empty. */
  eyebrow: string;
  lede: string;
  /** The first lines of the content — a meta description for a page that has none. */
  excerpt: string;
  intro: { title: string; subtitle: string; body: string[] } | null;
  seo: WpSeo;
}

interface RawSeo {
  title: string | null;
  metaDesc: string | null;
  canonical: string | null;
  opengraphTitle: string | null;
  opengraphDescription: string | null;
  schema: { raw: string | null } | null;
}

interface RawImage {
  node: { sourceUrl: string; altText: string | null } | null;
}

interface RawPost {
  slug: string;
  title: string;
  content?: string | null;
  excerpt: string | null;
  dateGmt: string | null;
  modifiedGmt: string | null;
  featuredImage: RawImage | null;
  categories: { nodes: { name: string; slug: string }[] } | null;
  author: { node: { name: string } | null } | null;
  seo?: RawSeo | null;
}

/** WPGraphQL returns GMT without the marker, so it has to be said explicitly. */
function gmt(value: string | null | undefined): string {
  if (!value) return "";
  return /(Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}Z`;
}

function toSeo(raw: RawSeo | null | undefined): WpSeo {
  return {
    description: plain(raw?.metaDesc ?? ""),
    ogTitle: plain(raw?.opengraphTitle ?? ""),
    ogDescription: plain(raw?.opengraphDescription ?? ""),
  };
}

function toImage(raw: RawImage | null | undefined): WpImage | null {
  const node = raw?.node;
  return node?.sourceUrl ? { src: node.sourceUrl, alt: plain(node.altText ?? "") } : null;
}

function toCard(node: RawPost): WpPostCard {
  return {
    slug: node.slug,
    title: plain(node.title),
    excerpt: plain(node.excerpt ?? ""),
    date: gmt(node.dateGmt),
    modified: gmt(node.modifiedGmt),
    image: toImage(node.featuredImage),
    categories: (node.categories?.nodes ?? []).map((c) => ({ name: plain(c.name), slug: c.slug })),
    author: plain(node.author?.node?.name ?? ""),
  };
}

/** The blog index. An empty blog returns an empty list, not null: that is not a failure. */
export async function wpPosts(first = 24): Promise<WpPostCard[] | null> {
  const data = await wpTry<{ posts: { nodes: RawPost[] } }>(POSTS, { variables: { first }, tags: ["wp:post"] });
  if (!data?.posts) return null;
  return (data.posts.nodes ?? []).map(toCard);
}

export async function wpPost(slug: string, preview = false): Promise<WpPost | null> {
  const data = await wpTry<{ post: RawPost | null }>(POST_BY_SLUG, { variables: { slug }, tags: ["wp:post", `wp:post:${slug}`], preview });
  const node = data?.post;
  if (!node) return null;
  return { ...toCard(node), content: node.content ?? "", seo: toSeo(node.seo) };
}

interface RawPage {
  slug: string;
  title: string;
  content: string | null;
  modifiedGmt: string | null;
  featuredImage: RawImage | null;
  pageFields: { eyebrow: string | null; lede: string | null; introTitle: string | null; introSubtitle: string | null; introBody: string | null } | null;
  seo: RawSeo | null;
}

/** The opening of a page's own text, cut on a word so it does not end mid-syllable. */
function summarise(html: string, limit = 155): string {
  const text = plain(html).replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—-]+$/, "")}…`;
}

/** WordPress stores a path; the permalink filter hands back a front-end URL. Both are accepted. */
export function pageUri(value: string): string {
  const path = value.replace(/^https?:\/\/[^/]+/, "");
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

export async function wpPage(uri: string): Promise<WpPage | null> {
  const path = pageUri(uri);
  const data = await wpTry<{ page: RawPage | null }>(PAGE_BY_URI, { variables: { uri: path }, tags: ["wp:page", `wp:page:${path.slice(1)}`] });
  const node = data?.page;
  if (!node) return null;

  const fields = node.pageFields;
  const body = lines(fields?.introBody);
  return {
    slug: node.slug,
    title: plain(node.title),
    content: node.content ?? "",
    modified: gmt(node.modifiedGmt),
    image: toImage(node.featuredImage),
    eyebrow: plain(fields?.eyebrow ?? ""),
    lede: plain(fields?.lede ?? ""),
    excerpt: summarise(node.content ?? ""),
    intro: fields?.introTitle ? { title: plain(fields.introTitle), subtitle: plain(fields.introSubtitle ?? ""), body } : null,
    seo: toSeo(node.seo),
  };
}

export interface WpSlugs {
  services: { slug: string; modified: string }[];
  agencyTypes: { slug: string; modified: string }[];
  caseStudies: { slug: string; modified: string }[];
  posts: { slug: string; modified: string }[];
  pages: { uri: string; modified: string }[];
}

/** Everything WordPress publishes, for the sitemap and for static generation. */
export async function wpSlugs(): Promise<WpSlugs | null> {
  const data = await wpTry<{
    services: { nodes: { slug: string; modifiedGmt: string | null }[] };
    agencyTypes: { nodes: { slug: string; modifiedGmt: string | null }[] };
    caseStudies: { nodes: { slug: string; modifiedGmt: string | null }[] };
    posts: { nodes: { slug: string; modifiedGmt: string | null }[] };
    pages: { nodes: { uri: string; modifiedGmt: string | null }[] };
  }>(ALL_SLUGS, { tags: ["wp:all"] });
  if (!data) return null;

  const list = (nodes: { slug: string; modifiedGmt: string | null }[] | undefined) => (nodes ?? []).map((n) => ({ slug: n.slug, modified: gmt(n.modifiedGmt) }));
  return {
    services: list(data.services?.nodes),
    agencyTypes: list(data.agencyTypes?.nodes),
    caseStudies: list(data.caseStudies?.nodes),
    posts: list(data.posts?.nodes),
    pages: (data.pages?.nodes ?? []).map((n) => ({ uri: pageUri(n.uri), modified: gmt(n.modifiedGmt) })),
  };
}
