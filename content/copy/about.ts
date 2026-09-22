import { items, page, section, text } from "@/content/copy/schema";
import { LIVE_FIGURES, POINT_FIELDS, banner, ctaBand, hoursSection, intro, processSection, seo, teamSection } from "@/content/copy/sections";

/** /about — the story, the people and the rules. The team comes from Team, the steps from Process steps. */
export const aboutCopy = page("about", "/about", "About", {
  seo: seo(
    "About — the team behind the agencies",
    "The Dhaka team behind agencies in the UK and US: senior WordPress, Next.js and SEO production, founded by a nine-year agency developer.",
  ),

  banner: banner({
    eyebrow: "About SoftVolt AI",
    heading: "The digital team behind agencies.",
    lede: "SoftVolt AI exists so agencies can sell websites, apps, automation, SEO and paid media without building a bigger team. We are based in Dhaka, work UK and US hours, and never appear in front of your client.",
    factsHelp: `${LIVE_FIGURES} Today that is where we are based, our hours and who founded the company.`,
  }),

  intro: intro({
    eyebrow: "Our story",
    heading: "Built from nine years inside agencies.",
    subheading: "The people who take your brief are the ones who build it — senior WordPress, Next.js and SEO hands, on your working day.",
    paragraphs: [
      "SoftVolt AI grew out of nine years of doing this work from the inside — building WordPress and WooCommerce sites for clients in the UK and Bangladesh, and most recently leading the WordPress team at a UK agency.",
      "The pattern never changed. The agency won the client, then the build waited on developers who were already fully booked. Deadlines slipped, margins shrank, and the client relationship took the hit.",
      "SoftVolt AI is the team that fixes that: senior production capacity that works under your brand, overlaps with your working day, and writes every step down.",
    ],
    links: [
      { text: "The team", url: "#founder" },
      { text: "Our rules", url: "#why" },
      { text: "How we work", url: "#how-it-works" },
      { text: "Our hours", url: "#hours" },
    ],
  }),

  team: teamSection(),

  values: section(
    "Our rules",
    {
      eyebrow: text("Small line above the heading", "Why SoftVolt AI"),
      heading: text("Heading", "{Count} rules we keep on every project.", "{Count} becomes the number of rules below, as a word."),
      list: items("The rules", "Rule", POINT_FIELDS, [
        { title: "Invisible by design", text: "Your brand on the staging URL, the commits, the reports and the handover. Ours nowhere. That is the product." },
        { title: "Written, not remembered", text: "Scope, price, checklist, handover — if it matters, it is a document you can forward to the client." },
        { title: "Senior hands", text: "The people who scope the work are the people who build it. No hand-off to a junior pool after the sales call." },
        { title: "Honest numbers", text: "We publish measurements we can prove and nothing we cannot. No invented client counts, no guaranteed rankings." },
      ]),
    },
    "A written band: the rules are the rows below, not a list from the menu.",
  ),

  process: processSection(),

  hours: hoursSection(),

  cta: ctaBand(),
});
