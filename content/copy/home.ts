import { items, lines, link, page, para, section, text } from "@/content/copy/schema";
import { agenciesSection, faqSection, hoursSection, processSection, protectionSection, ratesSection, teamSection, workSection } from "@/content/copy/sections";

/** The home page, top to bottom. */
export const homeCopy = page("home", "/", "Home", {
  seo: section(
    "Google & sharing",
    {
      title: text("Page title in Google", "SoftVolt AI — White-label production for agencies", "The blue link in search results and the browser tab. On the home page it is used exactly as written."),
      description: para(
        "Description in Google",
        "White-label production and growth for agencies: WordPress, WooCommerce, headless Next.js, SEO and paid media, built under your brand from Dhaka.",
        "The two lines under the title in search results and link previews. Keep it under 160 characters.",
      ),
    },
    "What search results and link previews show for the home page. Nothing here appears on the page itself.",
  ),

  banner: section(
    "Banner",
    {
      eyebrow: text("Small line above the headline", "White-label production & growth partner"),
      headline: lines(
        "Headline",
        ["You win the client.", "We deliver the work.", "Your brand gets the credit."],
        "One line per row. The last row is set in green.",
      ),
      lede: para(
        "Paragraph under the headline",
        "WordPress, WooCommerce, Shopify and Webflow builds, Next.js apps on Payload, Sanity or PostgreSQL, AI automation, SEO and paid media — delivered under your brand by a senior team in Dhaka, working UK and US hours.",
      ),
    },
    "The first screen. The two buttons come from Headless settings → Calls to action, and the ticks under them are the Commitments.",
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
    },
    "The interactive demo where a visitor types their agency's name.",
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
    },
    "The tools listed underneath are edited under Stack in the menu on the left.",
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
    "The last band of the page, beside the four-step brief form. The form's own questions are part of the form and change with it.",
  ),
});
