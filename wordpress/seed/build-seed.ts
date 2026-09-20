/**
 * Turns the typed content in /content into one JSON file the seeding script
 * can post into WordPress.
 *
 * Run with Node's type stripping, from the repo root:
 *   node --experimental-strip-types wordpress/seed/build-seed.ts
 *
 * The content modules only ever import types, which strip-types removes, so
 * no build step or path-alias resolution is needed.
 */

import fs from "node:fs";
import path from "node:path";
import { pillars } from "../../content/pillars.ts";
import { agencyTypes } from "../../content/agency-types.ts";
import { buildDetails } from "../../content/service-details-build.ts";
import { automateDetails } from "../../content/service-details-automate.ts";
import { growDetails } from "../../content/service-details-grow.ts";
import { supportDetails } from "../../content/service-details-support.ts";
import { work, workCategories } from "../../content/work.ts";
import { process as processSteps } from "../../content/process.ts";
import { promises, protectionClauses } from "../../content/promises.ts";
import { faqs, pricingFaqs } from "../../content/faqs.ts";
import { engagementModels } from "../../content/stack.ts";
import { team } from "../../content/founder.ts";
import { clients, featuredClients } from "../../content/clients.ts";
import { testimonials } from "../../content/testimonials.ts";

const details = { ...buildDetails, ...automateDetails, ...growDetails, ...supportDetails };
const lines = (list: readonly string[] | undefined) => (list ?? []).join("\n");

const seed = {
  generatedAt: new Date().toISOString(),

  taxonomies: {
    pillar: pillars.map((p) => ({ slug: p.id, name: p.name, description: p.tagline })),
    work_category: workCategories.filter((c) => c !== "All").map((name) => ({ slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name })),
    region: [...new Set(work.map((w) => w.region))].map((name) => ({ slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name })),
    faq_group: [
      { slug: "general", name: "General" },
      { slug: "pricing", name: "Pricing" },
    ],
  },

  service: pillars.flatMap((pillar) =>
    pillar.services.map((service, index) => {
      const detail = details[service.slug];
      return {
        slug: service.slug,
        title: service.name,
        menu_order: index,
        terms: { pillar: [pillar.id] },
        acf: {
          heading: detail?.title ?? service.name,
          summary: service.summary,
          intro: detail?.intro ?? "",
          deliverables: lines(detail?.deliverables),
          signals: lines(detail?.signals),
          stack: lines(detail?.stack),
          seo_description: detail?.seo ?? "",
        },
        // relationships are linked in a second pass, once every post has an id
        links: { agency_types: detail?.agencyTypes ?? [] },
      };
    }),
  ),

  agency_type: agencyTypes.map((type, index) => ({
    slug: type.slug,
    title: type.name,
    menu_order: index,
    acf: {
      problem: type.problem,
      relief: type.relief,
      intro: type.intro,
      workflow: lines(type.workflow),
      seo_description: type.seo,
    },
    links: { services: type.services },
  })),

  case_study: work.map((item, index) => ({
    slug: item.slug,
    title: item.title,
    menu_order: index,
    terms: {
      work_category: [item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")],
      region: [item.region.toLowerCase().replace(/[^a-z0-9]+/g, "-")],
    },
    acf: {
      client: item.client,
      role: item.role,
      summary: item.summary,
      delivered: lines(item.delivered),
      stack: lines(item.stack),
      live_url: item.url ?? "",
    },
    /** The screenshot already in /public — uploaded to the media library by the seeder. */
    image: item.image ?? null,
  })),

  process_step: processSteps.map((step, index) => ({
    slug: step.id,
    title: step.name,
    menu_order: index,
    acf: { step_key: step.id, turnaround: step.turnaround, summary: step.summary, artefact: step.artefact },
  })),

  plan: engagementModels.map((model, index) => ({
    slug: model.id,
    title: model.name,
    menu_order: index,
    acf: {
      plan_key: model.id,
      best_for: model.bestFor,
      includes: lines(model.includes),
      price_from: model.from ?? "",
      period: model.period ?? "",
      badge: model.badge ?? "",
    },
  })),

  faq: [
    ...faqs.map((f, index) => ({ slug: "", title: f.q, menu_order: index, terms: { faq_group: ["general"] }, acf: { answer: f.a } })),
    ...pricingFaqs.map((f, index) => ({ slug: "", title: f.q, menu_order: 100 + index, terms: { faq_group: ["pricing"] }, acf: { answer: f.a } })),
  ],

  promise: promises.map((p, index) => ({ slug: p.id, title: p.label, menu_order: index, acf: { promise_key: p.id, detail: p.detail } })),

  clause: protectionClauses.map((c, index) => ({ slug: "", title: c.title, menu_order: index, acf: { body: c.body } })),

  team_member: team.map((member, index) => ({
    slug: "",
    title: member.name,
    menu_order: index,
    acf: {
      role: member.role,
      headline: member.headline ?? "",
      bio: member.bio ?? "",
      quote: member.quote ?? "",
      facts: lines(member.facts),
      linkedin: member.linkedin,
    },
    image: member.photo ?? null,
  })),

  testimonial: testimonials.map((t, index) => ({
    slug: "",
    title: t.name,
    menu_order: index,
    acf: {
      quote: t.quote,
      person_name: t.name,
      person_role: t.role,
      agency: t.agency,
      country: t.country,
      work: t.work,
      // seeded rows carry no permission record on purpose: the front end hides
      // any testimonial without one, so nothing goes live unasked
      consent: "",
    },
  })),

  client: clients.map((client, index) => {
    const featured = featuredClients.find((f) => f.name === client.name);
    return {
      slug: "",
      title: client.name,
      menu_order: featured ? featuredClients.indexOf(featured) : 50 + index,
      acf: {
        country: client.country,
        work: client.work,
        url: client.url ?? "",
        featured: Boolean(featured),
        logo_fill: Boolean(featured?.logoFill),
      },
      image: featured?.logo ?? null,
    };
  }),
};

const out = path.join(import.meta.dirname, "content.json");
fs.writeFileSync(out, JSON.stringify(seed, null, 1));
const counts = Object.entries(seed)
  .filter(([, value]) => Array.isArray(value))
  .map(([key, value]) => `${key}: ${(value as unknown[]).length}`)
  .join(", ");
console.log(`${out}\n${counts}`);
