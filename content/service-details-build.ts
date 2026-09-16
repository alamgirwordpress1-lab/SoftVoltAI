import type { ServiceDetail } from "@/lib/cms/types";

export const buildDetails: Record<string, ServiceDetail> = {
  "white-label-wordpress-development": {
    title: "White-label WordPress development",
    intro:
      "Custom WordPress builds delivered under your agency's brand: themes written to WordPress coding standards, ACF-driven page templates, Gutenberg blocks and Elementor widgets your client's team can actually edit. You send the design and the brief; we return a scope, a staging site and a handover doc with your name on it.",
    deliverables: [
      "Custom theme or child theme built to WordPress coding standards",
      "ACF field groups and page templates matching your Figma",
      "Custom Gutenberg blocks or Elementor widgets where the design needs them",
      "Custom post types, taxonomies and archive templates",
      "Forms, integrations and tracking wired and tested",
      "Editing guide and handover documentation in your brand",
    ],
    signals: [
      "A Figma or Adobe XD design is approved and needs building on WordPress",
      "A client's existing theme is fighting every change your team makes",
      "You need a build to start this week and your developer is booked for a month",
    ],
    stack: ["WordPress", "PHP", "ACF", "Gutenberg", "Elementor", "Tailwind CSS"],
    seo: "White-label WordPress development for agencies: custom themes, ACF, Gutenberg and Elementor builds delivered under your brand with a fixed price.",
    agencyTypes: ["web-design-agencies", "digital-marketing-agencies", "branding-agencies"],
  },
  "elementor-development": {
    title: "White-label Elementor development",
    intro:
      "Elementor builds that behave like real development work: custom widgets for the parts the editor cannot do, theme-builder templates, a tidy global style system and a performance pass so the page still loads quickly. Your client edits what they should, and nothing else.",
    deliverables: [
      "Custom Elementor widgets with their own controls, built as a plugin",
      "Theme builder templates: header, footer, archives, single templates, popups",
      "Global colours, typography and spacing set up as a system, not per-section overrides",
      "Reusable sections and templates your team can drop into the next project",
      "Performance pass: unused widgets off, images sized, CSS/JS trimmed",
      "Editing guide so the client stays inside the parts you want them in",
    ],
    signals: [
      "A design needs a component Elementor does not have out of the box",
      "An Elementor site has become slow and inconsistent after years of edits",
      "You want page-builder editing for the client without page-builder chaos",
    ],
    stack: ["Elementor", "Elementor Pro", "WordPress", "PHP", "ACF", "Custom widgets"],
    seo: "White-label Elementor development for agencies: custom widgets, theme-builder templates and a performance pass, delivered under your brand.",
    agencyTypes: ["web-design-agencies", "digital-marketing-agencies", "branding-agencies"],
  },
  "wordpress-plugin-development": {
    title: "WordPress plugin development",
    intro:
      "When a client's requirement does not exist as a plugin — or the one that does is a liability — we build it. Custom plugins with their own admin screens, settings, roles and update path, written to WordPress standards so the next developer can read them.",
    deliverables: [
      "Custom plugin scoped to one job, with its own admin screens and settings",
      "Custom post types, taxonomies, meta boxes and REST or GraphQL endpoints",
      "WooCommerce hooks and filters for pricing, checkout and order logic",
      "Gutenberg blocks or shortcodes where the content team needs them",
      "Uninstall, migration and update handling — not just an activation hook",
      "Documented code and a handover note for whoever maintains it next",
    ],
    signals: [
      "The only plugin that does the job is abandoned, bloated or paid per site",
      "A client needs business logic no page builder can express",
      "You are stacking five plugins to achieve one outcome",
    ],
    stack: ["WordPress", "PHP", "WP REST API", "WooCommerce hooks", "Gutenberg", "WP-CLI"],
    seo: "White-label WordPress plugin development for agencies: custom plugins, admin screens, WooCommerce hooks and Gutenberg blocks, built to WordPress standards.",
    agencyTypes: ["digital-marketing-agencies", "full-service-agencies", "web-design-agencies"],
  },
  "landing-page-development": {
    title: "High-speed landing pages",
    intro:
      "Campaign pages that load fast enough to keep Quality Score and patience intact: built headless on Next.js or as a lean WordPress template, with tracking wired correctly and a structure your team can clone for the next campaign.",
    deliverables: [
      "Landing page built for Core Web Vitals on mobile, not just a lab score",
      "Copy and section structure implemented from your brief or Figma",
      "Forms with validation, spam protection and CRM or email delivery",
      "GA4, Tag Manager and ad-platform conversion tracking, tested end to end",
      "A/B-ready variants where traffic justifies them",
      "Reusable template so the next campaign takes hours, not days",
    ],
    signals: [
      "Paid traffic is landing on a slow, generic page",
      "A campaign starts next week and the page does not exist",
      "Conversions are not being recorded the same way in every platform",
    ],
    stack: ["Next.js", "WordPress", "Tailwind CSS", "GA4", "Google Tag Manager", "Vercel"],
    seo: "White-label landing page development for agencies: fast, tracked campaign pages built headless or on WordPress, ready for paid traffic.",
    agencyTypes: ["google-ads-agencies", "digital-marketing-agencies", "seo-agencies"],
  },
  "woocommerce-development": {
    title: "White-label WooCommerce development",
    intro:
      "Stores that survive real customers: custom checkout flows, payment and shipping logic, subscriptions and product configurators, built and load-tested before launch. Whether the brief is a new store or a checkout that keeps losing orders, you get a fixed scope and a staging store to click through.",
    deliverables: [
      "WooCommerce store build or rebuild on your chosen theme or a custom one",
      "Payment gateways (Stripe, PayPal, Klarna and others) configured and tested end to end",
      "Shipping rules, tax and multi-currency logic",
      "Custom checkout fields, order flows and email templates",
      "Subscriptions, bookings, bundles or configurable products where needed",
      "Performance pass: caching, image pipeline, database cleanup",
    ],
    signals: [
      "A client is losing orders at checkout and nobody can say why",
      "The store needs custom pricing, shipping or product logic a plugin cannot do",
      "A migration from Shopify, Magento or a legacy store is on the table",
    ],
    stack: ["WooCommerce", "WordPress", "PHP", "Stripe", "Klarna", "WP REST API"],
    seo: "White-label WooCommerce development for agencies: custom checkout, payments, shipping logic, subscriptions and performance, delivered under your brand.",
    agencyTypes: ["digital-marketing-agencies", "web-design-agencies", "full-service-agencies"],
  },
  "headless-wordpress-development": {
    title: "Headless WordPress + Next.js development",
    intro:
      "Your client keeps the WordPress admin they already know; their visitors get a Next.js front end that loads in a fraction of the time. We expose content through WPGraphQL or the REST API, build the front end with server components and image optimisation, and wire previews and on-demand revalidation so editors never wait for a deploy.",
    deliverables: [
      "WordPress configured as a headless CMS with WPGraphQL or REST, ACF and preview support",
      "Next.js App Router front end with server components, next/image and next/font",
      "Draft preview, on-demand revalidation and a webhook from publish to deploy",
      "SEO parity: metadata, sitemaps, structured data and redirects carried over",
      "Forms and integrations proxied through route handlers, never exposing the CMS",
      "Deployment on Vercel or your chosen host, with a runbook",
    ],
    signals: [
      "A client site fails Core Web Vitals no matter how many caching plugins are added",
      "The design needs interactions a page builder cannot deliver",
      "The client wants WordPress editing but a modern, secure front end",
    ],
    stack: ["Next.js", "React", "TypeScript", "WPGraphQL", "ACF", "Vercel"],
    seo: "Headless WordPress with a Next.js front end, white-label for agencies: WPGraphQL, previews, revalidation and Core Web Vitals passes, delivered under your brand.",
    agencyTypes: ["branding-agencies", "seo-agencies", "full-service-agencies"],
  },
  "nextjs-payload-postgresql": {
    title: "Next.js + Payload CMS + PostgreSQL",
    intro:
      "When a client needs more than a marketing site — accounts, roles, uploads, an editorial workflow, an app that lives at the same URL — Payload runs inside the Next.js app on PostgreSQL. One codebase, one deploy, a fully typed content model, and an admin UI your client's team can use on day one.",
    deliverables: [
      "Content model designed as typed Payload collections and globals",
      "Payload admin inside the Next.js app, with roles, access control and uploads",
      "PostgreSQL schema, migrations and seed data",
      "Server-rendered front end with live preview and draft workflows",
      "Auth, forms and integrations built as Payload endpoints and hooks",
      "Hosting setup with backups and a deploy pipeline",
    ],
    signals: [
      "The brief mixes a marketing site with logged-in functionality",
      "The client needs granular editor roles and a real content workflow",
      "You want a code-first CMS that will not become a plugin graveyard",
    ],
    stack: ["Next.js", "Payload CMS", "PostgreSQL", "TypeScript", "Tailwind CSS", "Vercel"],
    seo: "White-label Next.js + Payload CMS + PostgreSQL builds for agencies: typed content models, admin UI, auth and live preview in one deployable app.",
    agencyTypes: ["branding-agencies", "full-service-agencies"],
  },
  "nextjs-sanity-prismic": {
    title: "Next.js + Sanity or Prismic",
    intro:
      "Hosted structured content for editorial teams that have outgrown page builders. We model content in Sanity or Prismic, build the Next.js front end with live preview, and set up the workflows — slices, references, localisation — so the client's editors publish without a developer in the loop.",
    deliverables: [
      "Content schema and studio configuration (Sanity) or custom types and slices (Prismic)",
      "Next.js front end with visual editing or live preview",
      "Image pipeline, localisation and redirects handled at the framework level",
      "Migration of existing content with a mapping document",
      "Editor training notes written in your brand",
      "Performance and SEO baseline verified before launch",
    ],
    signals: [
      "An editorial or multi-market site is being rebuilt",
      "The client wants a hosted CMS with real-time collaboration",
      "Marketing needs to launch pages without waiting for releases",
    ],
    stack: ["Next.js", "Sanity", "Prismic", "TypeScript", "GROQ", "Vercel"],
    seo: "Next.js with Sanity or Prismic, built white-label for agencies: structured content, live preview and localisation for editorial teams.",
    agencyTypes: ["branding-agencies", "digital-marketing-agencies"],
  },
  "nextjs-postgres-apps": {
    title: "Next.js applications on PostgreSQL",
    intro:
      "Client portals, dashboards, booking systems, internal tools and SaaS-style products: Next.js on PostgreSQL with Prisma, Drizzle or Kysely, depending on how much control the data layer needs. Scoped as a product, not a website — with a data model, auth, roles and the boring parts done properly.",
    deliverables: [
      "Product scope: user roles, flows, data model, integration list",
      "PostgreSQL schema with migrations, using Prisma, Drizzle or Kysely",
      "Auth, permissions and audit trails",
      "Server actions and route handlers for every integration",
      "Dashboards, tables, exports and notifications",
      "Deployment, monitoring and a maintenance plan",
    ],
    signals: [
      "A client is running the business on a spreadsheet and three Zapier zaps",
      "The brief includes logins, dashboards or workflows",
      "An agency wants to productise a service as software",
    ],
    stack: ["Next.js", "PostgreSQL", "Prisma", "Drizzle", "Kysely", "TypeScript"],
    seo: "White-label Next.js application development on PostgreSQL with Prisma, Drizzle or Kysely: portals, dashboards and internal tools for agency clients.",
    agencyTypes: ["full-service-agencies", "digital-marketing-agencies"],
  },
  "laravel-development": {
    title: "Laravel application development",
    intro:
      "For briefs that outgrow a CMS: PHP applications and APIs on Laravel, with the parts that matter to a client — accounts, permissions, payments, jobs, notifications — modelled properly instead of bolted onto a plugin.",
    deliverables: [
      "Application scope: user roles, flows, data model and integration list",
      "Laravel application with migrations, seeders and queued jobs",
      "Authentication, permissions and an audit trail",
      "REST or JSON APIs for the front end, mobile apps or a WordPress site",
      "Payments, notifications and third-party integrations",
      "Deployment, backups and a maintenance plan",
    ],
    signals: [
      "The requirement is an application with a marketing site attached, not the other way round",
      "A client's process needs custom business logic, roles and reporting",
      "An existing PHP application needs rescuing or extending",
    ],
    stack: ["Laravel", "PHP", "MySQL", "PostgreSQL", "REST APIs", "Queues"],
    seo: "White-label Laravel development for agencies: PHP applications, APIs, auth and integrations for briefs that outgrow a CMS.",
    agencyTypes: ["full-service-agencies", "digital-marketing-agencies"],
  },
  "shopify-development": {
    title: "White-label Shopify development",
    intro:
      "Theme customisation, Liquid sections, app integrations and migrations for agencies whose clients sell on Shopify. We work in your Shopify Partner account or the client's store as staff, build in a theme copy, and hand over a store the client's team can run.",
    deliverables: [
      "Theme customisation or custom sections in Liquid and JSON templates",
      "Metafields and metaobjects for structured product content",
      "App integrations: reviews, subscriptions, loyalty, shipping",
      "Checkout extensibility and Shopify Functions where the plan allows",
      "Migrations from WooCommerce, Magento or legacy platforms with redirects",
      "Speed and conversion pass before handover",
    ],
    signals: [
      "A client's theme needs changes the editor cannot make",
      "A migration to Shopify is scoped and needs a developer",
      "Product pages need structured content the theme does not support",
    ],
    stack: ["Shopify", "Liquid", "Shopify Functions", "Metaobjects", "JavaScript"],
    seo: "White-label Shopify development for agencies: theme customisation, Liquid sections, app integrations and migrations, delivered under your brand.",
    agencyTypes: ["branding-agencies", "web-design-agencies", "digital-marketing-agencies"],
  },
  "webflow-development": {
    title: "White-label Webflow development",
    intro:
      "Figma to Webflow with a clean class system, CMS collections and interactions that match the prototype. Built in your Webflow workspace or the client's, so the site — and the credit — stays with you.",
    deliverables: [
      "Figma to Webflow build with a documented class naming system",
      "CMS collections, filters and dynamic templates",
      "Interactions and animations to match your prototype",
      "Forms, integrations and tracking",
      "Accessibility and SEO settings configured",
      "Client editing guide in your brand",
    ],
    signals: [
      "A design agency wants a no-code handover with a designer-friendly editor",
      "A marketing site needs to launch fast and be edited by non-developers",
      "A Webflow site has grown messy and needs a clean rebuild",
    ],
    stack: ["Webflow", "Webflow CMS", "Interactions", "Finsweet attributes", "JavaScript"],
    seo: "White-label Webflow development for agencies: Figma to Webflow, CMS, interactions and clean class structure, built in your workspace.",
    agencyTypes: ["branding-agencies", "web-design-agencies"],
  },
};
