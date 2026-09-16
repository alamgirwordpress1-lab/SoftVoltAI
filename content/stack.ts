import type { TechItem, CityClock, EngagementModel } from "@/lib/cms/types";

export const stack: TechItem[] = [
  { name: "WordPress", group: "CMS & commerce" },
  { name: "Headless WordPress", group: "CMS & commerce" },
  { name: "WooCommerce", group: "CMS & commerce" },
  { name: "Payload CMS", group: "CMS & commerce" },
  { name: "Sanity", group: "CMS & commerce" },
  { name: "Prismic", group: "CMS & commerce" },
  { name: "Shopify", group: "CMS & commerce" },
  { name: "Webflow", group: "CMS & commerce" },
  { name: "Next.js", group: "Front end" },
  { name: "React", group: "Front end" },
  { name: "TypeScript", group: "Front end" },
  { name: "Tailwind CSS", group: "Front end" },
  { name: "PostgreSQL", group: "Back end & data" },
  { name: "Prisma", group: "Back end & data" },
  { name: "Drizzle", group: "Back end & data" },
  { name: "Kysely", group: "Back end & data" },
  { name: "Node.js", group: "Back end & data" },
  { name: "PHP", group: "Back end & data" },
  { name: "WPGraphQL & REST", group: "Back end & data" },
  { name: "Claude API", group: "AI & automation" },
  { name: "OpenAI API", group: "AI & automation" },
  { name: "n8n", group: "AI & automation" },
  { name: "Make", group: "AI & automation" },
  { name: "Google Ads", group: "Marketing" },
  { name: "Meta Ads", group: "Marketing" },
  { name: "GA4 & Tag Manager", group: "Marketing" },
  { name: "Search Console", group: "Marketing" },
];

export const clocks: CityClock[] = [
  { city: "Dhaka", timeZone: "Asia/Dhaka", short: "DAC" },
  { city: "London", timeZone: "Europe/London", short: "LON" },
  { city: "New York", timeZone: "America/New_York", short: "NYC" },
  { city: "Toronto", timeZone: "America/Toronto", short: "YYZ" },
  { city: "Sydney", timeZone: "Australia/Sydney", short: "SYD" },
];

/* ────────────────────────────────────────────────────────────────────────────
   TODO(owner) — PLACEHOLDER PLANS. DO NOT GO LIVE WITH THESE.
   Every figure below is an example so the layout can be reviewed. None of it is
   costed. Before launch, replace on each tier:
     • the price (`from`)                    • active projects at a time
     • pages per project                     • turnaround in business days
     • support response time
   A published price and a published turnaround are both commitments — set them
   from your own delivery cost, capacity and target margin, not from a competitor.
   ──────────────────────────────────────────────────────────────────────────── */
export const engagementModels: EngagementModel[] = [
  {
    id: "essential",
    name: "Essential",
    bestFor: "For agencies testing unbranded delivery with their first few client projects.",
    from: "£500",
    period: "/month",
    includes: [
      "1 active project at a time",
      "WordPress and WooCommerce builds",
      "Standard turnaround (10–15 business days)",
      "Up to 5 pages per project",
      "Mobile-responsive on every build",
      "Email support, 1 business day",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    bestFor: "For agencies with steady, ongoing client work who need predictable capacity.",
    from: "£1,200",
    period: "/month",
    includes: [
      "Up to 3 active projects at a time",
      "WordPress, WooCommerce and headless Next.js",
      "Priority turnaround (7–10 business days)",
      "Up to 10 pages per project",
      "A named producer and shared channel",
      "Priority email and chat support",
    ],
    // "Recommended" is our own positioning, so it is safe to publish on day one.
    // TODO(owner): change to "Most popular" only once sales data actually shows it —
    // it is an objective claim, and UK/EU advertising rules expect it to be evidenced.
    badge: "Recommended",
  },
  {
    id: "premium",
    name: "Premium",
    bestFor: "For agencies scaling client delivery fast without adding headcount.",
    from: "£2,400",
    period: "/month",
    includes: [
      "Up to 6 active projects at a time",
      "Builds, AI automation, SEO and paid media",
      "Fast-track turnaround (5–7 business days)",
      "Up to 15 pages per project",
      "A named producer and shared channel",
      "Priority support, same-day response",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    bestFor: "For agencies with high-volume, complex or custom ongoing needs.",
    from: null,
    includes: [
      "Unlimited active projects, billed monthly",
      "The full white-label suite",
      "Turnaround agreed in writing",
      "Capacity planning and reporting",
      "A named producer and shared channel",
      "Multi-brand and multi-team support",
    ],
  },
];
