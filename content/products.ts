import type { Product, ProductGroup } from "@/lib/cms/types";

/**
 * Our Products: the WordPress plugins and themes SoftVolt AI builds and sells.
 * They are edited in WordPress (Products); this list is what WordPress was
 * seeded with and what the site shows whenever WordPress has no products —
 * the header's menu, /products, the search index and, with product-details.ts,
 * each product's page.
 *
 * Only list what exists. A product that is still being built waits here as a
 * comment, not as a card.
 */
export const products: Product[] = [
  {
    slug: "softvolt-ai-voice-agent",
    name: "SoftVolt AI Voice Agent",
    group: "plugins",
    kind: "WordPress plugin",
    badge: "New",
    tagline: "An AI sales agent that talks to visitors by voice or text, books your services and sends you the lead.",
    summary:
      "Put an AI sales agent on any WordPress site. Visitors talk or type; it answers from the facts you give it, recommends the right service or product, books it, and hands a hot lead to a person when they ask. Every lead is saved in WordPress and sent to you by email, Telegram or n8n. It works with free AI models or your own key, and the voice costs nothing — speech happens in the visitor's browser.",
    price: "Free · Pro coming soon",
    availability: "WordPress.org listing coming soon",
    keywords: ["voice agent", "AI chatbot", "chatbot", "voice assistant", "sales agent", "lead generation", "WooCommerce", "n8n", "plugin"],
  },
];

/** The headings in the menu and on /products, in this order. In WordPress these are the Product groups. */
export const productGroups: ProductGroup[] = [
  { slug: "plugins", title: "WordPress plugins", empty: "Our first plugins are on the way." },
  { slug: "themes", title: "WordPress themes", empty: "Our first WordPress themes are in the works." },
];
