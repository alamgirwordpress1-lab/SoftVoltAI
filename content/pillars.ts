import type { PillarGroup } from "@/lib/cms/types";

export const pillars: PillarGroup[] = [
  {
    id: "build",
    name: "Build",
    tagline: "Websites, stores and apps your clients will put their name on.",
    services: [
      { slug: "white-label-wordpress-development", name: "WordPress", pillar: "build", summary: "Custom themes, ACF, Gutenberg and Elementor builds to WordPress coding standards." },
      { slug: "elementor-development", name: "Elementor development", pillar: "build", summary: "Custom Elementor widgets, templates and theme builders that stay fast." },
      { slug: "wordpress-plugin-development", name: "WordPress plugin development", pillar: "build", summary: "Custom plugins with their own admin screens, settings and WooCommerce hooks." },
      { slug: "woocommerce-development", name: "WooCommerce", pillar: "build", summary: "Custom checkout, payment and shipping logic, subscriptions, performance." },
      { slug: "headless-wordpress-development", name: "Headless WordPress + Next.js", pillar: "build", summary: "Keep the CMS your client knows, ship a Next.js front end that scores." },
      { slug: "landing-page-development", name: "High-speed landing pages", pillar: "build", summary: "Campaign pages built for Core Web Vitals, clean tracking and fast iteration." },
      { slug: "nextjs-payload-postgresql", name: "Next.js + Payload + PostgreSQL", pillar: "build", summary: "A code-first CMS inside the Next.js app itself — auth, roles, uploads, admin UI, one deploy." },
      { slug: "nextjs-sanity-prismic", name: "Next.js + Sanity / Prismic", pillar: "build", summary: "Hosted structured content with live preview, for editorial teams that outgrow page builders." },
      { slug: "nextjs-postgres-apps", name: "Next.js apps on PostgreSQL", pillar: "build", summary: "Portals, dashboards and SaaS-style tools with Prisma, Drizzle or Kysely on Postgres." },
      { slug: "laravel-development", name: "Laravel applications", pillar: "build", summary: "PHP applications and APIs on Laravel, for briefs that outgrow a CMS." },
      { slug: "shopify-development", name: "Shopify", pillar: "build", summary: "Theme customisation, Liquid sections, app integrations, migrations." },
      { slug: "webflow-development", name: "Webflow", pillar: "build", summary: "Figma to Webflow with CMS, interactions and clean class structure." },
    ],
  },
  {
    id: "automate",
    name: "Automate",
    tagline: "AI and workflow automation that removes the manual hours from an account.",
    services: [
      { slug: "ai-automation", name: "AI automation", pillar: "automate", summary: "Lead qualification, reporting, content pipelines and support triage built on the Claude and OpenAI APIs." },
      { slug: "workflow-automation", name: "Workflow automation", pillar: "automate", summary: "CRM, forms, ads and site data connected with n8n, Make or custom code — no more copy-paste ops." },
      { slug: "ai-assistants-and-chat", name: "AI assistants & chat", pillar: "automate", summary: "On-site assistants grounded in the client's own content, with hand-off to a human." },
      { slug: "internal-tools", name: "Internal tools", pillar: "automate", summary: "Small apps that replace the spreadsheet your client's team is quietly running the business on." },
    ],
  },
  {
    id: "grow",
    name: "Grow",
    tagline: "Execution for the campaigns you have already sold.",
    services: [
      { slug: "white-label-seo-services", name: "SEO", pillar: "grow", summary: "Keyword strategy, on-page, content structure, monthly reporting." },
      { slug: "technical-seo-services", name: "Technical SEO", pillar: "grow", summary: "Crawlability, Core Web Vitals, structured data, migrations." },
      { slug: "local-seo-services", name: "Local SEO", pillar: "grow", summary: "Google Business Profile, local pages, citation consistency." },
      { slug: "white-label-google-ads-management", name: "Google Ads", pillar: "grow", summary: "Search, Shopping and Performance Max under your brand." },
      { slug: "meta-ads-management", name: "Meta Ads", pillar: "grow", summary: "Lead-gen and conversion campaigns, Pixel and Conversions API." },
      { slug: "conversion-rate-optimisation", name: "CRO", pillar: "grow", summary: "Landing pages, funnel analysis, A/B test support." },
    ],
  },
  {
    id: "support",
    name: "Support",
    tagline: "The unglamorous work that keeps client relationships alive.",
    services: [
      { slug: "website-maintenance", name: "Maintenance", pillar: "support", summary: "Updates, backups, uptime, monthly care under your brand." },
      { slug: "wordpress-security-malware-cleanup", name: "Security & malware cleanup", pillar: "support", summary: "Hacked-site recovery, hardening, credential hygiene." },
      { slug: "website-rescue-and-fixes", name: "Bug fixing & rescue", pillar: "support", summary: "Plugin conflicts, broken checkouts, white screens, critical errors." },
      { slug: "performance-optimisation", name: "Performance", pillar: "support", summary: "Core Web Vitals passes on real devices, not just lab scores." },
      { slug: "website-migration", name: "Migration", pillar: "support", summary: "Host, platform and domain moves without losing rankings." },
      { slug: "analytics-and-tracking", name: "Analytics & tracking", pillar: "support", summary: "GA4, Tag Manager, Consent Mode v2, conversion tracking that holds up." },
    ],
  },
];
