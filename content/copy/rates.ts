import { page } from "@/content/copy/schema";
import { LIVE_FIGURES, banner, ctaBand, faqSection, intro, ratesSection, seo } from "@/content/copy/sections";

/** /rates — the plans and the pricing questions. The plans come from Plans, the questions from FAQs. */
export const ratesCopy = page("rates", "/rates", "Rates", {
  seo: seo(
    "Rates — simple monthly plans for agencies",
    "White-label pricing for agencies: monthly plans sized by how many client projects you run, with anything outside a plan scoped and quoted first.",
  ),

  banner: banner({
    eyebrow: "Rates",
    heading: "Simple monthly plans, priced up front.",
    lede: "Match your spend to your actual client workload instead of committing to a full-time salary. Pick the plan that fits how many active projects you run, and move up or down as that number changes.",
    factsHelp: `${LIVE_FIGURES} Today that is the number of plans and how fast a scope comes back.`,
  }),

  intro: intro({
    eyebrow: "How pricing works",
    heading: "Priced by workload, not by hours.",
    subheading: "A plan covers the projects you run in parallel; anything bigger is scoped and quoted before it starts.",
    paragraphs: [
      "Hourly billing punishes the agency for asking questions and rewards the supplier for being slow. We do the opposite. Pick the monthly plan that matches how many client projects you have open at once, and the production capacity comes with it — builds, fixes, automation, SEO implementation and the maintenance that keeps a site alive.",
      "Work that sits outside a plan — a migration, a store from scratch, a rescue — gets its own written scope with a fixed price, sent {scope_time} of the brief. No plan is required to send that first brief, and moving between tiers takes a message, not a renegotiation.",
    ],
    points: [
      { title: "No lock-in", text: "Monthly, cancel or change tier as your pipeline changes." },
      { title: "Fixed-price projects", text: "Every scope is agreed in writing before work begins." },
      { title: "Your margin is yours", text: "What you charge your client is never our business." },
      { title: "Nothing hidden", text: "Third-party costs are passed through at cost, listed by name." },
    ],
    links: [
      { text: "The plans", url: "#rates" },
      { text: "Pricing questions", url: "#faq" },
    ],
    linksHelp: "Buttons that jump to a section below (#section) or to another page (/page). {scope_time} in a paragraph becomes the scope turnaround from Process steps.",
  }),

  plans: ratesSection(),

  faq: faqSection(),

  cta: ctaBand(),
});
