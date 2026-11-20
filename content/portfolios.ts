/**
 * Portfolios — the website designs a visitor can open live, try on desktop,
 * tablet and phone, and ask us to build for them.
 *
 * To add a design:
 *  1. Put the finished, self-contained template in /public/portfolio/<category>/<slug>/index.html
 *     (its CSS, JS and images next to it, linked with relative paths), with
 *     <meta name="robots" content="noindex"> so the demo is not indexed as a page of its own.
 *     Link to it as …/index.html: a bare folder URL is not served by Next.js.
 *  2. Put its preview next to it as preview.webp (1200×750, the top of the page at
 *     1440×900; headless Edge --screenshot makes it). Without `image`, the card shows
 *     the live page scaled down instead.
 *  3. Add an entry below. Categories show in the order of `portfolioCategories`;
 *     an empty one is hidden.
 *
 * The businesses in these designs are made up; the designs are concepts, not client work.
 */
export interface PortfolioDesign {
  slug: string;
  name: string;
  /** One of portfolioCategories. */
  category: string;
  /** One line on the card: who it is for and what it shows off. */
  summary: string;
  /** The live demo, e.g. /portfolio/agency/studio-north/index.html — or a full https:// URL. */
  demo: string;
  /** Preview picture (16:10). Without it, the card shows the live page, scaled down. */
  image?: string;
  /** A few words on what is inside: features, layout, style. */
  tags: string[];
}

export const portfolioCategories = ["Hospitality", "E-commerce", "Agency & studio", "Business & services", "SaaS & apps", "Personal & creative"];

const p = (category: string, slug: string) => ({ demo: `/portfolio/${category}/${slug}/index.html`, image: `/portfolio/${category}/${slug}/preview.webp` });

export const portfolioDesigns: PortfolioDesign[] = [
  {
    slug: "abbeygate-house",
    name: "Abbeygate House",
    category: "Hospitality",
    summary: "A boutique townhouse hotel: arched gallery hero, rooms and offers, and a booking bar that stays in reach.",
    ...p("hospitality", "abbeygate-house"),
    tags: ["Hotel", "Room booking", "Classic serif"],
  },
  {
    slug: "ember-and-oak",
    name: "Ember & Oak",
    category: "Hospitality",
    summary: "A candlelit restaurant site: menus, table reservations, private dining and gift vouchers.",
    ...p("hospitality", "ember-and-oak"),
    tags: ["Restaurant", "Reservations", "Dark theme"],
  },
  {
    slug: "gull-and-lantern",
    name: "The Gull & Lantern",
    category: "Hospitality",
    summary: "A harbourside inn with rooms: date and guest search, a swipeable photo stack and today's tide times.",
    ...p("hospitality", "gull-and-lantern"),
    tags: ["Inn", "Room search", "Card stack"],
  },
  {
    slug: "fellside-spa",
    name: "Fellside Spa & Retreat",
    category: "Hospitality",
    summary: "A lakeside spa and retreat: full-bleed scenery, treatments, spa breaks and booking a day.",
    ...p("hospitality", "fellside-spa"),
    tags: ["Spa", "Full-bleed hero", "Booking"],
  },
  {
    slug: "lamplighters-club",
    name: "The Lamplighters' Club",
    category: "Hospitality",
    summary: "A cocktail bar behind an unmarked door: a glowing neon sign, the drinks list and booth bookings.",
    ...p("hospitality", "lamplighters-club"),
    tags: ["Bar", "Neon sign", "Bookings"],
  },
  {
    slug: "crumb-and-co",
    name: "Crumb & Co.",
    category: "Hospitality",
    summary: "A bakery and brunch spot: order ahead for collection, today's bakes and two shops with opening times.",
    ...p("hospitality", "crumb-and-co"),
    tags: ["Bakery", "Order ahead", "Bold type"],
  },
  {
    slug: "teme-and-oak",
    name: "Teme & Oak",
    category: "E-commerce",
    summary: "A made-to-order furniture shop with a \"Will it fit?\" room planner, product filters and a basket drawer.",
    ...p("ecommerce", "teme-and-oak"),
    tags: ["Online shop", "Room planner", "Basket"],
  },
  {
    slug: "studio-north",
    name: "Studio North",
    category: "Agency & studio",
    summary: "A motion-led landing page for a creative or marketing agency: animated hero, scroll reveals and a services marquee.",
    ...p("agency", "studio-north"),
    tags: ["Scroll animation", "Marquee", "Dark mode"],
  },
];
