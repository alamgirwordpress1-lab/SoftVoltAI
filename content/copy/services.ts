import { page, para, section, text } from "@/content/copy/schema";
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

  detail_top: section(
    "Every service page — top of the page",
    {
      eyebrow: text("Small line above the headline", "{pillar} · white-label"),
      fact_tools: text("Fact card — tooling label", "Tooling"),
      fact_best_for: text("Fact card — best-for label", "Best for"),
      intro_eyebrow: text("Intro — small line above the heading", "At a glance"),
      intro_heading: text("Intro — heading", "{service}, run the way agencies need it run."),
      intro_p1: para(
        "Intro — first paragraph",
        "Send the brief and a named producer turns it into a written scope: {deliverables} deliverables, each priced, with the assumptions and the tools listed — {tools}. Nothing is built until you have agreed that document, and the price on it is the price you pay.",
        undefined,
        4,
      ),
      intro_p2: para(
        "Intro — second paragraph",
        "{often_for}Everything ships under your agency's name — the staging link, the commits, the checklist and the handover — and your client never learns we were involved.",
        "{often_for} becomes \"It is the brief we see most often from …\" when the service has agency types, and nothing when it has none.",
        4,
      ),
      point_pillar: text("Key point — pillar label", "Pillar"),
      point_tools: text("Key point — tooling label", "Tooling"),
      point_often: text("Key point — agencies label", "Most often for"),
      jump_ships: text("\"On this page\" — what ships", "What ships"),
      jump_signals: text("\"On this page\" — when to send it", "When to send it"),
      jump_who: text("\"On this page\" — who it is for", "Who it is for"),
      jump_related: text("\"On this page\" — related", "Related services"),
    },
    "The same words on every service page. The headline, the paragraph under it and the lists come from each service under Services. In these fields {service} is the service's name, {pillar} its pillar, {deliverables} how many deliverables it lists and {tools} its tooling.",
  ),

  detail_sections: section(
    "Every service page — sections below",
    {
      ships_eyebrow: text("What ships — small line", "What ships"),
      ships_heading: text("What ships — heading", "What you get, written into the scope."),
      ships_text: para("What ships — paragraph", "Every item here appears in the scope document with a price against it. Nothing starts until you approve it."),
      signals_eyebrow: text("When to send it — small line", "When to send this brief"),
      signals_heading: text("When to send it — heading", "You will recognise the moment."),
      runs_eyebrow: text("How it runs — small line", "How it runs"),
      tools_eyebrow: text("Tooling — small line", "Tooling"),
      who_eyebrow: text("Built for — small line", "Built for"),
      who_heading: text("Built for — heading", "Agencies that send this brief most often."),
      who_link: text("Built for — link on each card", "How we work with you →"),
      related_eyebrow: text("Related — small line", "Also in {pillar}"),
      related_heading: text("Related — heading", "Related services."),
    },
    "The bands under the intro, the same on every service page. {pillar} is the service's pillar.",
  ),

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
