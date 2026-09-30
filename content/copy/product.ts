import { FACT_FIELDS, PARAGRAPH_FIELDS, POINT_FIELDS } from "@/content/copy/sections";
import { items, lines, link, page, para, section, text } from "@/content/copy/schema";

/**
 * The fields of one product in WordPress (Products → Add product), a tab per
 * section in the order the product's page reads.
 *
 * Unlike a page's copy this is a template every product fills in, so it starts
 * empty. The Voice Agent's words live in content/products.ts and
 * product-details.ts: WordPress is seeded with them, and the site falls back
 * to them whenever WordPress has no products.
 */
export const productTemplate = page("product", "/products/", "Product", {
  card: section(
    "Menu and product list",
    {
      kind: text("What it is", "", "Two or three words, above the headline and on share cards: WordPress plugin."),
      badge: text("Flag beside the name", "", "A word in the menu and on the product list: New, Popular. Leave empty for none."),
      tagline: para("One line for the menu", "", "Under the name in the Our Products menu.", 2),
      summary: para("Paragraph on the Our Products page", "", undefined, 5),
      price: text("Price in a few words", "", "On the product list and above the headline: Free · Pro coming soon."),
      availability: text("Where to get it", "", "Under the buttons: WordPress.org listing coming soon."),
      keywords: lines("Words people search for", [], "Words the name does not contain, for the site search."),
    },
    "The name is the title above. The icon is the Featured image (square, 256 px or larger); without one the product's drawn icon or its initials are shown. Plugin or theme is the Product groups box.",
  ),

  banner: section(
    "Top of the page",
    {
      title: text("Page heading (H1)", "", "The product and the platform: SoftVolt AI Voice Agent for WordPress."),
      intro: para("Paragraph under the heading", ""),
      seo: para("Description in Google", "", "Under 160 characters: the two lines under the title in search results and link previews."),
      buttons: items(
        "Buttons",
        "Button",
        { text: { label: "Text", kind: "text" }, url: { label: "Goes to", kind: "text" } },
        [],
        { help: "The first is the solid button. A button that goes to #demo opens the voice agent in the corner of the page instead.", slots: 5 },
      ),
    },
    "The banner: the headline, the paragraph and the buttons under it.",
  ),

  plans: section(
    "Price card",
    {
      main_name: text("First tier — name", "", "Free plugin"),
      main_price: text("First tier — price", "", "$0, or Coming soon."),
      main_period: text("First tier — beside the price", "", "forever, / year. Leave empty for none."),
      main_note: para("First tier — one line", "", undefined, 2),
      main_points: lines("First tier — what it includes", []),
      main_button: link("First tier — button", "", ""),
      next_name: text("Second tier — name", "", "Pro add-on. Leave empty for a card with one tier."),
      next_price: text("Second tier — price", ""),
      next_note: para("Second tier — one line", "", undefined, 2),
      next_points: lines("Second tier — what it includes", []),
      next_button: link("Second tier — link", "", ""),
    },
    "The card beside the headline. The Compare tab's two columns are these two tiers.",
  ),

  why: section("Why choose it", {
    heading: text("Heading", ""),
    paragraphs: items("Paragraphs", "Paragraph", PARAGRAPH_FIELDS, [], { slots: 4 }),
    points: items("Key points", "Point", POINT_FIELDS, [], { slots: 6 }),
  }),

  steps: section("How it works", {
    heading: text("Heading", ""),
    list: items("Steps", "Step", POINT_FIELDS, [], { slots: 8 }),
  }),

  guide: section(
    "Setup guide",
    {
      heading: text("Heading", ""),
      intro: para("Paragraph under the heading", ""),
      steps: items(
        "Steps",
        "Step",
        {
          title: { label: "Title", kind: "text" },
          text: { label: "What to do, and what you see", kind: "para" },
          image: { label: "Screenshot", kind: "image" },
        },
        [],
        { help: "A screenshot for each step. Wide pictures read best: 1600 × 1000.", slots: 16 },
      ),
    },
    "Step by step with screenshots: installing it, connecting the AI, teaching it the business, placing it, and what visitors and you see afterwards.",
  ),

  help: section("How we help you", {
    heading: text("Heading", ""),
    list: items(
      "Cards",
      "Card",
      {
        title: { label: "Title", kind: "text" },
        text: { label: "Text", kind: "para" },
        link_text: { label: "Link text", kind: "text" },
        link_url: { label: "Link goes to", kind: "text" },
      },
      [],
      { help: "The link is optional.", slots: 4 },
    ),
  }),

  features: section("Features tab", {
    heading: text("Heading", ""),
    list: items("Features", "Feature", POINT_FIELDS, [], { slots: 30 }),
  }),

  compare: section(
    "Compare tab",
    {
      heading: text("Heading", ""),
      text: para("Paragraph beside the heading", ""),
      rows: items(
        "Table rows",
        "Row",
        {
          label: { label: "Feature", kind: "text" },
          free: { label: "First tier (yes or no)", kind: "text" },
          pro: { label: "Second tier (yes or no)", kind: "text" },
        },
        [],
        { slots: 24 },
      ),
      pro_heading: text("Heading over the planned features", ""),
      pro_list: items("Planned features", "Feature", POINT_FIELDS, [], { slots: 12 }),
    },
    "Free against Pro. The columns are the price card's two tiers.",
  ),

  info: section("Info tab", {
    heading: text("Heading", ""),
    rows: items("Facts", "Fact", FACT_FIELDS, [], { help: "Version, requirements, licence and the like.", slots: 20 }),
  }),

  faq: section("FAQ tab", {
    heading: text("Heading", ""),
    list: items("Questions", "Question", { q: { label: "Question", kind: "text" }, a: { label: "Answer", kind: "para" } }, [], { slots: 20 }),
  }),

  cta: section(
    "Closing call to action",
    {
      pill: text("Small label", ""),
      heading: text("Heading", ""),
      accent: text("Words after the heading, in green", ""),
      lede: para("Paragraph", ""),
    },
    "The dark band above the footer. Its two buttons come from Headless settings → Calls to action.",
  ),
});
