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

  post_banner: section(
    "Every post page — banner",
    {
      eyebrow: text("Small line above the heading", "From the blog"),
      heading: text("Heading", "Notes from the people doing the work."),
      lede: para(
        "Paragraph under the heading",
        "Scoping decisions, build notes and the reporting agencies forward to their clients — written up as the job finishes.",
      ),
    },
    "The same banner at the top of every post. The post's own title, picture and words are under it, written under Posts in the menu on the left.",
  ),

  post: section(
    "Every post page — around the post",
    {
      published_label: text("\"Published\" label", "Published"),
      author_label: text("\"Written by\" label", "Written by"),
      filed_label: text("\"Filed under\" label", "Filed under"),
      reading_time: text("Reading time", "{minutes} min read", "{minutes} is counted from the post itself."),
      updated_label: text("\"Updated\" label", "Updated", "Shown only when a post was changed after it was published."),
      card_title: text("Side card — title", "This post"),
      cta_text: para("Side card — text on the last card", "Got a job like the one in this post? Tell us what you are building and we will scope it."),
      recent_heading: text("Side card — heading above the other posts", "Recent posts"),
      categories_heading: text("Side card — heading above the topics", "Topics"),
      cta_heading: text("Side card — heading on the last card", "Send us a brief"),
      prev_label: text("Link to the post before", "Previous post"),
      next_label: text("Link to the post after", "Next post"),
    },
    "Everything on a post page except the post and the comments: the labels beside the date, the cards down the right and the two links to the posts either side.",
  ),

  post_comments: section(
    "Every post page — comments",
    {
      heading: text("Heading above the comments", "Comments"),
      count_one: text("Count — one comment", "{count} comment", "{count} becomes the number."),
      count_many: text("Count — more than one", "{count} comments"),
      empty: para("Text when nobody has commented yet", "No comments yet. Yours would be the first."),
      form_heading: text("Heading above the form", "Leave a comment"),
      form_lede: para(
        "Line under that heading",
        "Your email is not published. Comments are read before they appear, so give it a few hours.",
        undefined,
        2,
      ),
      name_label: text("Name — label", "Your name"),
      email_label: text("Email — label", "Email"),
      email_note: text("Email — note under the field", "Not published."),
      comment_label: text("Comment — label", "Comment"),
      comment_placeholder: para("Comment — grey example text", "Something you would want to read yourself.", undefined, 2),
      submit: text("Button", "Post comment"),
      sending: text("Button — while it sends", "Posting…"),
      held: para("Once it has sent, and is waiting for approval", "Thank you — your comment is with us and will appear once it has been read."),
      published: para("Once it has sent, and is already published", "Thank you — your comment is up."),
      error: text("When it could not be sent", "We could not save that just now. Please try again in a moment."),
      closed: text("When comments are closed on a post", "Comments are closed on this post."),
      reply: text("Link under each comment", "Reply"),
      replying_to: text("Note above the form while replying", "Replying to {name}", "{name} is whoever wrote the comment."),
      cancel_reply: text("Link that cancels a reply", "Cancel"),
    },
    "The comments under a post. They are moderated under Comments in the menu on the left — nothing appears on the site until it is approved there.",
  ),
});
