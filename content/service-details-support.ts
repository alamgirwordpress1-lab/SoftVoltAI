import type { ServiceDetail } from "@/lib/cms/types";

export const supportDetails: Record<string, ServiceDetail> = {
  "website-maintenance": {
    title: "White-label website maintenance",
    intro:
      "Care plans you resell to every client site: updates staged before they go live, nightly backups with a rehearsed restore, uptime monitoring, security hardening and a monthly report in your brand. The unglamorous work that keeps the relationship — and the retainer — alive.",
    deliverables: [
      "Core, plugin, theme and PHP updates staged and tested before release",
      "Nightly off-site backups with a documented restore procedure",
      "Uptime and performance monitoring with alerts",
      "Security hardening, malware scanning and login protection",
      "A block of small-fix hours each month",
      "Monthly white-label report per site",
    ],
    signals: [
      "You have clients on 'we will look at it when it breaks'",
      "Updates are being skipped because nobody has time to test them",
      "You want a recurring revenue line that does not need a developer on staff",
    ],
    stack: ["WordPress", "WooCommerce", "Shopify", "Webflow", "Uptime monitoring", "Cloudflare"],
    seo: "White-label website maintenance and care plans for agencies: staged updates, backups, monitoring, security and a monthly report in your brand.",
    agencyTypes: ["web-design-agencies", "digital-marketing-agencies", "full-service-agencies"],
  },
  "wordpress-security-malware-cleanup": {
    title: "WordPress security and malware cleanup",
    intro:
      "Hacked-site recovery and hardening, handled calmly: isolate, clean, patch, restore, then close the door it came through. We work from a fresh backup, document every step, and hand the client's site back with the credentials rotated and the monitoring in place.",
    deliverables: [
      "Incident triage and a written recovery plan within hours",
      "Malware removal, backdoor hunting and file integrity verification",
      "Credential rotation, least-privilege roles and 2FA",
      "Patching of the entry point: plugins, themes, hosting configuration",
      "Blacklist removal requests and search-engine re-review",
      "Hardening and monitoring so it does not happen twice",
    ],
    signals: [
      "A client site is redirecting, spamming or flagged by Google",
      "The host has suspended an account for malware",
      "A site has never had its credentials or plugins reviewed",
    ],
    stack: ["WordPress", "Wordfence / Sucuri", "Cloudflare", "SSH", "WP-CLI"],
    seo: "White-label WordPress malware cleanup and security hardening for agencies: recovery, credential rotation, patching and monitoring, documented step by step.",
    agencyTypes: ["web-design-agencies", "digital-marketing-agencies"],
  },
  "website-rescue-and-fixes": {
    title: "Website rescue and bug fixing",
    intro:
      "Plugin conflicts, broken checkouts, white screens, critical errors, layouts that fell apart after an update. Senior developers who diagnose before they touch anything, fix on staging, and write down what happened so it can go in your client update.",
    deliverables: [
      "Diagnosis with a written cause, not a guess",
      "Fix on staging with before-and-after evidence",
      "Regression check on the pages and flows around the fix",
      "Root-cause notes and prevention recommendations",
      "Emergency response for sites that are down",
      "Optional care plan so the next one is caught earlier",
    ],
    signals: [
      "'The site broke after the update' and the developer has left",
      "Checkout, forms or bookings are failing and orders are being lost",
      "A theme or plugin conflict nobody can locate",
    ],
    stack: ["WordPress", "WooCommerce", "PHP", "Shopify", "Webflow", "Browser DevTools"],
    seo: "White-label website rescue and bug fixing for agencies: plugin conflicts, broken checkouts, white screens and critical errors fixed by senior developers.",
    agencyTypes: ["web-design-agencies", "digital-marketing-agencies", "full-service-agencies"],
  },
  "performance-optimisation": {
    title: "Website performance optimisation",
    intro:
      "Core Web Vitals passes measured on real devices, not just a green lab score: image pipeline, caching, script diet, font loading, layout stability and server response. We show the before and after with field data your client can check.",
    deliverables: [
      "Performance audit with prioritised fixes and expected impact",
      "Image, font and script optimisation",
      "Caching, CDN and hosting configuration",
      "Layout-shift and interaction fixes in templates and plugins",
      "Third-party script governance",
      "Before/after report with lab and field data",
    ],
    signals: [
      "A client fails Core Web Vitals in Search Console",
      "Ad landing pages are slow and Quality Score is suffering",
      "Speed plugins have been stacked and the site got slower",
    ],
    stack: ["PageSpeed Insights", "WebPageTest", "Cloudflare", "WP Rocket", "Next.js", "Lighthouse"],
    seo: "White-label website performance optimisation for agencies: Core Web Vitals passes on real devices, with before-and-after field data.",
    agencyTypes: ["seo-agencies", "google-ads-agencies", "web-design-agencies"],
  },
  "website-migration": {
    title: "Website migration",
    intro:
      "Host, platform and domain moves without losing rankings, orders or the client's sleep: inventory, redirect map, content and data migration, a rehearsal on staging, and monitoring after cutover. Scoped with a checklist your client can read.",
    deliverables: [
      "Migration inventory: URLs, content, data, integrations, DNS, email",
      "Redirect map and SEO preservation plan",
      "Content and database migration with validation",
      "Staging rehearsal with sign-off",
      "Cutover with DNS, SSL and email checked",
      "Post-launch monitoring of errors, rankings and conversions",
    ],
    signals: [
      "A client is changing host, platform or domain",
      "A redesign is launching on new URLs",
      "A previous migration lost traffic and nobody knows why",
    ],
    stack: ["WordPress", "Shopify", "Webflow", "Cloudflare DNS", "Search Console", "WP-CLI"],
    seo: "White-label website migration for agencies: host, platform and domain moves with redirect maps, staging rehearsal and post-launch monitoring.",
    agencyTypes: ["seo-agencies", "web-design-agencies", "full-service-agencies"],
  },
  "analytics-and-tracking": {
    title: "Analytics and conversion tracking",
    intro:
      "GA4, Google Tag Manager, Google Ads and Meta conversions, Consent Mode v2 and server-side options implemented so the numbers hold up when the client asks a hard question. Every event documented; every consent state tested; nothing firing before it should.",
    deliverables: [
      "Measurement plan mapping business goals to events",
      "GA4 and Tag Manager implementation with a documented container",
      "Google Ads and Meta conversion tracking, including Conversions API",
      "Consent Mode v2 with a compliant banner and reject-all parity",
      "E-commerce and form tracking validated end to end",
      "Looker Studio dashboard in your brand",
    ],
    signals: [
      "Conversions in the ad platform do not match the CRM",
      "A cookie banner was added and half the data disappeared",
      "Nobody can explain what a tag in the container does",
    ],
    stack: ["GA4", "Google Tag Manager", "Consent Mode v2", "Meta Conversions API", "Looker Studio", "c15t"],
    seo: "White-label analytics and conversion tracking for agencies: GA4, Tag Manager, Google Ads and Meta conversions, Consent Mode v2 — documented and tested.",
    agencyTypes: ["google-ads-agencies", "digital-marketing-agencies", "seo-agencies"],
  },
};
