import { page, para, section, text } from "@/content/copy/schema";
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

  detail_top: section(
    "Every agency page — top of the page",
    {
      seo_title: text("Page title in Google", "White-label for {agency}", "\"· SoftVolt AI\" is added after it. The description comes from each agency type's SEO description."),
      eyebrow: text("Small line above the headline", "Who we help"),
      heading: text("Headline", "For {agency}"),
      fact_services: text("Fact card — services label", "Services that fit"),
      fact_commitment: text("Fact card — commitment label", "Commitment"),
      intro_eyebrow: text("Intro — small line above the heading", "At a glance"),
      intro_heading: text("Intro — heading", "What {agency} hand over."),
      intro_p1: para(
        "Intro — first paragraph",
        "{problem} That is the part we take. The brief comes to a named producer, goes back to you as a written scope with a fixed price {scope_time}, and the build runs under your agency's name from the staging link to the handover.",
        undefined,
        4,
      ),
      intro_p2: para(
        "Intro — second paragraph",
        "The services that fit this kind of agency most often are {top_services} — but the list below is the full set, and a brief can mix them. {commitment}",
        "{top_services} becomes the first four services linked to the agency type; {commitment} becomes the no-contact commitment in full.",
        4,
      ),
      point_problem: text("Key point — problem label", "The blocker"),
      point_relief: text("Key point — change label", "What changes"),
      jump_problem: text("\"On this page\" — the problem", "The problem"),
      jump_workflow: text("\"On this page\" — how it runs", "How it runs"),
      jump_services: text("\"On this page\" — services", "Services that fit"),
      jump_promises: text("\"On this page\" — commitments", "What you get in writing"),
    },
    "The same words on every agency page. The paragraph under the headline and the lists come from each agency type under Agency types. In these fields {agency} is the kind of agency (\"SEO agencies\"), {problem} its problem line, and {scope_time} how fast a scope comes back.",
  ),

  detail_sections: section(
    "Every agency page — sections below",
    {
      problem_eyebrow: text("The problem — small line", "The problem"),
      relief_eyebrow: text("What changes — small line", "What changes"),
      workflow_eyebrow: text("How it runs — small line", "How the engagement runs"),
      workflow_heading: text("How it runs — heading", "{Count} steps, each one written down.", "{Count} becomes the number of steps the agency type lists, as a word."),
      services_eyebrow: text("Services — small line", "Services that fit"),
      services_heading: text("Services — heading", "What {agency} usually send us."),
      promises_eyebrow: text("Commitments — small line", "On every project"),
      promises_heading: text("Commitments — heading", "The commitments."),
    },
    "The bands under the intro, the same on every agency page.",
  ),

  detail_cta: {
    ...ctaBand(),
    title: "Every agency page — closing call to action",
    help: "The dark band at the bottom of every one of these pages. Its two buttons come from Headless settings → Calls to action.",
  },
});

