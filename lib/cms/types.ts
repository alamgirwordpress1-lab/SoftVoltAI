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

/**
 * A delivered client shown as a round badge on the globe — the client's own
 * business, not a person. Only clients whose site our founder actually built.
 */
export interface FeaturedClient {
  id: string;
  name: string;
  /** What was delivered, in a few words. */
  work: string;
  country: Client["country"];
  /** Square logo under /public/clients/logos/. Leave it out to show the client's initials instead. */
  logo?: string;
  /** Set when the logo file is a full-bleed coloured tile, so it fills the badge instead of sitting on white. */
  logoFill?: boolean;
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
    | { kind: "logo"; name: string; work: string; country: string; logo?: string; logoFill?: boolean }
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

/** A WordPress plugin or theme on the "Our Products" menu and the /products page. */
export interface Product {
  slug: string;
  name: string;
  /** The product group it is listed under: "plugins", "themes". */
  group: string;
  /** What it is, in two or three words: "WordPress plugin". */
  kind: string;
  /** A short flag beside the name: "New", "Popular". Keep it to something we can stand behind. */
  badge?: string;
  /** One line under the name in the menu. */
  tagline: string;
  /** The paragraph on the /products page. */
  summary: string;
  /** An uploaded icon. Without one the product's drawn icon, or its initials, are shown. */
  image?: { src: string; alt: string; width: number; height: number } | null;
  /** The price in a few words, for cards: "Free · Pro coming soon". */
  price: string;
  /** Where the free version can be had, or when it will be. */
  availability: string;
  /** Words people might search for that the name does not contain. */
  keywords: string[];
}

/** A heading in the Our Products menu and on /products, with what to say while it has no products. */
export interface ProductGroup {
  slug: string;
  title: string;
  empty: string;
}

/** A button on a product page: its words and where it goes. `demo` opens the voice agent on this site. */
export interface ProductAction {
  label: string;
  href: string;
  kind?: "primary" | "secondary" | "demo";
}

/** One tier in a product's price card. */
export interface ProductPlan {
  name: string;
  /** "$0", or "Coming soon" while a tier is not on sale. */
  price: string;
  /** Next to the price: "forever", "/ year". */
  period?: string;
  note: string;
  points: string[];
  action: ProductAction;
}

/** Everything a product's own page needs beyond the summary. Keyed by product slug. */
export interface ProductDetail {
  /** The H1: the product and the platform, "SoftVolt AI Voice Agent for WordPress". */
  title: string;
  /** Two sentences: what it does and for whom. */
  intro: string;
  /** SEO description, under 160 characters. */
  seo: string;
  /** The buttons under the intro, in order. */
  actions: ProductAction[];
  /** The price card beside the banner: the free tier first. */
  plans: ProductPlan[];
  /** The headings of the sections below; the small labels above them stay in code. */
  headings: { steps: string; help: string; features: string; compare: string; info: string; faq: string };
  why: { heading: string; paragraphs: string[]; points: { title: string; text: string }[] };
  steps: { title: string; text: string }[];
  /** The step-by-step guide: each step's words and the address of its screenshot. */
  guide: { heading: string; intro: string; steps: { title: string; text: string; image: string }[] };
  help: { title: string; text: string; action?: ProductAction }[];
  features: { title: string; text: string }[];
  /** Free against Pro, row by row: [in the free plugin, in Pro]. */
  compare: { label: string; free: boolean; pro: boolean }[];
  /** What Pro will add, for the Compare tab. */
  pro: { heading: string; text: string; features: { title: string; text: string }[] };
  /** Label → value facts for the Info tab. */
  info: { label: string; value: string }[];
  faqs: Faq[];
  /** The dark closing band. */
  cta: { pill: string; heading: string; accent: string; lede: string };
}
