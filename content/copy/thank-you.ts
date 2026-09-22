import { items, link, page, para, section, text } from "@/content/copy/schema";
import { POINT_FIELDS, seo } from "@/content/copy/sections";
import { PAGE_LINK_FIELDS } from "@/content/copy/not-found";

/**
 * Where both forms land once they have sent: /thank-you after the message form
 * on the contact page, /thank-you/brief after the four-step brief. Neither is
 * indexed or listed in the sitemap.
 */
export const thankYouCopy = page("thank-you", "/thank-you", "Thank you", {
  seo: seo("Thank you", "Your message reached a person at SoftVolt AI. A named producer replies within one business day."),

  message: section(
    "After the message form",
    {
      eyebrow: text("Small line above the headline", "Message sent"),
      heading: text("Headline", "Thank you — it is with a person, not a queue."),
      lede: para(
        "Paragraph under the headline",
        "A named producer replies within one business day. If it is urgent, email us and say so in the subject line.",
      ),
      steps: items("What happens next", "Step", POINT_FIELDS, [
        { title: "Read by a person", text: "Your message goes to the producer who covers your hours, not to a shared queue or a sales sequence." },
        { title: "A reply within one business day", text: "With an answer, or with the one question we need answered before we can give you one." },
        { title: "The NDA first, if you asked", text: "If you ticked the NDA box, it arrives before any client detail is discussed." },
      ]),
    },
    "Shown at /thank-you, after someone sends the short message form on the contact page.",
  ),

  brief: section(
    "After the brief form",
    {
      eyebrow: text("Small line above the headline", "Brief received"),
      heading: text("Headline", "Thank you. A named producer replies within one business day."),
      lede: para(
        "Paragraph under the headline",
        "The written scope and fixed price follow within two business days. If you asked for the NDA first, it arrives before any client detail is discussed.",
      ),
      steps: items("What happens next", "Step", POINT_FIELDS, [
        { title: "Within one business day", text: "A named producer confirms the brief and asks anything the scope depends on." },
        { title: "Within two business days", text: "A written scope with a fixed price, the timeline and what we need from you." },
        { title: "When you approve it", text: "Work starts once the scope is agreed in writing — under your agency's name from the first staging link." },
      ]),
    },
    "Shown at /thank-you/brief, after someone sends the four-step brief.",
  ),

  next: section(
    "While you wait",
    {
      steps_eyebrow: text("Steps — small line above them", "What happens next"),
      eyebrow: text("Small line above the heading", "While you wait"),
      heading: text("Heading", "See the work in the meantime."),
      links: items("Links", "Link", PAGE_LINK_FIELDS, [
        { title: "Case studies", text: "Live builds you can open, each with the brief it answered.", url: "/case-studies" },
        { title: "How we work", text: "Five steps from brief to handover, each one written down.", url: "/about#how-it-works" },
        { title: "Security & confidentiality", text: "How your clients' access, code and data are protected.", url: "/security" },
      ]),
      call: text(
        "Booking link text",
        "Want to talk it through sooner? Book the 20-minute scoping call ↗",
        "Shown only while a booking link is set on the site.",
      ),
      button: link("Button", "Back to the homepage", "/"),
    },
    "The same on both thank-you pages.",
  ),
});
