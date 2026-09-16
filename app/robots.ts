import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/search-index.json"] },
      // OpenAI's search crawler (distinct from GPTBot, which is for training).
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
