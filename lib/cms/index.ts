/**
 * Content access layer. Pages import from here only.
 * Today this reads typed local content; the WordPress adapter (WPGraphQL)
 * will implement the same functions in Phase 4 without touching any page.
 */
import { pillars } from "@/content/pillars";
import { agencyTypes } from "@/content/agency-types";
import { process } from "@/content/process";
import { work, workCategories } from "@/content/work";
import { promises, protectionClauses } from "@/content/promises";
import { faqs, pricingFaqs } from "@/content/faqs";
import { stack, clocks, engagementModels } from "@/content/stack";
import { team } from "@/content/founder";
import { clients, globeCards, globeLocations } from "@/content/clients";
import { comparison, comparisonSource } from "@/content/comparison";
import { testimonials } from "@/content/testimonials";
import { buildDetails } from "@/content/service-details-build";
import { automateDetails } from "@/content/service-details-automate";
import { growDetails } from "@/content/service-details-grow";
import { supportDetails } from "@/content/service-details-support";
import type { Service, ServiceDetail, PillarGroup, AgencyType } from "@/lib/cms/types";

const details: Record<string, ServiceDetail> = { ...buildDetails, ...automateDetails, ...growDetails, ...supportDetails };
const services: Service[] = pillars.flatMap((p) => p.services);

export interface ServicePage extends Service, ServiceDetail {
  pillarGroup: PillarGroup;
  related: Service[];
  agencies: AgencyType[];
}

export const cms = {
  getPillars: async () => pillars,
  getServices: async () => services,
  getService: async (slug: string): Promise<ServicePage | null> => {
    const service = services.find((s) => s.slug === slug);
    const detail = details[slug];
    if (!service || !detail) return null;
    const pillarGroup = pillars.find((p) => p.id === service.pillar)!;
    return {
      ...service,
      ...detail,
      pillarGroup,
      related: pillarGroup.services.filter((s) => s.slug !== slug).slice(0, 4),
      agencies: (detail.agencyTypes ?? []).map((slug) => agencyTypes.find((a) => a.slug === slug)).filter((a): a is AgencyType => Boolean(a)),
    };
  },
  getAgencyTypes: async () => agencyTypes,
  getAgencyType: async (slug: string) => {
    const type = agencyTypes.find((a) => a.slug === slug);
    if (!type) return null;
    return { ...type, serviceItems: type.services.map((s) => services.find((x) => x.slug === s)).filter((s): s is Service => Boolean(s)) };
  },
  getProcess: async () => process,
  getWork: async () => work,
  getWorkCategories: async () => workCategories,
  getWorkItem: async (slug: string) => {
    const item = work.find((w) => w.slug === slug);
    if (!item) return null;
    const related = work.filter((w) => w.slug !== slug && w.category === item.category).slice(0, 3);
    return { ...item, related: related.length ? related : work.filter((w) => w.slug !== slug).slice(0, 3) };
  },
  getPromises: async () => promises,
  getProtectionClauses: async () => protectionClauses,
  getFaqs: async () => faqs,
  getPricingFaqs: async () => pricingFaqs,
  getStack: async () => stack,
  getClocks: async () => clocks,
  getEngagementModels: async () => engagementModels,
  getTeam: async () => team,
  getClients: async () => clients,
  getGlobeLocations: async () => globeLocations,
  getGlobeCards: async () => globeCards,
  getComparison: async () => ({ rows: comparison, source: comparisonSource }),
  getTestimonials: async () => testimonials,
};

export type Cms = typeof cms;
