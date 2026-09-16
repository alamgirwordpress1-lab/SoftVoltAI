import type { WorkItem } from "@/lib/cms/types";

/** Filter order for the work gallery. "All" must stay first — the gallery treats it as "no filter". */
export const workCategories = ["All", "Headless & Next.js", "E-commerce", "Corporate", "Agency & SEO"];

/**
 * Websites delivered by our founder as developer, project manager or team lead
 * before SoftVolt AI — all public and live. White-label partner work never
 * appears here without written permission, and no outcome is published unless
 * it can be shown.
 */
export const work: WorkItem[] = [
  {
    slug: "bulk-bag-man",
    title: "The Bulk Bag Man",
    client: "UK aggregates supplier",
    region: "United Kingdom",
    category: "Headless & Next.js",
    role: "Headless architecture · WordPress child theme · Next.js front end",
    summary:
      "A custom WordPress child theme exposes ACF fields, menus and a Supplies post type through the REST API; a Next.js App Router front end renders it on Vercel. Contact form submissions are proxied through a route handler, so the browser never talks to WordPress directly.",
    delivered: [
      "WordPress child theme that exposes ACF fields, menus and a Supplies post type through the REST API",
      "Next.js App Router front end deployed on Vercel",
      "Contact form submissions proxied through a Next.js route handler, so the browser never calls WordPress",
      "Content editing stays in the WordPress admin the client already knows",
    ],
    stack: ["Headless WordPress", "Next.js", "REST API", "ACF", "TypeScript", "Vercel"],
    url: "https://bag-man-live-six.vercel.app/",
    image: "/clients/bulk-bag-man.jpg",
  },
  {
    slug: "heat-pumps-4-pools",
    title: "Heat Pumps 4 Pools",
    client: "UK pool-heating retailer",
    region: "United Kingdom",
    category: "E-commerce",
    role: "Developer & maintenance engineer",
    summary:
      "Full WooCommerce build for a pool heating retailer, followed by ongoing maintenance engineering — the kind of care plan agencies resell under their own brand.",
    delivered: [
      "Full WooCommerce store build: catalogue, product templates and checkout",
      "Category and search structure for a large, technical product range",
      "Ongoing maintenance engineering after launch, not a hand-off and goodbye",
      "The same care-plan pattern agencies resell under their own brand",
    ],
    stack: ["WooCommerce", "WordPress", "PHP", "Maintenance"],
    url: "https://heatpumps4pools.com/",
    image: "/clients/heat-pumps-4-pools.jpg",
  },
  {
    slug: "ascent-energy",
    title: "Ascent Energy",
    client: "UK energy retailer",
    region: "United Kingdom",
    category: "E-commerce",
    role: "Project manager & developer",
    summary: "A UK energy e-commerce platform delivered end to end — scoping, build and launch — with the project run as well as written.",
    delivered: [
      "Scoping and requirements turned into a build plan",
      "WooCommerce platform for energy products and services",
      "Project managed through to launch, with the client briefed at each stage",
    ],
    stack: ["WooCommerce", "WordPress", "Project management"],
    url: "https://ascent-energy.co.uk/",
    image: "/clients/ascent-energy.jpg",
  },
  {
    slug: "mobiledokan24",
    title: "MobileDokan24",
    client: "Bangladesh mobile retailer",
    region: "Bangladesh",
    category: "E-commerce",
    role: "Developer",
    summary: "A mobile-device store built for catalogue-scale product management, with daily merchandising handled by the client's own team.",
    delivered: [
      "WooCommerce store for a large, fast-changing device catalogue",
      "Product data structure the client's team can manage daily without a developer",
      "Category, filter and search paths for shoppers comparing models",
    ],
    stack: ["WooCommerce", "WordPress", "PHP"],
    url: "https://mobiledokan24.com/",
    image: "/clients/mobiledokan24.jpg",
  },
  {
    slug: "patriot-insurance",
    title: "Patriot Insurance Group",
    client: "US insurance group",
    region: "United States",
    category: "Corporate",
    role: "Full-stack developer",
    summary: "A full-stack website build for a division of a US insurance group: services architecture, enquiry flows and a content structure the team can maintain.",
    delivered: [
      "Full-stack WordPress build for an insurance division",
      "Services architecture that separates personal, business and industry cover",
      "Enquiry and quote-request flows",
      "A content structure the client's team can maintain without breaking templates",
    ],
    stack: ["WordPress", "PHP", "Full-stack"],
    url: "https://dsayles.com/",
    image: "/clients/patriot-insurance.jpg",
  },
  {
    slug: "ronemus-vilensky",
    title: "Ronemus & Vilensky",
    client: "New York law firm",
    region: "United States",
    category: "Corporate",
    role: "Project manager",
    summary: "A law firm website with practice-area architecture and consultation enquiry flows, managed from brief to launch.",
    delivered: [
      "Practice-area architecture for a multi-practice law firm",
      "Consultation enquiry flows for prospective clients",
      "Project managed from brief to launch, with the firm reviewing each stage",
    ],
    stack: ["WordPress", "ACF", "Project management"],
    url: "https://www.ronvil.com/",
    image: "/clients/ronemus-vilensky.jpg",
  },
  {
    slug: "yume-nihongo",
    title: "Yume Nihongo",
    client: "Dhaka language school",
    region: "Bangladesh",
    category: "Corporate",
    role: "Developer",
    summary: "A study-in-Japan language school site: courses, admissions guidance and the document-to-visa process laid out for prospective students.",
    delivered: [
      "Course and admissions pages for a study-in-Japan programme",
      "The document-to-visa process explained step by step for applicants",
      "Enquiry paths for students and parents",
    ],
    stack: ["WordPress", "Education"],
    url: "https://yumenihongo.com/",
    image: "/clients/yume-nihongo.jpg",
  },
  {
    slug: "seo-agency-in-essex",
    title: "SEO Agency in Essex",
    client: "UK SEO agency",
    region: "United Kingdom",
    category: "Agency & SEO",
    role: "Developer",
    summary: "An SEO agency's own website, engineered to practise what it preaches: technical SEO and speed first, built for an agency that sells rankings to its clients.",
    delivered: [
      "An agency website built technical-SEO first: clean markup, headings and internal linking",
      "Speed treated as a requirement, not a plugin added at the end",
      "Service and location page templates the agency can extend itself",
    ],
    stack: ["WordPress", "Technical SEO", "Performance"],
    url: "https://seoagencyinessex.co.uk/",
    image: "/clients/seo-agency-in-essex.jpg",
  },
];
