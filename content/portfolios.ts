/**
 * Our portfolios — the website designs a visitor can open live, try on desktop,
 * tablet and phone, and ask us to build for them.
 *
 * To add a design:
 *  1. Put the finished, self-contained template in /public/portfolio/<category>/<slug>/index.html
 *     (its CSS, JS and images next to it, linked with relative paths).
 *     Link to it as …/index.html: a bare folder URL is not served by Next.js.
 *  2. Add an entry below. `demo` is that index.html's URL; the card shows the live page
 *     itself as its preview, so no screenshot is needed (set `image` to use one).
 *  3. Categories show in the order of `portfolioCategories`; an empty one is hidden.
 */
export interface PortfolioDesign {
  slug: string;
  name: string;
  /** One of portfolioCategories. */
  category: string;
  /** One line on the card: who it is for and what it shows off. */
  summary: string;
  /** The live demo, e.g. /portfolio/agency/studio-north/index.html (write index.html: Next.js does not serve a folder URL) — or a full https:// URL. */
  demo: string;
  /** Optional preview picture (16:10). Without it, the card shows the live page, scaled down. */
  image?: string;
  /** A few words on what is inside: animation, layout, stack. */
  tags: string[];
}

export const portfolioCategories = ["Agency & studio", "Business & services", "E-commerce", "SaaS & apps", "Personal & creative"];

export const portfolioDesigns: PortfolioDesign[] = [
  {
    slug: "studio-north",
    name: "Studio North",
    category: "Agency & studio",
    summary: "A motion-led landing page for a creative or marketing agency: animated hero, scroll reveals and a services marquee.",
    demo: "/portfolio/agency/studio-north/index.html",
    tags: ["Scroll animation", "Marquee", "Dark mode"],
  },
];
