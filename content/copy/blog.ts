import { link, page, para, section, text } from "@/content/copy/schema";
import { banner, intro, seo } from "@/content/copy/sections";

/** /blog and every post page. The posts themselves are ordinary WordPress posts. */
export const blogCopy = page("blog", "/blog", "Blog", {
  seo: seo(
    "Blog",
    "Notes on white-label delivery: how agency work is scoped, built, automated and reported on. Written by the people who do the work, published from our own CMS.",
  ),

  banner: banner({
    eyebrow: "Blog",
    heading: "What we learn on agency work, written down.",
    lede: "Scoping, build notes, automation patterns and the reporting agencies actually forward to their clients. Every post is written by whoever did the work.",
    facts: [
      { label: "Written by", value: "The delivery team" },
      { label: "Published from", value: "Our own CMS" },
      { label: "Posts", value: "{count}" },
    ],
    factsHelp: "Up to three short facts shown as cards on the right. {count} becomes the number of published posts.",
  }),

  intro: intro({
    eyebrow: "What you will find here",
    heading: "Method, not marketing.",
    subheading: "The same notes we send partners when they ask how something was done.",
    paragraphs: [
      "This is the working half of the site. The service pages say what we deliver; these posts say how a particular job went — the constraint that shaped it, the approach we took, and what we would do differently next time.",
      "Everything here is published from the same WordPress install that runs the rest of the site, so an editor can post without a developer and the page you are reading updates within seconds.",
    ],
    links: [
      { text: "All services", url: "/services" },
      { text: "Case studies", url: "/case-studies" },
      { text: "Talk to us", url: "/contact" },
    ],
  }),

  posts: section(
    "The posts",
    {
      heading: text("Heading above the posts", "Latest posts"),
      read_more: text("Link on each post card", "Read the post"),
      empty_heading: text("Heading when nothing is published", "Nothing published yet"),
      empty_text: para(
        "Text when nothing is published",
        "The first posts are being written. In the meantime the case studies carry the same detail — what was built, on what stack, and what it changed.",
      ),
      empty_button: link("Button when nothing is published", "Read the case studies", "/case-studies"),
      empty_button_secondary: link("Second button when nothing is published", "Ask us something", "/contact"),
    },
    "The list of posts. The posts themselves are written under Posts in the menu on the left.",
  ),

  post: section(
    "Every post page",
    {
      card_title: text("Side card — title", "This post"),
      published_label: text("Side card — \"Published\" label", "Published"),
      author_label: text("Side card — \"Written by\" label", "Written by"),
      card_text: para("Side card — text", "Got a job like the one in this post? Tell us what you are building and we will scope it."),
      more_heading: text("Heading above the other posts", "More from the blog"),
    },
    "The parts of a single post page that are not the post itself.",
  ),
});
