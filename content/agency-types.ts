import type { AgencyType } from "@/lib/cms/types";

export const agencyTypes: AgencyType[] = [
  {
    slug: "digital-marketing-agencies",
    name: "Digital marketing agencies",
    problem: "You sell websites and campaigns, but every build waits on the one developer you have.",
    relief: "A production team that takes the build, the fixes and the tracking off your plate.",
    intro:
      "You are good at winning clients and running campaigns. The bottleneck is production: the site rebuild that has slipped twice, the landing page the ads team is waiting on, the tracking that nobody has time to fix. We become that production capacity under your brand, with one producer, one channel and a written scope for every job.",
    services: ["white-label-wordpress-development", "woocommerce-development", "analytics-and-tracking", "website-maintenance", "conversion-rate-optimisation", "ai-automation"],
    workflow: [
      "You send the brief — Figma, URL, the client's notes, the campaign deadline.",
      "We return a written scope with a fixed price within two business days.",
      "Work runs on a staging URL under your brand; you review in your shared channel.",
      "QA against the published checklist, then a handover doc you can forward to the client.",
    ],
    seo: "White-label development, tracking and maintenance for digital marketing agencies. Fixed-price scopes, a named producer, your brand on everything.",
  },
  {
    slug: "seo-agencies",
    name: "SEO agencies",
    problem: "Technical recommendations sit in a report because nobody is free to implement them.",
    relief: "Developers who implement the technical SEO fixes, landing pages and schema you specify.",
    intro:
      "Your audits are good. Getting them implemented on a client's WordPress or Shopify site is where months disappear. We implement what you specify — Core Web Vitals fixes, structured data, redirects, internal-linking modules, location pages — and report back in the format your client already sees.",
    services: ["technical-seo-services", "white-label-seo-services", "local-seo-services", "performance-optimisation", "website-migration", "white-label-wordpress-development"],
    workflow: [
      "You send the audit or ticket list, with priorities and the client's platform access.",
      "We scope it into a fixed-price implementation sprint or a monthly block of hours.",
      "Each fix is deployed to staging, verified with the same tools you use, then released.",
      "You get a change log per site, written so it can go straight into your client report.",
    ],
    seo: "White-label technical SEO implementation for SEO agencies: Core Web Vitals, schema, migrations and landing pages built by developers who follow your audit.",
  },
  {
    slug: "google-ads-agencies",
    name: "Google Ads & PPC agencies",
    problem: "Campaigns leak spend into landing pages you do not control and tracking that half works.",
    relief: "Fast landing pages, clean conversion tracking and Consent Mode done properly.",
    intro:
      "Paid media is only as good as the page it lands on and the conversion it can measure. We build the landing pages, implement GA4, Tag Manager and Consent Mode v2 correctly, and can run Google and Meta execution under your brand when your media buyers are at capacity.",
    services: ["conversion-rate-optimisation", "analytics-and-tracking", "white-label-google-ads-management", "meta-ads-management", "white-label-wordpress-development", "workflow-automation"],
    workflow: [
      "You send the campaign structure, the offer and the tracking requirements.",
      "We build or fix the landing pages and the measurement, and test every conversion path.",
      "If you want execution too, campaigns run in your MCC under your reporting.",
      "Monthly: a white-label report and a list of what changed, why, and what is next.",
    ],
    seo: "White-label landing pages, conversion tracking, Consent Mode v2 and Google Ads execution for PPC agencies that need capacity without new hires.",
  },
  {
    slug: "branding-agencies",
    name: "Branding & design agencies",
    problem: "The Figma is beautiful. The build never quite matches it.",
    relief: "Pixel-faithful Figma to WordPress, Webflow, Shopify or Next.js, reviewed against your file.",
    intro:
      "You have a design team clients pay for and a development gap that costs you the second phase of every project. We build what you designed — spacing, type, motion — on the platform the client will actually maintain, and review every page against your Figma before you see it.",
    services: ["webflow-development", "white-label-wordpress-development", "shopify-development", "nextjs-sanity-prismic", "headless-wordpress-development", "conversion-rate-optimisation"],
    workflow: [
      "You share the Figma file, the prototype and the brand system.",
      "We return a build scope: platform recommendation, component list, timeline, fixed price.",
      "Pages are built and reviewed side by side with your frames — you sign off per template.",
      "Handover includes an editing guide in your brand so the client never needs us.",
    ],
    seo: "White-label Figma-to-WordPress, Webflow, Shopify and Next.js development for branding and design agencies. Built to the frame, delivered under your name.",
  },
  {
    slug: "web-design-agencies",
    name: "Web design agencies",
    problem: "Overflow months mean turning work away or missing the date you promised.",
    relief: "Overflow capacity with a named producer, so the date you promised holds.",
    intro:
      "Some months you have three builds and one developer. We are the second developer you do not have to hire: senior WordPress, WooCommerce, Shopify and Webflow production that starts within days, works to your standards and your deadlines, and disappears at handover.",
    services: ["white-label-wordpress-development", "woocommerce-development", "shopify-development", "webflow-development", "website-rescue-and-fixes", "website-maintenance"],
    workflow: [
      "You send the brief and the date you have promised the client.",
      "We confirm capacity and return a fixed-price scope within two business days.",
      "Daily progress in your shared channel; staging under your brand from day one.",
      "QA, handover, and a care plan you can resell if the client wants one.",
    ],
    seo: "Overflow web development capacity for web design agencies: white-label WordPress, WooCommerce, Shopify and Webflow builds with a named producer and fixed deadlines.",
  },
  {
    slug: "full-service-agencies",
    name: "Full-service agencies",
    problem: "Hiring a specialist for every discipline is not an option at your margin.",
    relief: "One partner across development, SEO, paid media and support — one contract, one channel.",
    intro:
      "Full-service means clients expect development, SEO, paid media, automation and support from one place. Staffing every discipline in-house is where the margin goes. We cover all of it under one contract and one channel, so your account managers have one place to send everything.",
    services: ["white-label-wordpress-development", "white-label-seo-services", "white-label-google-ads-management", "ai-automation", "website-maintenance", "nextjs-postgres-apps"],
    workflow: [
      "We agree a monthly retainer sized in hours, across any of our services.",
      "Your team sends briefs into one channel; a named producer triages and schedules.",
      "Development, SEO and paid work run in parallel with weekly status you can forward.",
      "Quarterly review of hours used, what shipped, and what to move in-house or out.",
    ],
    seo: "One white-label partner for full-service agencies: development, SEO, paid media, AI automation and support under a single retainer and a single channel.",
  },
];
