import type { Product } from "@/lib/cms/types";

/**
 * Our Products: the WordPress plugins and themes SoftVolt AI builds and sells.
 * The header's "Our Products" menu, the /products page and the search index
 * read this list; each product's own page reads its entry in
 * product-details.ts as well.
 *
 * Only list what exists. A product that is still being built waits here as a
 * comment, not as a card.
 */
export const products: Product[] = [
  {
    slug: "softvolt-ai-voice-agent",
    name: "SoftVolt AI Voice Agent",
    kind: "plugin",
    badge: "New",
    tagline: "An AI sales agent that talks to visitors by voice or text, books your services and sends you the lead.",
    summary:
      "Put an AI sales agent on any WordPress site. Visitors talk or type; it answers from the facts you give it, recommends the right service or product, books it, and hands a hot lead to a person when they ask. Every lead is saved in WordPress and sent to you by email, Telegram or n8n. It works with free AI models or your own key, and the voice costs nothing — speech happens in the visitor's browser.",
    icon: "voice-agent",
    price: "Free · Pro coming soon",
    availability: "WordPress.org listing coming soon",
    keywords: ["voice agent", "AI chatbot", "chatbot", "voice assistant", "sales agent", "lead generation", "WooCommerce", "n8n", "plugin"],
  },
];

/** The plugins first, then the themes, each in the order above. */
export const productGroups = [
  { kind: "plugin" as const, title: "WordPress plugins", empty: "Our first plugins are on the way." },
  { kind: "theme" as const, title: "WordPress themes", empty: "Our first WordPress themes are in the works." },
];
