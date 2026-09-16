/**
 * Content types for the marketing site.
 * The local adapter reads these from /content today; the WordPress adapter
 * (Phase 4, WPGraphQL + ACF) maps its GraphQL shapes onto the same types,
 * so pages never change when the content source does.
 */

export type Pillar = "build" | "automate" | "grow" | "support";

export interface Service {
  slug: string;
  name: string;
  pillar: Pillar;
  summary: string;
}

/** Everything a service page needs beyond the summary. Keyed by service slug. */
export interface ServiceDetail {
  /** The H1 on the service page — the commercial phrase, e.g. "White-label WordPress development". */
  title: string;
  /** Two or three sentences: what it is, who sends this brief, what they get. */
  intro: string;
  /** What ships. Concrete, checkable. */
  deliverables: string[];
  /** When an agency should send this brief. */
  signals: string[];
  /** Tooling used on this kind of work. */
  stack: string[];
  /** SEO description, under 160 characters. */
  seo: string;
  /** Agency types this is most relevant to. */
  agencyTypes?: string[];
}

export interface PillarGroup {
  id: Pillar;
  name: string;
  tagline: string;
  services: Service[];
}

export interface AgencyType {
  slug: string;
  name: string;
  problem: string;
  relief: string;
  /** Longer framing for the /for page. */
  intro: string;
  /** Service slugs, in order of relevance. */
  services: string[];
  /** How a typical engagement runs for this kind of agency. */
  workflow: string[];
  seo: string;
}

export interface ProcessStep {
  id: string;
  name: string;
  turnaround: string;
  summary: string;
  artefact: string;
}

export interface WorkItem {
  slug: string;
  title: string;
  client: string;
  region: string;
  category: string;
  summary: string;
  stack: string[];
  url?: string;
  /** Screenshot of the live site, 1440×900, under /public. */
  image?: string;
  /** The founder's role on the project. */
  role: string;
  /** What was built — facts only, no metrics we cannot show. */
  delivered: string[];
}

export interface Client {
  name: string;
  country: "UK" | "US" | "BD";
  /** What was delivered, in a few words. */
  work: string;
  url?: string;
}

export interface GlobeLocation {
  id: string;
  label: string;
  lat: number;
  lon: number;
  /** hq: our base · market: a market we serve (labelled, with an arc from the base) · coverage: a smaller point inside a market, unlabelled */
  kind: "hq" | "market" | "coverage";
}

/**
 * A real client who recommends SoftVolt AI and has agreed, in writing, to be
 * shown on the site with their name and photo.
 */
export interface RecommendingClient {
  id: string;
  /** Their name exactly as they want it shown. */
  name: string;
  /** Job title, as they want it shown. */
  role: string;
  company: string;
  /** Short country code shown on the photo, e.g. "UK". */
  country: string;
  /** Square photo under /public/clients/people/, supplied by them or used with their permission. */
  photo: string;
  /** When and how they agreed to appear, e.g. "Email to Alamgir, 2026-09-20". Keep that record. */
  consent: string;
}

interface GlobeCardBase {
  id: string;
  /** Longitude-like position on the orbit, degrees. */
  az: number;
  /** Latitude on the orbit, degrees (-90..90). */
  lat: number;
  scale?: number;
}

export type GlobeCard = GlobeCardBase &
  (
    | { kind: "client"; name: string; role: string; company: string; country: string; photo: string }
    | { kind: "site"; title: string; country: Client["country"]; work: string; image: string }
    | { kind: "cities"; lines: string[] }
    | { kind: "brand"; title: string; sub: string }
    | { kind: "stack"; title: string; items: string[] }
    | { kind: "hours"; big: string; sub: string }
  );

export interface Promise {
  id: string;
  label: string;
  detail: string;
}

export interface Testimonial {
  /** The quote exactly as the partner wrote it. */
  quote: string;
  name: string;
  role: string;
  agency: string;
  country: string;
  /** What we delivered for them, in a few words. */
  work: string;
}

export interface ComparisonRow {
  dimension: string;
  inHouse: string;
  freelancer: string;
  us: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface TechItem {
  name: string;
  group: string;
}

export interface CityClock {
  city: string;
  timeZone: string;
  short: string;
}

export interface EngagementModel {
  id: string;
  name: string;
  bestFor: string;
  includes: string[];
  /** Public price. null renders as "Let's talk" (quote-only tier). */
  from: string | null;
  /** Billing period shown next to the price, e.g. "/month". */
  period?: string;
  /** Optional badge on the plan card. Keep it to something we can stand behind. */
  badge?: string;
}
