import { page } from "@/content/copy/schema";
import { LIVE_FIGURES, banner, ctaBand, intro, seo } from "@/content/copy/sections";

/** /services — the four pillars. The pillar bands themselves come from Services and Pillars. */
export const servicesCopy = page("services", "/services", "Services", {
  seo: seo(
    "Services — build, automate, grow, support",
    "Every white-label service for agencies: WordPress, WooCommerce, headless Next.js, Shopify, Webflow, AI automation, SEO, ads and maintenance.",
  ),

  banner: banner({
    eyebrow: "Services",
    heading: "Four pillars. One partner. Your brand on everything.",
    lede: "Every service is delivered under your agency's name with a written scope, a named producer and a fixed price. Pick the one that matches the brief, or send the brief and let the scope tell you.",
    factsHelp: `${LIVE_FIGURES} Today that is the number of services in each pillar.`,
  }),

  intro: intro({
    eyebrow: "What we cover",
    heading: "{count} services, one white-label contract.",
    subheading: "One partner for the build, the automation, the traffic and the upkeep — under your agency's name, start to finish.",
    paragraphs: [
      "Agencies come to us with one of four problems: a build they cannot staff, a manual process eating the team's week, traffic that has stalled, or a live site nobody is looking after. Each pillar below answers one of those. Inside them sit the specifics — WordPress and WooCommerce, headless front ends on Next.js with Payload or Sanity, Shopify and Webflow, AI automation and internal tools, technical and local SEO, Google and Meta ads, maintenance, migration and rescue.",
      "Every service is scoped in writing before anything starts, carries a fixed price and a named producer, and ships under your brand. Your client never sees us, and your team keeps the relationship, the strategy and the invoice.",
    ],
    points: [
      { title: "Written scope first", text: "Line-by-line, priced, agreed before a single commit." },
      { title: "One producer", text: "A named person answers on your hours, not a ticket queue." },
      { title: "Your brand throughout", text: "Staging URLs, documents and handover all carry your name." },
      { title: "Defects on us", text: "Anything that breaks against the agreed scope is fixed at our cost." },
    ],
    linksHelp: "Leave these empty and the page links to each pillar below. {count} in the heading becomes the number of services.",
  }),

  cta: ctaBand(),

  detail_cta: {
    ...ctaBand({
      heading: "Send the brief —",
      accent: "get a fixed price within two business days.",
      lede: "Tell us what the {service} project needs and when. Client names can wait until the NDA is signed; a named producer replies within one business day.",
    }),
    title: "Every service page — closing call to action",
    help: "The dark band at the bottom of every one of these pages. Its two buttons come from Headless settings → Calls to action.",
  },
});
