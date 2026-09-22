import { items, link, para, section, text } from "@/content/copy/schema";

/**
 * Sections that appear on more than one page. Each page calls these with its
 * own words where they differ, so the same band can read differently on the
 * home page and on an inner page — and each page's copy is edited on that page.
 */

export const FACT_FIELDS = { label: { label: "Small label", kind: "text" as const }, value: { label: "Fact", kind: "text" as const } };
export const POINT_FIELDS = { title: { label: "Title", kind: "text" as const }, text: { label: "Text", kind: "para" as const } };
export const LINK_FIELDS = { text: { label: "Link text", kind: "text" as const }, url: { label: "Goes to", kind: "text" as const } };
export const PARAGRAPH_FIELDS = { text: { label: "Paragraph", kind: "para" as const } };

export const LIVE_FIGURES = "Leave these empty and the page shows its own live figures, counted from the content.";

/* -------------------------------------------------------------- per page */

export const seo = (title: string, description: string) =>
  section(
    "Google & sharing",
    {
      title: text("Page title in Google", title, "The blue link in search results and the browser tab. \"· SoftVolt AI\" is added after it."),
      description: para("Description in Google", description, "The two lines under the title in search results and link previews. Keep it under 160 characters."),
    },
    "What search results and link previews show for this page. Nothing here appears on the page itself.",
  );

export const banner = (d: { eyebrow: string; heading: string; lede: string; facts?: { label: string; value: string }[]; factsHelp?: string }) =>
  section(
    "Banner",
    {
      eyebrow: text("Small line above the headline", d.eyebrow),
      heading: text("Headline", d.heading, "The page's one big heading."),
      lede: para("Paragraph under the headline", d.lede),
      facts: items("Fact cards beside the headline", "Fact", FACT_FIELDS, d.facts ?? [], {
        help: d.factsHelp ?? "Up to three short facts shown as cards on the right, on large screens.",
        slots: 3,
      }),
    },
    "The top of the page — the first thing a visitor reads.",
  );

export const intro = (d: {
  eyebrow: string;
  heading: string;
  subheading: string;
  paragraphs: string[];
  points?: { title: string; text: string }[];
  links?: { text: string; url: string }[];
  linksHelp?: string;
}) =>
  section(
    "Intro",
    {
      eyebrow: text("Small line above the heading", d.eyebrow),
      heading: text("Heading", d.heading),
      subheading: para("Line under the heading", d.subheading, "One sentence, set larger than the paragraphs.", 2),
      paragraphs: items(
        "Paragraphs",
        "Paragraph",
        PARAGRAPH_FIELDS,
        d.paragraphs.map((p) => ({ text: p })),
        { help: "Write [link text](/page) to turn words into a link.", slots: 4 },
      ),
      points: items("Key points", "Point", POINT_FIELDS, d.points ?? [], { help: "Short definitions under the paragraphs. Up to four read best." }),
      links: items("\"On this page\" links", "Link", LINK_FIELDS, d.links ?? [], {
        help: d.linksHelp ?? "Buttons that jump to a section below (#section) or to another page (/page).",
        slots: 6,
      }),
    },
    "The band straight under the banner: what this page covers, in a few sentences.",
  );

export const ctaBand = (d: { pill?: string; heading?: string; accent?: string; lede?: string } = {}) =>
  section(
    "Closing call to action",
    {
      pill: text("Small label", d.pill ?? "Next step"),
      heading: text("Heading", d.heading ?? "Let's build your next client project —"),
      accent: text("Words after the heading, in green", d.accent ?? "under your brand.", "Type - (a dash) to show none."),
      lede: para(
        "Paragraph",
        d.lede ?? "Send the brief and get a written scope with a fixed price within two business days. Client names can wait until the NDA is signed.",
      ),
    },
    "The dark band above the footer. Its two buttons come from Headless settings → Calls to action.",
  );

/* ------------------------------------------------------- shared sections */

export const faqSection = (d: { eyebrow?: string; heading?: string } = {}) =>
  section(
    "Questions",
    {
      eyebrow: text("Small line above the heading", d.eyebrow ?? "FAQ"),
      heading: text("Heading", d.heading ?? "The questions agencies ask before the first brief."),
      card_title: text("Side card — title", "Still unanswered?"),
      card_text: para(
        "Side card — text",
        "A 20-minute scoping call costs nothing and usually answers it. Or email [{email}](mailto:{email}).",
        "{email} becomes the contact email from Headless settings.",
      ),
      card_button: link("Side card — button", "Send us a brief", "/contact"),
      card_link: link("Side card — text link", "Book a call", "/contact#call"),
    },
    "The questions themselves are edited under FAQs in the menu on the left.",
  );

export const processSection = () =>
  section(
    "How it works",
    {
      eyebrow: text("Small line above the heading", "How it works"),
      heading: text("Heading", "Five steps. Each one leaves a document you can forward to your client."),
      lede: para(
        "Paragraph",
        "No black box. Every stage produces something written — a scope, a staging link, a checklist, a handover — so you always know where the work is without asking.",
      ),
      link: link("Text link", "What happens after the first brief", "/partner-programme"),
      artefacts: items(
        "Document cards",
        "Card",
        { title: { label: "Title", kind: "text" }, meta: { label: "Line on the right", kind: "text" } },
        [
          { title: "Brief received", meta: "northwind-digital · 17:04 London" },
          { title: "Scope & quote", meta: "v1 · within 2 business days" },
          { title: "Production", meta: "staging.northwind-digital.co.uk" },
          { title: "QA checklist", meta: "42 checks · published" },
          { title: "Handover", meta: "northwind-digital · launch day" },
        ],
        { help: "The card that slides in beside each step, in the same order as the steps. What is written inside each card is part of the illustration.", slots: 6 },
      ),
    },
    "The steps themselves are edited under Process steps in the menu on the left.",
  );

export const hoursSection = () =>
  section(
    "Working hours",
    {
      eyebrow: text("Small line above the heading", "Follow the sun"),
      heading: text("Heading", "Brief us at 5pm London. Review it at 9am."),
      lede: para(
        "Paragraph",
        "Dhaka is UTC+6 with no daylight saving, and we cover 09:00–23:00 local. Here is what that overlap looks like against your working day — including where it is thin.",
      ),
      city_label: text("Table — first column", "City · local time"),
      overlap_label: text("Table — last column", "Overlap"),
      footnote: para(
        "Note under the table",
        "Volt = your 09:00–18:00 that falls inside our coverage. Computed from your browser's clock, daylight saving included.",
        undefined,
        2,
      ),
    },
    "The cities in the table are edited under Clocks in the menu on the left.",
  );

export const protectionSection = () =>
  section(
    "Agency protection",
    {
      eyebrow: text("Small line above the heading", "Agency protection"),
      heading: text("Heading", "Your client stays yours. In writing."),
      lede: para(
        "Paragraph",
        "Most white-label sites mention an NDA once. These are the terms we work under on every project — the full text goes into your contract.",
      ),
      link: link("Text link", "How credentials and client data are handled", "/security", "Not shown on the Security page, which is where it points."),
      artefact: text("Label on the document card", "Agency protection agreement · schedule A", "The card is an illustration of the signed agreement; only this line is written."),
    },
    "The clauses themselves are edited under Protection clauses in the menu on the left.",
  );

export const ratesSection = () =>
  section(
    "Plans",
    {
      eyebrow: text("Small line above the heading", "Rates", "Not shown on the Rates page, where the banner introduces the plans."),
      heading: text("Heading", "Simple monthly plans built for how agencies actually work."),
      lede: para(
        "Paragraph",
        "Match your spend to your actual client workload instead of committing to a full-time salary. Pick the plan that fits how many active projects you run, and change plans as that number changes.",
      ),
      link: link("Text link", "How pricing works", "/rates"),
      button: link("Button on every plan", "Send us a brief", "/contact"),
      price_note: text("Under a price", "Billed monthly · no long-term contract"),
      no_price: text("Instead of a price, when a plan has none", "Let's talk"),
      no_price_note: text("Under \"Let's talk\"", "Scoped and quoted around your volume"),
      note: para(
        "Note under the plans",
        "Billed monthly — move up or down a plan as your client workload changes. Prefer to talk first? The scoping call is 20 minutes and free.",
      ),
    },
    "The plans themselves — names, prices, what is included — are edited under Plans in the menu on the left.",
  );

export const workSection = (d: { eyebrow?: string; heading?: string; lede?: string } = {}) =>
  section(
    "Builds",
    {
      eyebrow: text("Small line above the heading", d.eyebrow ?? "Work"),
      heading: text("Heading", d.heading ?? "Builds you can open, not logos you have to trust."),
      lede: para(
        "Paragraph",
        d.lede ??
          "Delivered by our founder as developer and team lead at a UK agency. Partner work is only ever shown here with written permission — and with your name on it, not ours.",
      ),
      link: link("Text link", "See all case studies", "/case-studies", "Type - (a dash) as the link text to show no link."),
    },
    "The builds themselves are edited under Case studies in the menu on the left.",
  );

export const teamSection = () =>
  section(
    "The team",
    {
      eyebrow: text("Small line above the heading", "Who does the work"),
      heading: text("Heading", "A named person, not a pool."),
      link: link("Text link", "More about the team", "/about", "Type - (a dash) as the link text to show no link."),
    },
    "The people themselves are edited under Team in the menu on the left.",
  );

export const agenciesSection = () =>
  section(
    "Who we help",
    {
      eyebrow: text("Small line above the heading", "Who we help"),
      heading: text("Heading", "Built for agencies that have already sold the work."),
      lede: para("Paragraph", "You own the client, the strategy and the invoice. We take the part that is blocking your calendar."),
      link: link("Text link", "How we work with each agency type", "/for"),
    },
    "The agency types themselves are edited under Agency types in the menu on the left.",
  );
