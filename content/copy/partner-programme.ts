import { items, link, page, section, text } from "@/content/copy/schema";
import { POINT_FIELDS, banner, ctaBand, intro, seo } from "@/content/copy/sections";

const opener = banner({
  eyebrow: "Become a partner",
  heading: "Partnership starts with one project, not a pitch deck.",
  lede: "We do not ask agencies to commit before they have seen the work. The first brief is a fixed-price project; everything after it gets easier.",
  factsHelp: "Leave these empty and the cards show the first three steps from \"How it starts\".",
});

/** /partner-programme — how a partnership starts. The plans come from Plans, the terms from Commitments. */
export const partnerProgrammeCopy = page("partner-programme", "/partner-programme", "Partner programme", {
  seo: seo(
    "Partner programme — become an agency partner",
    "Partner with SoftVolt AI: one fixed-price project first, then a retainer if the briefs keep coming. NDA and protection terms signed once.",
  ),

  banner: {
    ...opener,
    fields: {
      ...opener.fields,
      button: link("Button", "Send the first brief", "/contact"),
      button_secondary: link("Second button", "See how pricing works", "/rates"),
    },
  },

  intro: intro({
    eyebrow: "What a partnership is",
    heading: "A supplier you can put in front of nobody.",
    subheading: "No exclusivity, no minimum spend, no logo on your work — the partnership is simply that the next brief is easier than the last.",
    paragraphs: [
      "Most white-label arrangements start with a contract nobody has earned yet. Ours starts with a project. You send one brief, we scope it in writing, build it under your brand and hand it over with the documents your client can read. If that goes well, the second brief skips the introductions — we already know your stack, your conventions and how you like a handover written.",
      "Partners get the same production team, the same fixed prices and the same hours as anyone else. What changes is the paperwork: one NDA and one master agreement cover everything that follows, so each new project is a scope and a start date rather than a negotiation.",
    ],
    points: [
      { title: "One agreement", text: "Signed once, covering every project that follows it." },
      { title: "Your brand only", text: "We are never named to your client, in writing or in a call." },
      { title: "No exclusivity", text: "Keep your other suppliers. We are not asking for the lot." },
      { title: "Leave any time", text: "Plans are monthly; projects end when the handover is signed." },
    ],
    links: [
      { text: "How it starts", url: "#steps" },
      { text: "Ways to work", url: "#models" },
      { text: "The terms", url: "#terms" },
    ],
  }),

  steps: section(
    "How it starts",
    {
      eyebrow: text("Small line above the heading", "How it starts"),
      heading: text("Heading", "From first brief to standing retainer."),
      list: items("The steps", "Step", POINT_FIELDS, [
        { title: "Start with one brief", text: "No onboarding fee, no minimum. Send a real project and judge the scope, the communication and the delivery on that." },
        { title: "Sign the paperwork once", text: "Mutual NDA, agency protection terms and, for EU/UK data, the DPA — signed once, covering every project after." },
        {
          title: "Move to a retainer if it is recurring",
          text: "When the briefs keep coming, a monthly block of hours with a named producer costs less and schedules faster than project by project.",
        },
        { title: "Resell what we maintain", text: "Care plans, hosting management and reporting are built to be resold under your brand at your margin." },
      ]),
    },
  ),

  models: section(
    "Ways to work",
    {
      eyebrow: text("Small line above the heading", "Ways to work"),
      heading: text("Heading", "{Count} engagement models.", "{Count} becomes the number of plans, as a word."),
    },
    "The plans themselves are edited under Plans in the menu on the left.",
  ),

  terms: section(
    "The terms",
    {
      eyebrow: text("Small line above the heading", "Signed once"),
      heading: text("Heading", "What every partner gets in writing."),
    },
    "The terms themselves are edited under Commitments in the menu on the left.",
  ),

  cta: ctaBand({
    heading: "Send the first brief. Judge us on that.",
    accent: "",
    lede: "Scope and fixed price within two business days. The NDA, if you want it first, arrives before anything else.",
  }),
});
