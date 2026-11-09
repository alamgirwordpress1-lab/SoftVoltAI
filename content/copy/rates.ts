import { page } from "@/content/copy/schema";
import { link, para, section, text } from "@/content/copy/schema";
import { LIVE_FIGURES, articleSection, banner, ctaBand, faqSection, intro, packageSection, seo } from "@/content/copy/sections";

/**
 * /pricing (was /rates) — the plans, how a project is priced, and the pricing
 * questions. The plans come from Plans, the questions from FAQs. The WordPress
 * page that holds these words has the slug "pricing".
 */
export const ratesCopy = page("rates", "/pricing", "Pricing", {
  seo: seo(
    "White label web development, SEO and AI pricing",
    "White-label pricing for agencies in USD: fixed-price websites and WooCommerce stores, monthly care and SEO plans, AI chat and voice agents, and an AI-ready website bundle.",
  ),

  banner: banner({
    eyebrow: "Pricing",
    heading: "White label web development, SEO and AI pricing.",
    lede: "Fixed prices for the build, monthly plans for what comes after it, and AI agents your clients are already asking about. These are your costs: add your margin and quote your client the same day.",
    factsHelp: `${LIVE_FIGURES} Today that is how many monthly plans there are and how fast a scope comes back.`,
  }),

  intro: intro({
    eyebrow: "How pricing works",
    heading: "Build once, then grow every month.",
    subheading: "Clients no longer buy a website on its own. They want it found in Google and AI search, and they want it to answer leads at night.",
    paragraphs: [
      "So the pricing follows the client's journey. A website or store is a one-off fixed price. After launch, a monthly plan keeps it updated, ranks it in Google and in AI answers (AEO and GEO), and adds an AI chat and voice agent that books calls and captures leads. Every price here is what you pay us; what you charge your client is yours to set.",
      "Anything that does not fit a package (a large migration, a custom app, a rescue) gets its own written scope with a fixed price, sent {scope_time} of the brief. No plan is needed to send that first brief.",
    ],
    points: [
      { title: "Fixed prices, in USD", text: "Builds are priced per scope before work starts." },
      { title: "No lock-in", text: "Monthly plans run month to month, per client site." },
      { title: "Your margin is yours", text: "White-label: your brand, your invoice, your price." },
      { title: "Nothing hidden", text: "Hosting, licences and AI usage passed through at cost." },
    ],
    links: [
      { text: "AI-ready bundle", url: "#bundle" },
      { text: "Websites", url: "#builds" },
      { text: "Monthly plans", url: "#monthly" },
      { text: "AI automation", url: "#ai" },
    ],
    linksHelp: "Buttons that jump to a section below (#section) or to another page (/page). {scope_time} in a paragraph becomes the scope turnaround from Process steps.",
  }),

  bundle: section(
    "AI-ready website bundle",
    {
      eyebrow: text("Small line above the name", "Best value for new clients"),
      name: text("Bundle name", "AI-ready website bundle"),
      lede: para(
        "Paragraph",
        "Everything a small business client needs in one price you can resell: a designed and built website, three months of SEO and AI search work, and an AI agent that answers and books leads from day one.",
        undefined,
        3,
      ),
      price: text("Price", "$4,990"),
      compare: text("Small text beside the price", "one-time · about $5,500 bought separately"),
      includes: para(
        "What is included, one per line",
        [
          "Business website, designed and built (up to 8 templates)",
          "3 months of the Grow plan: care, SEO and AEO/GEO",
          "AI chat and voice agent set up, trained on the client's business",
          "Lead alerts to email, WhatsApp or the client's CRM",
          "Monthly reports with your agency's logo",
        ].join("\n"),
      ),
      button: link("Button", "Send us a brief", "/contact"),
      button_2: link("Second button", "Book a 20-min scoping call", "/contact#call"),
    },
    "The featured package at the top of the Pricing page.",
  ),

  builds: packageSection("Websites and stores", {
    eyebrow: "Websites and stores",
    heading: "Fixed-price builds.",
    lede: "One-off prices for a build from an approved design or a full design and build. Every build includes responsive layouts, Core Web Vitals, SEO basics, a QA checklist and a clean handover.",
    price_note: "One-time · fixed price per scope",
    button: ["Send us a brief", "/contact"],
    note: "Extra unique template: $340. Content entry, animation and extra integrations are priced on their own line in the scope.",
    packages: [
      { name: "Landing page", best_for: "One campaign page from your design, built to convert and load fast.", price: "$1,190", includes: ["One template, responsive", "Form and tracking set up", "Speed and SEO basics"] },
      { name: "Website build", best_for: "A WordPress site built from your approved Figma or XD design.", price: "$2,390", includes: ["Up to 5 unique templates", "Gutenberg, ACF or Elementor", "Editable by your client"] },
      { name: "Business website", best_for: "Design and build together, when your client has no design yet.", price: "$3,490", badge: "Popular", includes: ["Design and build, up to 8 templates", "Copy placement and SEO setup", "Forms, analytics and consent"] },
      { name: "Redesign and migration", best_for: "A new site that keeps the old one's rankings.", price: "$3,490", includes: ["Every old URL mapped and redirected", "Titles, meta and schema carried over", "Launch checks in Search Console"] },
      { name: "WooCommerce store", best_for: "A store built from your approved design.", price: "$4,490", includes: ["Products, payments and shipping", "Order emails in the client's brand", "Checkout tested end to end"] },
      { name: "Headless WordPress + Next.js", best_for: "WordPress editing with a Next.js front end that loads fast and scores well.", price: "$5,990+", includes: ["Next.js front end on Vercel or Cloudflare", "Preview and publish from WordPress", "Our own NexWordX builder available"] },
    ],
  }),

  monthly: packageSection("Monthly plans", {
    eyebrow: "After launch",
    heading: "Monthly plans per client site.",
    lede: "Turn every launch into monthly income. Care keeps the site safe, Grow gets it found in Google and in AI answers, and Grow + AI adds an agent that answers leads around the clock.",
    price_note: "Per client site · billed monthly · cancel any time",
    button: ["Start with one site", "/contact"],
    note: "Prices are per site. Ten sites or more on the same plan get 10% off.",
    packages: [
      { name: "Care", best_for: "Keep a finished site updated, backed up and secure.", price: "$139", period: "/month", includes: ["Updates tested on staging first", "Daily off-site backups", "Security and uptime monitoring", "Small edits each month", "Branded monthly report"] },
      { name: "Grow", best_for: "Care plus SEO that gets the site found in Google and in AI search.", price: "$499", period: "/month", badge: "Recommended", includes: ["Everything in Care", "Technical and on-page SEO", "AEO and GEO: content shaped for AI answers", "Google Business Profile and local SEO", "Rankings and AI visibility report"] },
      { name: "Grow + AI", best_for: "Grow plus an AI agent that answers, qualifies and books leads.", price: "$849", period: "/month", includes: ["Everything in Grow", "AI chat and voice agent on the site", "Bookings into Google Calendar or Calendly", "2 n8n lead automations included", "Agent tuned every month from real chats"] },
    ],
  }),

  ai: packageSection("AI automation", {
    eyebrow: "AI automation",
    heading: "AI agents and automation, on their own.",
    lede: "For clients who already have a site. We set up our own SoftVoltAI Voice Agent under your brand, train it on the client's business, and connect the leads to the tools they already use.",
    price_note: "Plus AI usage at cost",
    button: ["Ask about AI", "/contact"],
    note: "Prefer to run it yourself? The SoftVoltAI Voice Agent plugin is free on WordPress.org, and Pro licences start at $10 a month.",
    packages: [
      { name: "AI chat and voice agent", best_for: "An agent that talks to visitors by voice or text, answers from the client's facts and books calls.", price: "$149", period: "/month + $490 setup", badge: "New", includes: ["Trained on the client's services and prices", "Voice and text, in the client's brand", "Bookings, hand-off to a person, lead inbox", "WhatsApp, Messenger and Telegram", "Monthly tuning from real conversations"] },
      { name: "Workflow automation (n8n)", best_for: "Connect forms, CRM, email and ads so leads are followed up without anyone copying data.", price: "$390", period: "per workflow", includes: ["Mapped and agreed before it is built", "Lead routing, follow-ups, reports", "Error alerts and retries", "Handed over with documentation"] },
    ],
  }),

  plans: section(
    "Dedicated team",
    {
      eyebrow: text("Small line above the heading", "Dedicated team"),
      heading: text("Heading", "Steady work? Reserve a team by the month."),
      lede: para(
        "Paragraph",
        "For agencies sending several projects every month. Instead of pricing each build, reserve capacity: a named producer, a shared channel and a set number of projects running at once.",
      ),
      link: link("Text link", "", ""),
      button: link("Button on every plan", "Book a 20-min scoping call", "/contact#call"),
      price_note: text("Under a price", "Billed monthly · no long-term contract"),
      no_price: text("Instead of a price, when a plan has none", "Let's talk"),
      no_price_note: text("Under \"Let's talk\"", "Scoped and quoted around your volume"),
      note: para("Note under the plans", "Move up or down a plan as your workload changes. Builds inside a plan are not charged again."),
    },
    "Monthly capacity plans for agencies with a steady stream of work. The plans themselves (names, prices, what is included) are edited under Plans in the menu on the left.",
  ),

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
