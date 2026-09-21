import { page, section, text } from "@/content/copy/schema";
import { LIVE_FIGURES, banner, ctaBand, intro, seo } from "@/content/copy/sections";

/** /for — who we work with. The agency cards come from Agency types. */
export const forCopy = page("for", "/for", "Agency Solutions", {
  seo: seo(
    "For agencies — who we work with",
    "White-label production for digital marketing, SEO, PPC, branding, web design and full-service agencies: how each engagement runs and what fits.",
  ),

  banner: banner({
    eyebrow: "Who we help",
    heading: "Built for agencies that have already sold the work.",
    lede: "You own the client, the strategy and the invoice. We take the part that is blocking your calendar. Pick the kind of agency you are and see how the engagement runs.",
    factsHelp: `${LIVE_FIGURES} Today that is the kinds of agency we serve and our no-contact commitment.`,
  }),

  intro: intro({
    eyebrow: "How this works",
    heading: "Your agency stays the agency.",
    subheading: "We are the production team behind the name on the invoice — never a second supplier your client has to meet.",
    paragraphs: [
      "Most of the agencies we work with are three to thirty people. They have won a website, a migration, a store, an automation or a retainer, and the work is bigger than the calendar. Rather than hiring for a spike, they hand the production to us and keep everything the client sees: the strategy, the presentation, the relationship and the margin.",
      "The {count} kinds of agency below each get their own page, because the brief that arrives from an SEO agency is nothing like the one that arrives from a branding studio. Pick the closest one and you will see the services that fit it, how a typical engagement runs, and what we need from you at each step.",
    ],
    points: [
      { title: "You own the client", text: "We never contact them, and never appear in a meeting unless you ask." },
      { title: "Under your brand", text: "Staging links, documents and handover carry your agency's name." },
      { title: "Fixed price per brief", text: "Scoped and agreed in writing before the work starts." },
      { title: "No retainer to start", text: "The first project is a project. A plan only follows if it suits you." },
    ],
    links: [
      { text: "Kinds of agency", url: "#agency-types" },
      { text: "Send a brief", url: "/contact" },
    ],
  }),

  types: section(
    "Kinds of agency",
    {
      eyebrow: text("Small line above the heading", "Who we work with"),
      heading: text("Heading", "Pick the kind of agency you are."),
      card_link: text("Link at the bottom of each card", "How we work with you →"),
    },
    "The cards themselves are edited under Agency types in the menu on the left. {count} in the intro becomes the number of agency types.",
  ),

  cta: ctaBand(),

  detail_cta: {
    ...ctaBand(),
    title: "Every agency page — closing call to action",
    help: "The dark band at the bottom of every one of these pages. Its two buttons come from Headless settings → Calls to action.",
  },
});

