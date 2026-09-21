import { link, page, para, section, text } from "@/content/copy/schema";
import { LIVE_FIGURES, banner, intro, seo } from "@/content/copy/sections";

/** /contact — the short message form. The form's own questions are part of the form. */
export const contactCopy = page("contact", "/contact", "Contact", {
  seo: seo(
    "Contact — ask us anything",
    "Ask SoftVolt AI a question, flag an issue on live work or introduce your agency. A named producer replies within one business day.",
  ),

  banner: banner({
    eyebrow: "Contact",
    heading: "Ask us anything. A person answers, not a queue.",
    lede: "A question about how we work, an issue on something live, an introduction, or a project that is still an idea — it all comes to the same inbox, and a named producer replies within one business day.",
    factsHelp: `${LIVE_FIGURES} Today that is how fast we reply, how fast a scope comes back, and the NDA.`,
  }),

  intro: intro({
    eyebrow: "Before you write",
    heading: "No form maze, no sales sequence.",
    subheading: "One short form, read by the person who would do the work — and if it turns into a project, the scope and the price follow in writing.",
    paragraphs: [
      "Use this page for anything that is not a project brief yet: how we price, whether we cover a platform, what happens to credentials, a problem on work already running, or simply an introduction so the name is familiar when you do have something to send.",
      "If what you have is a project, the four-step brief form on the [homepage](/#brief) asks the questions we would otherwise have to ask you: the platform, the deadline and the budget. {brief_step}: {brief_time}. The scope follows {scope_time} — line by line, priced, and nothing starts until you approve it.",
    ],
    points: [
      { title: "NDA first", text: "Mutual, signed before client details change hands." },
      { title: "Already working with us?", text: "Say so in the message — it goes straight to your producer." },
      { title: "One reply, not a thread", text: "Every open question comes back in a single message." },
      { title: "Fixed price", text: "The scope carries the number. Changes are priced, not assumed." },
      { title: "Prefer to talk?", text: "A 20-minute scoping call is free and booked in your time zone." },
    ],
    links: [
      { text: "Send a message", url: "#message" },
      { text: "Book a call", url: "#call" },
    ],
    linksHelp:
      "Buttons that jump to a section below (#section) or to another page (/page). In the paragraphs, {brief_step}, {brief_time} and {scope_time} become the first two Process steps.",
  }),

  message: section(
    "Message form",
    {
      eyebrow: text("Small line above the heading", "Write to us"),
      heading: text("Heading", "One form. One person. One reply."),
      subheading: para("Line under the heading", "A question, an issue on live work, an introduction or an idea — the same producer answers all four.", undefined, 2),
      call_label: text("\"Prefer to talk\" — label", "Prefer to talk?"),
      call_link: text("\"Prefer to talk\" — link text", "Book a 20-minute scoping call ↗", "Shown when a booking link is set in Headless settings."),
      call_text: para(
        "\"Prefer to talk\" — text without a booking link",
        "A 20-minute scoping call is free — ask for a slot in your message and we will send times in your time zone.",
        undefined,
        2,
      ),
      email_label: text("Email — label", "Email"),
      hours_label: text("Hours — label", "Hours"),
      hours_text: text("Hours — text", "{location} · {offset} · UK and US overlap, daily", "{location} and {offset} come from Headless settings."),
      nda_label: text("NDA — label", "NDA first?"),
      nda_text: para("NDA — text", "Tick the box in the form. The mutual NDA arrives before any client detail is discussed.", undefined, 2),
      brief_label: text("Project brief — label", "Ready to brief a project?"),
      brief_link: link("Project brief — link", "The four-step brief form", "/#brief"),
      brief_text: text("Project brief — text after the link", "asks for the platform, the deadline and the budget in one pass."),
      next_label: text("What happens next — label", "What happens next"),
      next_text: para("What happens next — text", "Reply within 1 business day → scope and fixed price within 2 → work starts on your written approval.", undefined, 2),
    },
    "The band beside the contact form. The form's own questions are part of the form and change with it.",
  ),
});
