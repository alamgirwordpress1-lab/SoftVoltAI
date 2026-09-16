import type { ServiceDetail } from "@/lib/cms/types";

export const growDetails: Record<string, ServiceDetail> = {
  "white-label-seo-services": {
    title: "White-label SEO services",
    intro:
      "SEO execution for agencies that have sold organic growth and need it delivered: keyword strategy, on-page work, content structure and monthly reporting in your template. No guaranteed rankings — measurable, documented work that increases qualified visibility over time, with every change logged.",
    deliverables: [
      "Keyword and search-intent research mapped to pages",
      "On-page implementation: titles, meta, headings, internal links, image SEO",
      "Content briefs and page structures for new or thin pages",
      "Technical fixes coordinated with the development team",
      "Search Console and GA4 analysis with monthly reporting in your brand",
      "A change log per site that goes straight into your client report",
    ],
    signals: [
      "You have sold an SEO retainer and need reliable monthly execution",
      "Recommendations are piling up faster than they get implemented",
      "A client's visibility has stalled and nobody has time to find out why",
    ],
    stack: ["Search Console", "GA4", "Ahrefs / Semrush", "Screaming Frog", "Looker Studio"],
    seo: "White-label SEO services for agencies: keyword strategy, on-page implementation, content briefs and monthly reporting delivered under your brand.",
    agencyTypes: ["seo-agencies", "digital-marketing-agencies", "full-service-agencies"],
  },
  "technical-seo-services": {
    title: "Technical SEO implementation",
    intro:
      "The part of an SEO audit that needs a developer: crawlability, indexation, canonicals, sitemaps, structured data, Core Web Vitals and migrations. We implement what your audit specifies on WordPress, Shopify, Webflow or a headless stack, and verify each fix with the same tools you use.",
    deliverables: [
      "Crawl and indexation fixes: robots, canonicals, redirects, pagination",
      "XML sitemaps, hreflang and international setup where relevant",
      "Structured data (Organization, Product, Article, Breadcrumb and more) validated",
      "Core Web Vitals work on real devices, not just lab scores",
      "JavaScript SEO and rendering fixes on headless and app-heavy sites",
      "Migration plans with redirect maps and post-launch monitoring",
    ],
    signals: [
      "An audit has been sitting in a shared drive for a quarter",
      "A migration or redesign is coming and rankings must survive it",
      "Pages are indexed wrong, slow, or not at all",
    ],
    stack: ["Screaming Frog", "Search Console", "PageSpeed Insights", "Schema.org", "WordPress", "Next.js"],
    seo: "White-label technical SEO implementation for agencies: crawlability, structured data, Core Web Vitals and migrations built by developers who follow your audit.",
    agencyTypes: ["seo-agencies", "full-service-agencies"],
  },
  "local-seo-services": {
    title: "Local SEO services",
    intro:
      "Local visibility for multi-location and service-area clients: Google Business Profile optimisation, location landing pages, citation consistency and local on-page work, executed under your brand and reported in your format.",
    deliverables: [
      "Google Business Profile audit and optimisation per location",
      "Location and service-area landing pages built to a template you approve",
      "Citation audit and consistency fixes",
      "Local keyword research and on-page implementation",
      "Review strategy support and response templates",
      "Monthly local visibility report",
    ],
    signals: [
      "A client has several locations and inconsistent listings",
      "Location pages are thin, duplicated or missing",
      "Map-pack visibility is the client's real KPI",
    ],
    stack: ["Google Business Profile", "BrightLocal", "Search Console", "WordPress"],
    seo: "White-label local SEO for agencies: Google Business Profile, location pages and citation consistency for multi-location clients, delivered under your brand.",
    agencyTypes: ["seo-agencies", "digital-marketing-agencies"],
  },
  "white-label-google-ads-management": {
    title: "White-label Google Ads management",
    intro:
      "Search, Shopping and Performance Max execution under your brand: structure, ad copy, tracking, search-term hygiene and bid strategy, run in your manager account with reporting in your template. No guaranteed ROAS — disciplined execution you can show your client every month.",
    deliverables: [
      "Account structure, keyword research and ad copy",
      "Conversion tracking via GA4 and Tag Manager, verified end to end",
      "Search-term analysis and negative keyword management",
      "Shopping feed and Performance Max asset groups where relevant",
      "Bid and budget optimisation with a written rationale",
      "Monthly white-label report and next-month plan",
    ],
    signals: [
      "Your media buyers are at capacity and a new client is starting",
      "An account has grown messy and needs a rebuild",
      "You want to offer paid search without hiring a specialist",
    ],
    stack: ["Google Ads", "GA4", "Google Tag Manager", "Merchant Center", "Looker Studio"],
    seo: "White-label Google Ads management for agencies: Search, Shopping and Performance Max execution in your manager account with reporting in your brand.",
    agencyTypes: ["google-ads-agencies", "full-service-agencies", "digital-marketing-agencies"],
  },
  "meta-ads-management": {
    title: "Meta Ads management",
    intro:
      "Facebook and Instagram campaigns executed under your brand: audience strategy, creative testing, Pixel and Conversions API, retargeting and reporting. Built to be measured properly, so the conversations with your client are about results, not attribution arguments.",
    deliverables: [
      "Campaign structure for lead generation, conversions or retargeting",
      "Pixel and Conversions API implementation, verified",
      "Creative testing framework and ad copy",
      "Audience and exclusion strategy",
      "Landing page recommendations coordinated with the development team",
      "Monthly white-label report",
    ],
    signals: [
      "A client needs paid social alongside search and you lack a buyer",
      "Attribution broke after iOS changes and nobody fixed the Conversions API",
      "Creative is being launched without a test plan",
    ],
    stack: ["Meta Ads Manager", "Meta Pixel", "Conversions API", "GA4", "Google Tag Manager"],
    seo: "White-label Meta Ads management for agencies: campaign execution, Pixel and Conversions API, creative testing and reporting under your brand.",
    agencyTypes: ["google-ads-agencies", "full-service-agencies"],
  },
  "conversion-rate-optimisation": {
    title: "Conversion rate optimisation",
    intro:
      "Landing pages and funnels that turn the traffic you already paid for into leads and orders: analytics-led diagnosis, fast pages, clear offers, form and checkout fixes, and A/B tests where the volume justifies them. Development and measurement from the same team, so tests actually ship.",
    deliverables: [
      "Funnel and analytics review with a prioritised list of fixes",
      "Landing pages built for speed and clarity, matched to campaigns",
      "Form, checkout and booking flow improvements",
      "A/B or multivariate test setup and analysis where traffic allows",
      "Heatmap and session-recording setup with consent handling",
      "Monthly CRO report with what changed and what it did",
    ],
    signals: [
      "Ad spend is rising and conversion rate is flat",
      "Landing pages are slow, generic or built by the client",
      "You want CRO in your offer without an in-house specialist",
    ],
    stack: ["GA4", "Microsoft Clarity", "Google Optimize alternatives", "Next.js", "WordPress"],
    seo: "White-label conversion rate optimisation for agencies: landing pages, funnel fixes and A/B testing delivered by one team that builds and measures.",
    agencyTypes: ["google-ads-agencies", "digital-marketing-agencies", "branding-agencies"],
  },
};
