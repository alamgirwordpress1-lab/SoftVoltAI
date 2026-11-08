import { link, page, para, section, text } from "@/content/copy/schema";
import { articleSection, banner, ctaBand, intro, seo } from "@/content/copy/sections";

/** /why-softvoltai — the build-or-buy decision: white-label partner vs freelancer vs in-house hire. The table rows come from Comparison. */
export const whyCopy = page("why-softvoltai", "/why-softvoltai", "Why SoftVolt AI", {
  seo: seo(
    "White label vs freelancer vs in-house developer for agencies",
    "Should your agency hire a developer, use freelancers or work with a white-label partner? An honest comparison of cost, risk, capacity and quality, and when each one makes sense.",
  ),

  banner: banner({
    eyebrow: "Why SoftVolt AI",
    heading: "White label vs freelancer vs in-house developer.",
    lede: "Every agency reaches the same decision once client work stops arriving on a steady schedule. Here is how the three options compare, including when we are not the right answer.",
    facts: [
      { label: "Hiring and onboarding", value: "None" },
      { label: "Price", value: "Fixed, per scope" },
      { label: "Capacity", value: "Up and down monthly" },
    ],
  }),

  intro: intro({
    eyebrow: "The decision",
    heading: "Build the team, rent the hours, or partner?",
    subheading: "The right answer depends on how steady your pipeline is and how much delivery risk you can carry.",
    paragraphs: [
      "An in-house developer gives you control but costs the same in a quiet month as in a busy one. A freelancer is flexible but often a single point of failure. A white-label partner gives you a team behind your brand without the salary, at the price of trusting someone else's process.",
      "This page lays out the trade-offs honestly so you can make the call for your agency, and shows where SoftVolt AI fits.",
    ],
    links: [
      { text: "The comparison", url: "#comparison" },
      { text: "When each one makes sense", url: "#guide" },
    ],
  }),

  comparison: section(
    "Comparison table",
    {
      eyebrow: text("Small line above the heading", "The comparison"),
      heading: text("Heading", "In-house hire vs. freelancer vs."),
      heading_accent: text("Words after the heading, in green", "a white-label partner."),
      lede: para("Paragraph", "The things that decide your margin and your client's experience, side by side."),
      col_dimension: text("Table — first column", "Dimension"),
      col_in_house: text("Table — second column", "In-house hire"),
      col_freelancer: text("Table — third column", "Freelancer"),
      footnote: para(
        "Note under the table",
        "* Median annual pay for web developers in the US, May 2025, excluding benefits, taxes and equipment. Source:",
        "The source's name and link are added after this, from Headless settings → Comparison table.",
        2,
      ),
      closing: para("Closing card — text", "Start with one brief and judge the delivery, not the pitch."),
      closing_button: link("Closing card — button", "Send us a brief", "/contact"),
      closing_link: link("Closing card — second button", "See how it runs", "/how-we-work"),
    },
    "The rows of the table are edited under Comparison in the menu on the left.",
  ),

  guide: articleSection("When each one makes sense", {
    eyebrow: "When each one makes sense",
    heading: "An honest guide to the three options.",
    blocks: [
      {
        title: "When to hire an in-house developer",
        text: "Hire when you have enough steady development work to keep one person busy every week of the year, and someone senior enough to review their work. A good in-house developer knows your clients and your standards better than anyone outside the agency.\n\nThe cost is not only the salary. Recruitment, onboarding, equipment, software, holidays, sick days and management time all come on top, and the cost stays the same in a quiet month. One developer also covers one skill set: the WordPress specialist is rarely the person you want on a Next.js build or a technical SEO audit.",
      },
      {
        title: "When a freelancer is the right choice",
        text: "A trusted freelancer is ideal for small, well-defined jobs and for overflow when you already know their work. They are flexible and usually affordable.\n\nThe risks show up as you grow. A freelancer is one person: when they are ill, on holiday or busy with another client, your deadline moves. There is rarely a second pair of eyes on the code, a written QA process, or anyone to take over if they disappear mid-project.",
      },
      {
        title: "When a white-label partner fits best",
        text: "A white-label partner suits agencies whose development work comes in waves, who sell more than one kind of build, or who want to add web development or SEO to their services without hiring. You get a team with a process, cover for holidays and illness, and a fixed price you can mark up.\n\nThe trade-off is trust: you are putting your reputation in someone else's hands. That is why the NDA, the written scope, the QA checklist and the handover rules matter more than the hourly rate. Ask any partner to show you theirs before the first project.",
      },
      {
        title: "What white-label really costs",
        text: "Compare the full cost of delivery, not the day rate. With a hire you pay for every hour, busy or not. With freelancers you often pay in management time and rework. With a fixed-price white-label scope you pay for the outcome, and the price does not move unless the scope does.\n\nOur plans and how a project is priced are on the [pricing page](/pricing).",
      },
      {
        title: "Is white-label safe for your client relationship?",
        text: "It should be invisible. Your brand on staging, documents and reports; no contact with your client; no credit in the code or the footer; and your client's data handled under an NDA and a data processing agreement. Read exactly how we do it on the [security page](/security) and see the clauses in our agency protection terms.",
      },
      {
        title: "When SoftVolt AI is not the right fit",
        text: "If you need someone in your office every day, or your work is one long product that needs a permanent team member, hire. If you only need a few hours of small fixes a year, a freelancer you trust is simpler. We fit best when you have regular client builds, SEO or automation work and want them delivered to a written standard under your brand.",
      },
      {
        title: "Why agencies choose SoftVolt AI",
        text: "A senior team that builds WordPress, WooCommerce, headless Next.js and Laravel sites, runs technical SEO and builds AI automation. We also ship our own WordPress plugins, reviewed and listed on WordPress.org, so the code we put on your clients' sites is code we maintain in public. Every project gets a named producer, a fixed price and UK and US hours. See the [case studies](/case-studies) or [how we work](/how-we-work).",
      },
    ],
  }),

  cta: ctaBand(),
});
