import { items, page, section } from "@/content/copy/schema";
import { banner, ctaBand, faqSection, intro, seo } from "@/content/copy/sections";

/**
 * /faq — every question in one place: the general FAQs and the pricing FAQs
 * (both edited under FAQs), then the extra questions below, which only this
 * page shows. All of them go out as one FAQPage block.
 */
export const faqCopy = page("faq", "/faq", "FAQ", {
  seo: seo(
    "White label web development FAQ for agencies",
    "Answers to the questions agencies ask before they outsource: confidentiality, pricing, process, hours, ownership, WordPress, SEO and what happens after launch.",
  ),

  banner: banner({
    eyebrow: "FAQ",
    heading: "White label web development FAQ for agencies.",
    lede: "The questions agencies ask before they send the first brief, answered in plain words. If yours is not here, ask it in the brief or on a call.",
    facts: [
      { label: "Before the brief", value: "Mutual NDA" },
      { label: "Price", value: "Fixed, in writing" },
      { label: "Your client sees", value: "Only your brand" },
    ],
  }),

  intro: intro({
    eyebrow: "On this page",
    heading: "Everything agencies check before they outsource.",
    subheading: "Confidentiality, money, process and ownership: the four things that decide whether a white-label partner is safe to use.",
    paragraphs: [
      "Handing client work to another team is a trust decision first and a production decision second. These answers cover what happens to your client's details, how the price is set, how the work moves from brief to launch, and who owns the result.",
      "For the full detail, see [how we work](/how-we-work), [pricing](/pricing) and [security and confidentiality](/security).",
    ],
  }),

  faq: faqSection({ eyebrow: "Questions", heading: "Questions agencies ask before the first project." }),

  more: section(
    "More questions",
    {
      list: items(
        "Questions only this page shows",
        "Question",
        { q: { label: "Question", kind: "text" }, a: { label: "Answer", kind: "para" } },
        [
          {
            q: "What is white-label web development?",
            a: "It is web design and development that another company builds for you, delivered under your agency's name. You sell the project, own the client relationship and invoice the client. We build, test and hand over, and our name never appears on the site, in the code or in any email your client sees.",
          },
          {
            q: "Who owns the code and the website after launch?",
            a: "Your client, through you. Once the project is paid, all code, design files and content are handed over with full admin access, and our access is removed and confirmed in writing.",
          },
          {
            q: "How long does a typical WordPress website take?",
            a: "A brochure site of five to eight templates usually takes two to four weeks from an approved scope. Stores, migrations and custom functionality take longer. The scope gives you the timeline in writing, with QA and handover dates.",
          },
          {
            q: "How many revisions are included?",
            a: "Each scope states the revision rounds per template, written in before work starts. Changes outside the scope are quoted before they are built, so nothing is added to the bill without your approval.",
          },
          {
            q: "Can you work from our Figma or Adobe XD designs?",
            a: "Yes. Most builds start from the agency's own design files. We match spacing, type and breakpoints, and flag anything in the design that will hurt speed or accessibility before we build it.",
          },
          {
            q: "Do you build with Elementor, Gutenberg or custom themes?",
            a: "All three. We recommend the one that suits the client: Gutenberg or ACF for clients who edit often and care about speed, Elementor when the agency's team already works in it, and headless WordPress with Next.js when performance matters most.",
          },
          {
            q: "Do you offer white-label SEO as well as development?",
            a: "Yes: technical SEO, on-page work, local SEO and monthly reports with your branding. See [white-label SEO services](/services/white-label-seo-services).",
          },
          {
            q: "Is our client's data safe with an offshore team?",
            a: "We sign a mutual NDA before any client details are shared, keep credentials in a shared vault you can revoke, use the lowest access the work needs, and work under Standard Contractual Clauses and a data processing agreement for UK and EU data. The details are on the [security page](/security).",
          },
          {
            q: "What happens if something breaks after launch?",
            a: "Defects in our work found after launch are fixed at our cost. For ongoing updates, backups and monitoring, a [maintenance plan](/services/website-maintenance) keeps the site looked after every month.",
          },
        ],
        { help: "Shown after the questions from FAQs, and included in the FAQ data search engines read.", slots: 20 },
      ),
    },
    "Extra questions for this page only. The general and pricing questions are edited under FAQs.",
  ),

  cta: ctaBand(),
});
