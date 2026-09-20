/**
 * Content access layer. Pages import from here only.
 *
 * Two sources sit behind it. WordPress is asked first whenever WP_GRAPHQL_URL
 * is set; the typed files in /content answer whenever it is not, or whenever
 * WordPress has nothing for that collection yet. That is deliberate: content
 * can move across one type at a time, and a CMS that is down or half-migrated
 * never takes the site with it.
 */
import { cache } from "react";
import { pillars } from "@/content/pillars";
import { agencyTypes } from "@/content/agency-types";
import { process } from "@/content/process";
import { work, workCategories } from "@/content/work";
import { promises, protectionClauses } from "@/content/promises";
import { faqs, pricingFaqs } from "@/content/faqs";
import { stack, clocks, engagementModels } from "@/content/stack";
import { team } from "@/content/founder";
import { clientOrbit, clients, globeCards, globeLocations } from "@/content/clients";
import { placeholderClients } from "@/lib/cms/placeholder-clients";
import { comparison, comparisonSource } from "@/content/comparison";
import { testimonials } from "@/content/testimonials";
import { buildDetails } from "@/content/service-details-build";
import { automateDetails } from "@/content/service-details-automate";
import { growDetails } from "@/content/service-details-grow";
import { supportDetails } from "@/content/service-details-support";
import { wpAgencyTypes, wpCollections, wpPage, wpPost, wpPosts, wpServices, wpSlugs, wpWork } from "@/lib/cms/wordpress";
import type { Service, ServiceDetail, PillarGroup, AgencyType } from "@/lib/cms/types";

const details: Record<string, ServiceDetail> = { ...buildDetails, ...automateDetails, ...growDetails, ...supportDetails };
const services: Service[] = pillars.flatMap((p) => p.services);

/**
 * One WordPress read per collection per request, however many sections ask
 * for it. `cache` is request-scoped; the fetch layer caches across requests.
 */
const fromWpServices = cache(wpServices);
const fromWpAgencyTypes = cache(wpAgencyTypes);
const fromWpWork = cache(wpWork);
const fromWpCollections = cache(wpCollections);

export interface ServicePage extends Service, ServiceDetail {
  pillarGroup: PillarGroup;
  related: Service[];
  agencies: AgencyType[];
}

export const cms = {
  getPillars: async (): Promise<PillarGroup[]> => (await fromWpServices())?.pillars ?? pillars,

  getServices: async (): Promise<Service[]> => (await fromWpServices())?.services ?? services,

  getService: async (slug: string): Promise<ServicePage | null> => {
    const wp = await fromWpServices();
    const allServices = wp?.services ?? services;
    const allDetails = wp?.details ?? details;
    const allPillars = wp?.pillars ?? pillars;
    const allAgencies = (await fromWpAgencyTypes()) ?? agencyTypes;

    const service = allServices.find((s) => s.slug === slug);
    const detail = allDetails[slug];
    if (!service || !detail) return null;

    const pillarGroup = allPillars.find((p) => p.id === service.pillar) ?? allPillars[0];
    return {
      ...service,
      ...detail,
      pillarGroup,
      related: (pillarGroup?.services ?? []).filter((s) => s.slug !== slug).slice(0, 4),
      agencies: (detail.agencyTypes ?? []).map((s) => allAgencies.find((a) => a.slug === s)).filter((a): a is AgencyType => Boolean(a)),
    };
  },

  getAgencyTypes: async (): Promise<AgencyType[]> => (await fromWpAgencyTypes()) ?? agencyTypes,

  getAgencyType: async (slug: string) => {
    const allTypes = (await fromWpAgencyTypes()) ?? agencyTypes;
    const allServices = (await fromWpServices())?.services ?? services;
    const type = allTypes.find((a) => a.slug === slug);
    if (!type) return null;
    return { ...type, serviceItems: type.services.map((s) => allServices.find((x) => x.slug === s)).filter((s): s is Service => Boolean(s)) };
  },

  getProcess: async () => {
    const wp = await fromWpCollections();
    return wp?.process.length ? wp.process : process;
  },

  getWork: async () => (await fromWpWork())?.work ?? work,

  getWorkCategories: async () => (await fromWpWork())?.categories ?? workCategories,

  getWorkItem: async (slug: string) => {
    const all = (await fromWpWork())?.work ?? work;
    const item = all.find((w) => w.slug === slug);
    if (!item) return null;
    const related = all.filter((w) => w.slug !== slug && w.category === item.category).slice(0, 3);
    return { ...item, related: related.length ? related : all.filter((w) => w.slug !== slug).slice(0, 3) };
  },

  getPromises: async () => {
    const wp = await fromWpCollections();
    return wp?.promises.length ? wp.promises : promises;
  },

  getProtectionClauses: async () => {
    const wp = await fromWpCollections();
    return wp?.clauses.length ? wp.clauses : protectionClauses;
  },

  getFaqs: async () => {
    const wp = await fromWpCollections();
    return wp?.faqs.length ? wp.faqs : faqs;
  },

  getPricingFaqs: async () => {
    const wp = await fromWpCollections();
    return wp?.pricingFaqs.length ? wp.pricingFaqs : pricingFaqs;
  },

  // the stack list and the clocks are structural, not editorial: they stay in code
  getStack: async () => stack,
  getClocks: async () => clocks,

  getEngagementModels: async () => {
    const wp = await fromWpCollections();
    return wp?.plans.length ? wp.plans : engagementModels;
  },

  getTeam: async () => {
    const wp = await fromWpCollections();
    return wp?.team.length ? wp.team : team;
  },

  getClients: async () => {
    const wp = await fromWpCollections();
    return wp?.clients.length ? wp.clients : clients;
  },

  getGlobeLocations: async () => globeLocations,

  getGlobeCards: async () => {
    // preview photos win on this machine only; the folder they come from is git-ignored
    const preview = placeholderClients();
    if (preview.length) return clientOrbit(preview);

    const wp = await fromWpCollections();
    if (wp?.featuredClients.length) {
      const { logoOrbit } = await import("@/content/clients");
      return logoOrbit(wp.featuredClients);
    }
    return globeCards;
  },

  getComparison: async () => ({ rows: comparison, source: comparisonSource }),

  getTestimonials: async () => {
    const wp = await fromWpCollections();
    return wp?.testimonials.length ? wp.testimonials : testimonials;
  },

  /* ---------------------------------------------------- WordPress-only content
     Posts and pages have no local twin: they exist in WordPress or not at all,
     so these return an empty list rather than falling back to /content. */

  getPosts: async (first = 24) => (await wpPosts(first)) ?? [],

  getPost: async (slug: string) => wpPost(slug),

  getPage: async (uri: string) => wpPage(uri),

  /** Every slug WordPress publishes — the sitemap and generateStaticParams read this. */
  getWpSlugs: async () => wpSlugs(),
};

export type Cms = typeof cms;
