import { items, link, page, para, section, text } from "@/content/copy/schema";
import { LIVE_FIGURES, banner, ctaBand, intro, seo, workSection } from "@/content/copy/sections";

const NOTE_FIELDS = { name: { label: "Name, exactly as it appears on the cards", kind: "text" as const }, note: { label: "What it means", kind: "para" as const } };

const work = workSection({
  eyebrow: "Every build",
  heading: "All eight, filtered the way you work.",
  lede: "The full set, in one grid. Filter by the kind of build, open the live site from the card, or read the case study behind it.",
});

/** /case-studies — four ways into the same builds. The builds come from Case studies. */
export const caseStudiesCopy = page("case-studies", "/case-studies", "Case Studies", {
  seo: seo(
    "Case studies — builds you can open",
    "Eight live builds you can open: headless WordPress on Next.js, WooCommerce stores and technical-SEO sites, read by type, market and stack.",
  ),

  banner: banner({
    eyebrow: "Case studies",
    heading: "Builds you can open, not logos you have to trust.",
    lede: "White-label means partner work is never shown without written permission — and when it is, it carries your name. What we can show are builds our founder delivered as developer, project manager and team lead at a UK agency.",
    factsHelp: `${LIVE_FIGURES} Today that is how many builds, where they were delivered and the tools used most.`,
  }),

  intro: intro({
    eyebrow: "How to read these",
    heading: "Eight builds, four ways in.",
    subheading: "Every one is live, public and linked — open them before you read a word we wrote.",
    paragraphs: [
      "Most agency portfolios are a wall of logos. This page is the opposite: {count} finished websites, each with the brief it answered, the stack it was built on and a link to the running site. They were delivered for clients in {regions} — WooCommerce stores, headless WordPress front ends on Next.js, and corporate sites where the forms have to work every day.",
      "Read them the way that matches your brief. Start with the spotlight, browse by the kind of work, check the market and the stack, or filter the full set at the bottom. Whichever way you come in, the facts are the same ones — nothing on this page is an outcome we cannot show you.",
    ],
    points: [
      { title: "Delivered, not pitched", text: "Each build shipped and is still live. The links go to the real site, not a screenshot." },
      { title: "Named honestly", text: "These are our founder's builds at a UK agency, said plainly on every card." },
      { title: "Your name on the next one", text: "Partner work only appears with written permission — and under your agency's brand." },
      { title: "Same team, same hours", text: "The people who built these are the ones who take your brief, on UK and US hours." },
    ],
    links: [
      { text: "Spotlight", url: "#spotlight" },
      { text: "By what we built", url: "#by-type" },
      { text: "By market and stack", url: "#by-market" },
      { text: "Every build", url: "#work" },
      { text: "How we publish", url: "#format" },
    ],
  }),

  spotlight: section(
    "Spotlight",
    {
      eyebrow: text("Small line above the heading", "Spotlight"),
      heading: text("Heading", "Start with the one that shows the most."),
      lede: para("Paragraph", "One build in full: what the brief needed, what was actually made, and the link to open it yourself."),
      link: text("Link to the full case study", "Read the case study"),
    },
    "The first case study in the Case studies list is the one shown here.",
  ),

  by_type: section(
    "By what we built",
    {
      eyebrow: text("Small line above the heading", "By what we built"),
      heading: text("Heading", "Four kinds of brief, eight finished builds."),
      lede: para(
        "Paragraph",
        "The same four kinds of work an agency sends us today. Each group lists the builds it covers, so you can go straight to the one closest to your client's brief.",
      ),
      notes: items(
        "What each kind of build means",
        "Kind",
        NOTE_FIELDS,
        [
          { name: "Headless & Next.js", note: "WordPress stays the editor the client already knows; the front end is a Next.js app on its own deploy." },
          { name: "E-commerce", note: "WooCommerce stores — catalogue, checkout, payment, and the maintenance that follows the launch." },
          { name: "Corporate", note: "Sites where the pages have to be exact, the forms have to work and nothing may break on a Friday." },
          { name: "Agency & SEO", note: "Builds where the technical SEO shaped the structure instead of being a plugin added at the end." },
        ],
        { help: "The name has to match a Build type used on the case studies, or the note has nowhere to go." },
      ),
    },
  ),

  by_market: section(
    "By market and stack",
    {
      eyebrow: text("Small line above the heading", "By market and by stack"),
      heading: text("Heading", "Where each build was for, and what it was made with."),
      lede: para("Paragraph", "Two more ways to read the same eight builds: the market the client sells in, and the tools the work actually used."),
      markets_heading: text("Left column — heading", "The markets"),
      markets: items(
        "What each market means",
        "Market",
        NOTE_FIELDS,
        [
          { name: "United Kingdom", note: "Dhaka is UTC+6. A brief sent at 5pm London is picked up the next morning, with the reply waiting when you open." },
          { name: "United States", note: "The Dhaka day ends as the US east coast starts, so overnight progress is the normal rhythm rather than the exception." },
          { name: "Bangladesh", note: "Where the team sits. These are builds we can walk through end to end, from the first wireframe to the live site." },
        ],
        { help: "The name has to match a Market used on the case studies." },
      ),
      stack_heading: text("Right column — heading", "The stack, counted"),
      stack_lede: para(
        "Right column — paragraph",
        "Every tool named in a case study, with the number of builds it appears in. The ones we offer as a service link through to it.",
      ),
      stack_note: para(
        "Right column — note under the tools",
        "Nothing here is a logo wall: every count comes from a build listed on this page, and every tool is one the team uses in production.",
      ),
    },
  ),

  work: { ...work, fields: { ...work.fields, link: link("Text link", "-", "/case-studies", "Type - (a dash) as the link text to show no link.") } },

  format: section(
    "How we publish",
    {
      eyebrow: text("Small line above the heading", "The format"),
      heading: text("Heading", "Anonymised at the partner's request. Verified outcomes only."),
      paragraph: para(
        "Paragraph",
        "As partner projects launch, their case studies appear here in a fixed shape: the kind of agency and where it is, the brief as it arrived, the stack, what shipped, and the outcome we can prove — a Lighthouse score before and after, a checkout error rate, a migration with no lost URLs.",
        undefined,
        4,
      ),
      closing: para(
        "Closing line",
        "Never a business metric we cannot see, never a client name without the agency's written permission, and never a logo we have not earned.",
        "Set in darker type under the paragraph.",
      ),
    },
  ),

  cta: ctaBand(),

  detail_cta: {
    ...ctaBand({
      heading: "Send the brief —",
      accent: "get a fixed price within two business days.",
    }),
    title: "Every case study page — closing call to action",
    help: "The dark band at the bottom of every one of these pages. Its two buttons come from Headless settings → Calls to action.",
  },
});
