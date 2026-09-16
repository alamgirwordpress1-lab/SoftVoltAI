/**
 * Site search: the pages that are not generated from other content, the
 * searches suggested before anyone types, and the quick links under them.
 * Services, agency solutions, case studies and FAQs are indexed automatically
 * from their own content files — see lib/search/build-index.ts.
 */

export interface SearchPage {
  title: string;
  url: string;
  description: string;
  /** Words people might search for that the title does not contain. */
  keywords: string[];
}

export const searchPages: SearchPage[] = [
  {
    title: "All services",
    url: "/services",
    description: "Every white-label service we deliver for agencies, grouped into build, automate, grow and support.",
    keywords: ["services", "what we do", "build", "automate", "grow", "support", "capabilities"],
  },
  {
    title: "Agency solutions",
    url: "/for",
    description: "White-label production and growth for digital marketing, SEO, PPC, branding, web design and full-service agencies.",
    keywords: ["agencies", "who we work with", "industries", "partners"],
  },
  {
    title: "Case studies",
    url: "/case-studies",
    description: "Headless WordPress + Next.js builds, WooCommerce stores and technical-SEO-first sites you can open.",
    keywords: ["portfolio", "work", "projects", "examples", "clients", "websites"],
  },
  {
    title: "Rates & monthly plans",
    url: "/rates",
    description: "Monthly plans sized by how many client projects you run in parallel, with anything outside a plan quoted in writing first.",
    keywords: ["pricing", "price", "prices", "cost", "plans", "monthly", "retainer", "budget", "packages", "quote"],
  },
  {
    title: "Security & confidentiality",
    url: "/security",
    description: "Mutual NDA before the brief, shared-vault credentials, least-privilege access and revocation at handover.",
    keywords: ["nda", "confidentiality", "credentials", "passwords", "data protection", "gdpr", "privacy", "access", "dpa"],
  },
  {
    title: "Partner programme",
    url: "/partner-programme",
    description: "A first fixed-price project, then a retainer if the work is recurring. NDA and agency protection terms from day one.",
    keywords: ["partner", "partnership", "become a partner", "white label", "retainer", "agency protection"],
  },
  {
    title: "About SoftVolt AI",
    url: "/about",
    description: "The digital team behind agencies: based in Dhaka, working UK and US hours, never visible to your client.",
    keywords: ["about", "company", "who we are", "dhaka", "bangladesh"],
  },
  {
    title: "Our story",
    url: "/about#story",
    description: "Why an agency developer built the team behind agencies.",
    keywords: ["story", "history", "why we started"],
  },
  {
    title: "Meet the team",
    url: "/about#founder",
    description: "The named people who scope and build your work.",
    keywords: ["team", "founder", "co-founder", "people", "leadership"],
  },
  {
    title: "How we work",
    url: "/about#how-it-works",
    description: "Five steps from brief to handover, each one written down.",
    keywords: ["process", "steps", "workflow", "how it works", "handover", "qa"],
  },
  {
    title: "Send us a brief",
    url: "/contact",
    description: "Four short steps. A named producer replies within one business day; a scope and fixed price follow within two.",
    keywords: ["contact", "brief", "quote", "estimate", "hire", "start a project", "email", "get in touch"],
  },
  {
    title: "Book a 20-minute scoping call",
    url: "/contact#call",
    description: "Prefer to talk? A 20-minute scoping call is free.",
    keywords: ["call", "meeting", "book a call", "talk", "consultation"],
  },
];

/** Shown as chips before anything is typed, in this order. */
export const popularSearches = [
  "WordPress",
  "WooCommerce",
  "Headless WordPress",
  "Next.js",
  "Shopify",
  "AI automation",
  "Technical SEO",
  "Google Ads",
  "Maintenance",
  "Pricing",
];

/** Quick links under the popular searches, by URL (each must be in searchPages). */
export const searchQuickLinks = ["/services", "/case-studies", "/rates", "/contact"];
