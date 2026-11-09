import { page } from "@/content/copy/schema";
import { articleSection, banner, ctaBand, hoursSection, intro, processSection, protectionSection, seo } from "@/content/copy/sections";

/** /how-we-work — the white-label process from brief to handover. The steps come from Process steps, the cities from Clocks. */
export const howWeWorkCopy = page("how-we-work", "/how-we-work", "How we work", {
  seo: seo(
    "How white label web development works: our process",
    "How a white-label project runs from brief to handover: a written scope and fixed price, staging under your brand, QA, daily updates and a clean handover.",
  ),

  banner: banner({
    eyebrow: "How we work",
    heading: "How white-label web development works, step by step.",
    lede: "Five stages, and each one leaves a document you can forward to your client. You always know where the work is without chasing anyone.",
    facts: [
      { label: "Scope and price", value: "In writing, before work" },
      { label: "Updates", value: "Daily, in your hours" },
      { label: "At handover", value: "Our access removed" },
    ],
  }),

  intro: intro({
    eyebrow: "The short version",
    heading: "You sell and manage the client. We build behind your brand.",
    subheading: "Brief, scope, build, QA, handover: the same five stages on every project, from a landing page to a WooCommerce store.",
    paragraphs: [
      "Outsourcing goes wrong in the gaps: a vague brief, a price that grows, a build nobody checked, a handover with missing logins. Our process closes each gap with something written down, so problems show up in a document before they show up in front of your client.",
      "You stay the only name your client knows. Staging sites run on your domain or a neutral one, emails go to you, and nothing in the code or the admin mentions SoftVolt AI.",
    ],
    points: [
      { title: "Written scope", text: "Templates, integrations, timeline and price agreed before work starts." },
      { title: "One producer", text: "A named person runs your project from brief to handover." },
      { title: "Checked before you see it", text: "Every build passes a published QA list first." },
      { title: "Clean handover", text: "Logins, files and a handover note; our access removed." },
    ],
    links: [
      { text: "The five steps", url: "#how-it-works" },
      { text: "Working day by day", url: "#detail" },
      { text: "Time zones", url: "#hours" },
    ],
  }),

  process: processSection(),

  detail: articleSection("Working day by day", {
    eyebrow: "In detail",
    heading: "What each stage looks like from your side.",
    lede: "What you send, what you get back, and when.",
    blocks: [
      {
        title: "1. The brief: send what you have",
        text: "A brief can be a Figma file, a sitemap, a competitor link or a few lines in an email. We sign a mutual NDA first if you want one, so you can share the client's name and details without worrying about it.\n\nIf something important is missing, the producer asks before quoting rather than guessing and adding it to the bill later.",
      },
      {
        title: "2. The scope: a fixed price in writing",
        text: "You get a written scope with every template, integration and content task listed, the timeline with QA and handover dates, the revision rounds and the fixed price. Anything not in the scope is not in the price, and anything we would need to add is quoted before it is built.\n\nYou use the scope to quote your client with whatever margin you choose. See [how pricing works](/pricing).",
      },
      {
        title: "3. Production: staging under your brand",
        text: "The build happens on a private staging site that is password-protected and hidden from search engines. You get the link as soon as there is something to look at, and a short written update every working day: what was done, what is next, and anything we need from you.\n\nYou review in your own time. Feedback goes in one place, and every change is tracked against the scope.",
      },
      {
        title: "4. QA: checked before you see it",
        text: "Before a build reaches you for final review it passes our QA checklist: responsive layouts on real phone sizes, forms and emails, speed and Core Web Vitals, basic accessibility, broken links, redirects and SEO metadata. You get the checklist with the results, so you can show your client the work was tested.",
      },
      {
        title: "5. Handover: your client owns everything",
        text: "Launch day comes with a handover note: admin logins, hosting and DNS details, plugin licences, where the files are and how to edit the site. Our access is then removed and the removal confirmed in writing. Staging stays up for 14 days and is then deleted unless you ask otherwise.",
      },
      {
        title: "After launch: support and changes",
        text: "Defects in our work found after launch are fixed at our cost. For updates, backups, security and small changes every month, a [maintenance plan](/services/website-maintenance) keeps the site looked after under your brand.",
      },
      {
        title: "How we communicate",
        text: "Through the channel your team already uses: email, Slack or a shared project board. One named producer answers, in UK and US hours, so you never explain a project twice. Calls are available whenever written updates are not enough.",
      },
    ],
  }),

  hours: hoursSection(),

  protection: protectionSection(),

  cta: ctaBand({
    heading: "See the process on a real project.",
    accent: "Send the first brief.",
    lede: "You get a written scope and a fixed price back within two business days. Client names can wait until the NDA is signed.",
  }),
});
