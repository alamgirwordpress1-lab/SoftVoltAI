import { page } from "@/content/copy/schema";
import { banner, ctaBand, seo } from "@/content/copy/sections";

/** /portfolios — the website designs gallery. The designs themselves are listed in content/portfolios.ts. */
export const portfoliosCopy = page("portfolios", "/portfolios", "Our portfolios", {
  seo: seo(
    "Website design portfolio: live templates",
    "Modern, animated website designs you can open live on desktop, tablet and phone. Like one? We build it with your content and your brand.",
  ),

  banner: banner({
    eyebrow: "Our portfolios",
    heading: "Website designs you can open, try and make yours.",
    lede: "Modern, animated designs from our team. Open any of them live and switch between desktop, tablet and phone. If one fits, we build it with your content, your brand and your client's domain.",
    facts: [
      { label: "Every design", value: "Live, not a picture" },
      { label: "Check it on", value: "Desktop · tablet · phone" },
      { label: "Like one?", value: "We build it for you" },
    ],
  }),

  cta: ctaBand({
    pill: "Like a design?",
    heading: "Pick a design, send the brief —",
    accent: "we build it under your brand.",
    lede: "Tell us which design you liked and what the site is for. A fixed price comes back within two business days.",
  }),
});
