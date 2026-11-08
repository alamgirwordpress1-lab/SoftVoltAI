import { page } from "@/content/copy/schema";
import { LIVE_FIGURES, articleSection, banner, ctaBand, faqSection, intro, ratesSection, seo } from "@/content/copy/sections";

/**
 * /pricing (was /rates) — the plans, how a project is priced, and the pricing
 * questions. The plans come from Plans, the questions from FAQs. The WordPress
 * page that holds these words has the slug "pricing".
 */
export const ratesCopy = page("rates", "/pricing", "Pricing", {
  seo: seo(
    "White label web development pricing for agencies",
    "White-label WordPress, web development and SEO pricing for agencies: monthly plans, fixed-price project scopes and what changes the cost of a build.",
  ),

  banner: banner({
    eyebrow: "Pricing",
    heading: "White label web development pricing for agencies.",
    lede: "Monthly plans sized by how many client projects you run, and a fixed price in writing for anything bigger. You know the cost before you quote your client, so your margin is set on day one.",
    factsHelp: `${LIVE_FIGURES} Today that is the number of plans and how fast a scope comes back.`,
  }),

  intro: intro({
    eyebrow: "How pricing works",
    heading: "Priced by workload, not by hours.",
    subheading: "A plan covers the projects you run in parallel; anything bigger is scoped and quoted before it starts.",
    paragraphs: [
      "Hourly billing punishes the agency for asking questions and rewards the supplier for being slow. We do the opposite. Pick the monthly plan that matches how many client projects you have open at once, and the production capacity comes with it: builds, fixes, automation, SEO implementation and the maintenance that keeps a site alive.",
      "Work that sits outside a plan (a migration, a store from scratch, a rescue) gets its own written scope with a fixed price, sent {scope_time} of the brief. No plan is required to send that first brief, and moving between tiers takes a message, not a renegotiation.",
    ],
    points: [
      { title: "No lock-in", text: "Monthly, cancel or change tier as your pipeline changes." },
      { title: "Fixed-price projects", text: "Every scope is agreed in writing before work begins." },
      { title: "Your margin is yours", text: "What you charge your client is never our business." },
      { title: "Nothing hidden", text: "Third-party costs are passed through at cost, listed by name." },
    ],
    links: [
      { text: "The plans", url: "#rates" },
      { text: "What sets the price", url: "#guide" },
      { text: "Pricing questions", url: "#faq" },
    ],
    linksHelp: "Buttons that jump to a section below (#section) or to another page (/page). {scope_time} in a paragraph becomes the scope turnaround from Process steps.",
  }),

  plans: ratesSection(),

  guide: articleSection("What sets the price", {
    eyebrow: "What sets the price",
    heading: "What changes the cost of a white-label build.",
    lede: "The same questions decide the price of every project. Knowing them helps you quote your client before you send us the brief.",
    blocks: [
      {
        title: "Templates matter more than pages",
        text: "A site with 40 pages built from six templates costs far less than a site with 12 pages that are all different. We price the number of unique layouts, the blocks inside them and how much of the content we enter for you.\n\nIf you are scoping a project yourself, count the templates first: home, a service page, a listing page, a single post, a contact page. Most brochure sites land between five and eight.",
      },
      {
        title: "Integrations and custom functionality",
        text: "Forms, a CRM, booking, membership, payments, multilingual content and anything that talks to another system add the most uncertainty. Each one is listed in the scope with what it will do, so there is no argument later about what was included.\n\nA plugin that already does the job is usually cheaper than custom code. Where it is not, we say why and price the custom work on its own line.",
      },
      {
        title: "WooCommerce and stores",
        text: "A store is priced on product types, variations, payment and shipping rules, and any subscriptions or bookings. A catalogue of 20 simple products and a catalogue of 2,000 products with variations and imports are different projects, and the scope says which one you are buying.",
      },
      {
        title: "Content, migration and SEO carry-over",
        text: "Moving an existing site means redirects, metadata, images and the content itself. We map every old URL to a new one so the client keeps their rankings, and we price the migration from the number of URLs and how clean the source is.",
      },
      {
        title: "Speed, accessibility and QA are included",
        text: "Core Web Vitals, basic accessibility, responsive checks and a written QA list are part of every build, not an add-on. A project is not finished until it passes them on a phone.",
      },
      {
        title: "What is never in our price",
        text: "Hosting, premium plugin licences, fonts, stock images and paid APIs are your client's costs. We list each one by name in the scope and pass them through at cost, or your client buys them directly. You never find a mark-up hidden inside a line item.",
      },
      {
        title: "How to set your own margin",
        text: "Because the price is fixed before work starts, you can quote your client with the margin you want and keep it. Most agencies quote their own day rate or package price and treat our scope as their cost of delivery. What you charge your client stays between you and them.",
      },
      {
        title: "How to get a price for your project",
        text: "Send the brief with whatever you have: a sitemap, a Figma file, a competitor link or a few lines of text. You get a written scope and a fixed price back {scope_time}. If you want to talk it through first, [book a 20-minute scoping call](/contact#call).",
      },
    ],
  }),

  faq: faqSection({ eyebrow: "Pricing FAQ", heading: "Questions agencies ask about white-label pricing." }),

  cta: ctaBand(),
});
