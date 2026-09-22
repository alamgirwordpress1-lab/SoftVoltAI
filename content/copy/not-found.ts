import { items, link, page, para, section, text } from "@/content/copy/schema";
import { seo } from "@/content/copy/sections";

/** A title, a line under it and where it goes — one card in a list of links. */
export const PAGE_LINK_FIELDS = {
  title: { label: "Title", kind: "text" as const },
  text: { label: "Line under it", kind: "para" as const },
  url: { label: "Goes to (a path such as /services)", kind: "text" as const },
};

/** The page any wrong or old link lands on. Its WordPress page only holds these words. */
export const notFoundCopy = page("not-found", "/not-found", "Page not found", {
  seo: seo(
    "Page not found",
    "The page you were looking for is not here. Start from the services, the case studies or the contact page.",
  ),

  banner: section(
    "Banner",
    {
      eyebrow: text("Small line above the headline", "404 — page not found"),
      heading: text("Headline", "This page is not here."),
      lede: para(
        "Paragraph under the headline",
        "The link may be old, or the page has not shipped yet. Everything we do is one click away from here — or ask us, and a person answers within one business day.",
      ),
      button: link("Main button", "Back to the homepage", "/"),
      button_secondary: link("Second button", "Send us a message", "/contact"),
    },
    "The top of the page every broken or old link lands on.",
  ),

  links: section(
    "Where to go next",
    {
      eyebrow: text("Small line above the heading", "Popular pages"),
      heading: text("Heading", "Most people are looking for one of these."),
      items: items("Links", "Link", PAGE_LINK_FIELDS, [
        { title: "Services", text: "Build, automate, grow and support — every white-label service in one place.", url: "/services" },
        { title: "Case studies", text: "Live builds you can open, not logos you have to trust.", url: "/case-studies" },
        { title: "Rates", text: "Monthly plans and a fixed price for every brief.", url: "/rates" },
        { title: "Contact", text: "Send a brief or a question and a named producer replies.", url: "/contact" },
      ]),
    },
    "Cards under the banner. Leave a row's title empty to drop that card.",
  ),
});
