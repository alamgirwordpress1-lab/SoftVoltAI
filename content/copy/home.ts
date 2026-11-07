import { items, lines, link, page, para, section, text } from "@/content/copy/schema";
import { agenciesSection, faqSection, hoursSection, processSection, protectionSection, ratesSection, teamSection, workSection } from "@/content/copy/sections";

/** The home page, top to bottom. */
export const homeCopy = page("home", "/", "Home", {
  seo: section(
    "Google & sharing",
    {
      title: text("Page title in Google", "White-label web development & SEO for agencies · SoftVolt AI", "The blue link in search results and the browser tab. On the home page it is used exactly as written."),
      description: para(
        "Description in Google",
        "White-label web development, SEO and AI automation for UK, US, Canadian and Australian agencies: WordPress, Next.js and Laravel, built under your brand.",
        "The two lines under the title in search results and link previews. Keep it under 160 characters.",
      ),
    },
    "What search results and link previews show for the home page. Nothing here appears on the page itself.",
  ),

  banner: section(
    "Banner",
    {
      eyebrow: text("Small line above the headline", "White-label web development, SEO & AI automation for agencies"),
      headline: lines(
        "Headline",
        ["You win the client.", "We deliver the work.", "Your brand gets the credit."],
        "One line per row. The last row is set in green.",
      ),
      lede: para(
        "Paragraph under the headline",
        "Websites, WooCommerce stores, AI automation and SEO for agencies — built by a senior team that also ships its own WordPress plugins, delivered under your brand in UK and US hours.",
      ),
      legend_hq: text("Globe key — the green dot", "Dhaka HQ"),
      legend_markets: text("Globe key — the filled pins", "Markets we serve"),
      legend_eu: text("Globe key — the empty rings", "EU member states"),
      legend_drag: text("Hint under the globe", "Drag to rotate · any direction", "Shown on wide screens only."),
    },
    "The first screen. The two buttons come from Headless settings → Calls to action, and the ticks under them are the Commitments. The websites orbiting the globe are the Clients, and the pins on it are set in the design.",
  ),

  proof: section(
    "Facts row",
    {
      stats: items(
        "Facts",
        "Fact",
        { value: { label: "Number", kind: "text" }, label: { label: "What it counts", kind: "text" } },
        [{ value: "300+", label: "websites delivered for clients worldwide" }],
        {
          help: "Up to four, such as 120+ / sites delivered for agencies. Only numbers you can stand behind. Any slots left over are filled with figures counted from the site itself: plugins, plugins on WordPress.org and case studies.",
          slots: 4,
        },
      ),
    },
    "The row of numbers straight under the banner.",
  ),

  core: section(
    "Core services",
    {
      eyebrow: text("Small line above the heading", "What agencies brief us for"),
      heading: text("Heading", "The four services agencies brief us for most."),
      lede: para(
        "Paragraph",
        "Pick the one your client needs. Each comes back finished, tested and unbranded, with a fixed price agreed before we start.",
      ),
      link: link("Link beside the heading", "All services", "/services"),
      items: items(
        "Service cards",
        "Card",
        {
          name: { label: "Name", kind: "text" },
          url: { label: "Goes to", kind: "text" },
          outcome: { label: "One line: what the client gets", kind: "para" },
          includes: { label: "What is included (one per line)", kind: "para" },
          price: { label: "Price, e.g. From $1,500", kind: "text" },
          time: { label: "Time, e.g. 10–15 working days", kind: "text" },
        },
        [
          {
            name: "WordPress & WooCommerce",
            url: "/services/white-label-wordpress-development",
            outcome: "Business sites and online stores your client can edit themselves, built to WordPress coding standards.",
            includes: "Custom theme, ACF or Gutenberg blocks\nWooCommerce checkout, payments and shipping\nSpeed, SEO basics and accessibility checked",
            price: "",
            time: "",
          },
          {
            name: "Headless & Next.js",
            url: "/services/headless-wordpress-development",
            outcome: "Keep the WordPress your client knows, put a Next.js front end on it that loads fast and scores well.",
            includes: "Next.js on headless WordPress, Payload or Sanity\nPreview for editors, publish goes live in seconds\nHosting set up in your agency's name",
            price: "",
            time: "",
          },
          {
            name: "AI automation",
            url: "/services/ai-automation",
            outcome: "Chat and voice assistants, lead qualifying and workflows that take manual hours off an account.",
            includes: "AI chat and voice agents on the client's own facts\nCRM, forms and ads joined up with n8n or code\nHand-off to a human, and data kept under UK GDPR",
            price: "",
            time: "",
          },
          {
            name: "SEO & marketing",
            url: "/services/white-label-seo-services",
            outcome: "Search and ads work for the campaigns you have already sold, reported under your logo.",
            includes: "Technical, on-page and local SEO\nGoogle Ads and Meta Ads management\nMonthly report with your branding",
            price: "",
            time: "",
          },
        ],
        { help: "Four read best. Leave Price or Time empty and the card leaves it out.", slots: 6 },
      ),
    },
    "The services block near the top: the four most-briefed services as cards. The full list stays on /services.",
  ),

  products: section(
    "Our products",
    {
      eyebrow: text("Small line above the heading", "Built by us, not just for clients"),
      heading: text("Heading", "We ship our own WordPress plugins."),
      lede: para(
        "Paragraph",
        "Most white-label teams only sell hours. We also build and maintain plugins of our own, reviewed and listed on WordPress.org, so the code we put on your clients' sites is code we stand behind every day.",
      ),
      points: lines(
        "Points beside the figures",
        ["Reviewed by the WordPress.org plugin team", "Free versions anyone can install today", "The same team builds your client work"],
        "One per row. Leave empty to show only the figures.",
      ),
      button: link("Button under the products", "See all products", "/products"),
    },
    "The dark band listing the plugins from Products. New products appear here on their own; ones on WordPress.org are listed first.",
  ),

  demo: section(
    "White-label demo",
    {
      eyebrow: text("Small line above the heading", "White-label, demonstrated"),
      heading: text("Heading", "Your brand on the front. Our work underneath."),
      lede: para(
        "Paragraph",
        "Type your agency's name. The finished site credits you; move over it and the lens shows the staging server, the commits and the QA your client never sees.",
      ),
      sample_name: text("Agency name the demo starts with", "Northwind Digital", "What the name box says before a visitor types their own."),
      note: text("Note under the name box", "Nothing you type is stored."),
      field_label: text("Label above the name box", "Your agency name — try it"),
      colour_label: text("Label above the colour dots", "Brand colour"),
      client_name: text("Example site — the client's name", "Harbour Dental", "The pretend client whose finished website the demo shows."),
      client_url: text("Example site — web address", "harbour-dental.co.uk"),
      client_menu: lines("Example site — menu", ["Treatments", "Team", "Fees"], "One item per row."),
      client_button: text("Example site — button in the menu", "Book online"),
      client_heading: text("Example site — headline", "Gentle dentistry, five minutes from the harbour."),
      client_lede: para("Example site — paragraph", "Same-week appointments for new patients. Emergency slots held every morning."),
      client_cta: text("Example site — button under the headline", "Book a check-up"),
      client_cards: lines("Example site — the three cards", ["Check-ups", "Whitening", "Emergency"], "One card per row."),
      credit: text("Credit line on the example site", "Website by", "The visitor's agency name is written after it."),
      engine_note: text("Label on the dark layer under the lens", "client never sees this"),
    },
    "The interactive demo: a visitor types their agency's name and the finished client site credits them. The dark layer the lens reveals — staging address, code, commits, QA counts — is drawn in the design, not written here.",
  ),

  services: section(
    "Services",
    {
      eyebrow: text("Small line above the heading", "Services"),
      heading: text("Heading", "Build, automate, grow, support — one partner, one contract."),
      lede: para(
        "Paragraph",
        "Most white-label shops sell hours of development. Agencies also need the automation, the SEO implementation, the ad execution and the maintenance that keep a client. We cover all four.",
      ),
      link: link("Text link", "Explore every service", "/services"),
      includes: items(
        "What every build ships with",
        "Line",
        { label: { label: "Label", kind: "text" }, text: { label: "Text", kind: "text" } },
        [
          { label: "Staging", text: "A password-protected link on your domain, from day one" },
          { label: "QA", text: "A checklist signed off before anything reaches your client" },
          { label: "Handover", text: "A document your client can read, and the repo if you want it" },
        ],
        { help: "The list under the Build card's illustration.", slots: 4 },
      ),
      card_pill: text("Dark card — small label", "Not sure where it fits?"),
      card_heading: text("Dark card — heading", "Send the brief. The scope tells you which service — and what it costs."),
      card_steps: items(
        "Dark card — steps",
        "Step",
        { title: { label: "What happens", kind: "text" }, when: { label: "When", kind: "text" } },
        [
          { title: "A named producer replies", when: "Within 1 business day" },
          { title: "Scope, line by line, priced", when: "Within 2 business days" },
          { title: "Work starts on your approval", when: "Fixed price, your brand" },
        ],
        { slots: 4 },
      ),
      card_button: link("Dark card — button", "Send us a brief", "/contact"),
      card_note: text("Dark card — note", "Client names can wait until the NDA is signed."),
    },
    "The four pillar cards come from Services and Pillars in the menu on the left; everything else in this band is here.",
  ),

  stack: section(
    "Stack & proof",
    {
      eyebrow: text("Small line above the heading", "Stack & proof"),
      heading: text("Heading", "We sell headless WordPress and Next.js. This site is one."),
      lede: para(
        "Paragraph",
        "Most white-label shops sell headless builds from an Elementor page. This site is a Next.js App Router build with server components, self-hosted fonts and no tracking cookies — measured below in your browser, right now, not in a lab screenshot.",
      ),
      vitals_heading: text("Measurement card — heading", "This page, in your browser"),
      vitals_points: lines(
        "Measurement card — ticks under the numbers",
        ["Rendered on the server, hydrated only where something moves", "Dashes mean your browser does not expose that metric — we do not guess"],
        "One tick per row.",
      ),
    },
    "The tools listed underneath are edited under Stack in the menu on the left. The numbers in the card are measured in the visitor's own browser.",
  ),

  protection: protectionSection(),

  hours: hoursSection(),

  comparison: section(
    "Comparison table",
    {
      eyebrow: text("Small line above the heading", "The comparison"),
      heading: text("Heading", "In-house hire vs. freelancer vs."),
      heading_accent: text("Words after the heading, in green", "a white-label partner."),
      lede: para(
        "Paragraph",
        "Every agency hits the same build-or-buy decision once client demand stops arriving on a predictable schedule. Here is how the three options compare on the things that decide your margin.",
      ),
      col_dimension: text("Table — first column", "Dimension"),
      col_in_house: text("Table — second column", "In-house hire"),
      col_freelancer: text("Table — third column", "Freelancer"),
      footnote: para(
        "Note under the table",
        "* Median annual pay for web developers in the US, May 2025, excluding benefits, taxes and equipment. Source:",
        "The source's name and link are added after this, from Headless settings → Comparison table.",
        2,
      ),
      closing: para(
        "Closing card — text",
        "If hiring is what is capping your agency's growth, this table usually settles it. Start with one brief and judge the delivery, not the pitch.",
      ),
      closing_button: link("Closing card — button", "Send us a brief", "/contact"),
      closing_link: link("Closing card — second button", "See how it runs", "/about#how-it-works"),
    },
    "The rows of the table are edited under Comparison in the menu on the left.",
  ),

  process: processSection(),

  rates: ratesSection(),

  agencies: agenciesSection(),

  work: workSection(),

  team: teamSection(),

  faq: faqSection(),

  brief: section(
    "Brief form",
    {
      eyebrow: text("Small line above the heading", "Send us a brief"),
      heading: text("Heading", "Four short steps. A scope and a fixed price within two business days."),
      lede: para(
        "Paragraph",
        "Client names can wait until the NDA is signed. Tell us what exists, what is needed and when — a named producer replies within one business day.",
      ),
      call_label: text("\"Prefer to talk\" — label", "Prefer to talk?"),
      call_link: text("\"Prefer to talk\" — link text", "Book a 20-minute scoping call ↗", "Shown when a booking link is set in Headless settings."),
      call_text: para(
        "\"Prefer to talk\" — text without a booking link",
        "A 20-minute scoping call — ask for a slot in the brief and we will send times in your time zone.",
        undefined,
        2,
      ),
      email_label: text("Email — label", "Email"),
      hours_label: text("Hours — label", "Hours"),
      hours_text: text("Hours — text", "{location} · {offset} · UK and US overlap, daily", "{location} and {offset} come from Headless settings."),
      later_label: text("Links for later — label", "Not ready to brief?"),
      later_links: items(
        "Links for later",
        "Link",
        { text: { label: "Link text", kind: "text" }, url: { label: "Goes to", kind: "text" } },
        [
          { text: "See what we have built", url: "/case-studies" },
          { text: "How pricing works", url: "/rates" },
          { text: "Partner programme", url: "/partner-programme" },
          { text: "Just a question? Contact us", url: "/contact" },
        ],
        { slots: 6 },
      ),
    },
    "The last band of the page, beside the four-step brief form.",
  ),

  brief_form: section(
    "Brief form — the questions",
    {
      steps: items(
        "Step titles",
        "Step",
        { title: { label: "Title", kind: "text" } },
        [{ title: "What kind of work" }, { title: "What exists already" }, { title: "Timing and budget" }, { title: "Where to send the scope" }],
        { help: "The four steps, in order. The form needs all four, so leaving one empty only puts its original title back.", slots: 4 },
      ),
      step_counter: text("Counter beside the title", "Step {step} of {total}", "{step} and {total} are filled in as the visitor moves through."),
      work_label: text("Step 1 — kind of work", "Kind of work"),
      platform_label: text("Step 1 — platforms", "Platform — pick any that apply", "The buttons under it are fixed: each one is something we build, and the form checks the answer against that list."),
      figma_label: text("Step 2 — Figma", "Figma URL (optional)"),
      figma_placeholder: text("Step 2 — Figma, grey example text", "https://www.figma.com/…"),
      live_label: text("Step 2 — live site", "Live or staging URL (optional)"),
      live_placeholder: text("Step 2 — live site, grey example text", "https://"),
      brief_label: text("Step 2 — the brief", "The brief, in your words"),
      brief_placeholder: para("Step 2 — the brief, grey example text", "What the client needs, what exists today, what 'done' looks like. Client names can wait until the NDA.", undefined, 2),
      deadline_label: text("Step 3 — deadline", 'Deadline (a date, or "flexible")'),
      deadline_placeholder: text("Step 3 — deadline, grey example text", "e.g. client launch 24 October, or flexible"),
      budget_label: text("Step 3 — budget", "Budget range", "The amounts under it are fixed: the form checks the answer against that list."),
      name_label: text("Step 4 — name", "Your name"),
      agency_label: text("Step 4 — agency", "Agency"),
      email_label: text("Step 4 — email", "Work email"),
      nda_label: text("Step 4 — NDA tick box", "Send me your mutual NDA before I share client details"),
      consent_label: para("Step 4 — permission tick box", "You may use these details to reply about this brief. Nothing else, no newsletter", undefined, 2),
      privacy_link: text("Step 4 — the privacy policy link", "privacy policy", "Written after the line above, and links to the privacy policy page."),
      back: text("Button — back", "Back"),
      next: text("Button — continue", "Continue"),
      submit: text("Button — send", "Send the brief"),
      sending: text("Button — while it sends", "Sending…"),
      reply_note: text("Note beside the buttons", "Reply within 1 business day"),
      sent_eyebrow: text("Once it has sent — small line", "Brief received"),
      sent_heading: text("Once it has sent — heading", "Thank you. You will hear from a named producer within one business day."),
      sent_lede: para(
        "Once it has sent — paragraph",
        "The scope and fixed price follow within two business days. If you asked for the NDA first, it arrives before any client detail is discussed.",
      ),
      sent_call: text("Once it has sent — booking link", "Want to talk it through sooner? Book the 20-minute scoping call ↗"),
    },
    "Every word inside the four-step form. The chips a visitor picks from — the kinds of work, the platforms and the budgets — are fixed, because the form checks the answer against that list before it sends. Where the brief is delivered is set under Headless settings → Forms.",
  ),
});
