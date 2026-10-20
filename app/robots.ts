import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/search-index.json"] },
      // AI search and answer crawlers, named so a future blanket rule never shuts them out by accident:
      // ChatGPT search, ChatGPT browsing, Claude, Perplexity, Google AI (Gemini, AI Overviews), Apple Intelligence
      // and Microsoft Copilot (Bingbot). A named group replaces the * group, so the same private paths stay closed.
      {
        userAgent: ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"],
        allow: "/",
        disallow: ["/api/", "/search-index.json"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
