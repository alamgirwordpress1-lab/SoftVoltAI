import { POINT_FIELDS, banner, ctaBand, seo } from "@/content/copy/sections";
import { items, page, section, text } from "@/content/copy/schema";

/** /products — the WordPress plugins and themes. The products themselves come from content/products.ts. */
export const productsCopy = page("products", "/products", "Our Products", {
  seo: seo(
    "WordPress plugins and themes",
    "WordPress plugins and themes built by SoftVolt AI, starting with an AI voice and chat sales agent. Free on WordPress.org, with Pro add-ons coming.",
  ),

  banner: banner({
    eyebrow: "Our products",
    heading: "WordPress plugins and themes, built by a team that ships sites every day.",
    lede: "The tools we build for our own client work, packaged for everyone. The free versions are complete, and Pro add-ons are coming for the businesses that need more.",
    facts: [
      { label: "First plugin", value: "SoftVolt AI Voice Agent" },
      { label: "Price", value: "Free, Pro add-ons coming" },
      { label: "Built to", value: "WordPress.org standards" },
    ],
  }),

  list: section("The products", {
    eyebrow: text("Small line above the heading", "Plugins and themes"),
    heading: text("Heading", "Everything we make for WordPress."),
  }),

  promises: section(
    "How we build them",
    {
      eyebrow: text("Small line above the heading", "How we build them"),
      heading: text("Heading", "Three rules for every product."),
      list: items(
        "The rules",
        "Rule",
        POINT_FIELDS,
        [
          { title: "The free version is complete", text: "No locked features and no nagging. Pro is a separate add-on for people who need more, never a paywall inside the free plugin." },
          { title: "Built to WordPress.org standards", text: "Escaped output, checked permissions, encrypted keys, translatable text — and it passes Plugin Check before it ships." },
          { title: "Supported by the people who wrote it", text: "Questions reach the team that built it, the same team that builds WordPress sites for agencies every day." },
        ],
        { help: "Short promises about how the products are made. Only what is true of every product." },
      ),
    },
    "A band under the product list.",
  ),

  cta: ctaBand({
    pill: "Custom work",
    heading: "Need a plugin built for your business?",
    accent: "We do that too.",
    lede: "Custom WordPress and WooCommerce plugins, integrations and AI agents, delivered under your brand. Send the brief and get a written scope.",
  }),
});
