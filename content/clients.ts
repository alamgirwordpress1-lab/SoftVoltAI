import type { Client, FeaturedClient, GlobeCard, GlobeLocation, RecommendingClient } from "@/lib/cms/types";

/**
 * Businesses our founder has delivered websites for — as developer, project
 * manager or team lead — before SoftVolt AI. All public, all live at the time
 * of writing. White-label partner work never appears here without permission.
 */
export const clients: Client[] = [
  { name: "The Bulk Bag Man", country: "UK", work: "Headless WordPress + Next.js", url: "https://bag-man-live-six.vercel.app/" },
  { name: "Heat Pumps 4 Pools", country: "UK", work: "WooCommerce store", url: "https://heatpumps4pools.com/" },
  { name: "Ascent Energy", country: "UK", work: "WooCommerce build", url: "https://ascent-energy.co.uk/" },
  { name: "SEO Agency in Essex", country: "UK", work: "Technical-SEO site", url: "https://seoagencyinessex.co.uk/" },
  { name: "Online Marketing Help", country: "UK", work: "Agency WordPress team" },
  { name: "Patriot Insurance Group", country: "US", work: "Full-stack WordPress", url: "https://dsayles.com/" },
  { name: "Ronemus & Vilensky", country: "US", work: "Law firm website", url: "https://www.ronvil.com/" },
  { name: "MobileDokan24", country: "BD", work: "WooCommerce catalogue", url: "https://mobiledokan24.com/" },
  { name: "GFC Fans BD", country: "BD", work: "Brand store", url: "https://gfcfansbd.com/" },
  { name: "Yume Nihongo", country: "BD", work: "Education website", url: "https://yumenihongo.com/" },
  { name: "Bhalogari", country: "BD", work: "Web development" },
  { name: "Dropndot", country: "BD", work: "Agency development" },
];

/**
 * TODO(owner): clients who recommend SoftVolt AI. As soon as this list has anyone
 * in it, their photos permanently replace the delivered projects around the hero
 * globe (the first 12 are shown).
 *
 * Real clients only, each of whom has agreed in writing to appear with their name
 * and photo — record how in `consent`. Never a stock photo, never a picture copied
 * from another website, never a name that has not been agreed. Under UK and US
 * rules a testimonial or endorsement from someone who is not a real client is a
 * fake review, and agencies can reverse-image-search a photo in seconds.
 *
 * Photos: square, at least 400×400, face centred, saved in public/clients/people/.
 *   { id: "jane-doe", name: "Jane Doe", role: "Founder", company: "Example Agency", country: "UK",
 *     photo: "/clients/people/jane-doe.jpg", consent: "Email to Alamgir, 2026-09-20" },
 */
export const recommendingClients: RecommendingClient[] = [];

/** Context tiles that orbit the globe alongside either set of cards. */
const tiles = {
  cities: { id: "cities", kind: "cities", lines: ["London", "New York", "Dhaka"], az: 62, lat: 30 },
  brand: { id: "brand", kind: "brand", title: "Delivered worldwide", sub: "UK · US · Bangladesh", az: 152, lat: -30 },
  stack: { id: "stack", kind: "stack", title: "Our stack", items: ["WordPress", "WooCommerce", "Next.js", "Payload", "Shopify"], az: 242, lat: -18 },
  hours: { id: "hours", kind: "hours", big: "UTC+6", sub: "UK & US overlap, daily", az: 332, lat: 26 },
} satisfies Record<string, GlobeCard>;

/** Delivered client websites with hand-placed positions: shown until recommending clients are added. */
const projectOrbit: GlobeCard[] = [
  { id: "bbm", kind: "site", title: "The Bulk Bag Man", country: "UK", work: "Headless WordPress + Next.js", image: "/clients/bulk-bag-man.jpg", az: 0, lat: 6, scale: 1.06 },
  { id: "hp4p", kind: "site", title: "Heat Pumps 4 Pools", country: "UK", work: "WooCommerce store", image: "/clients/heat-pumps-4-pools.jpg", az: 32, lat: -28 },
  tiles.cities,
  { id: "seo", kind: "site", title: "SEO Agency in Essex", country: "UK", work: "Technical-SEO site", image: "/clients/seo-agency-in-essex.jpg", az: 92, lat: -6 },
  { id: "ascent", kind: "site", title: "Ascent Energy", country: "UK", work: "WooCommerce build", image: "/clients/ascent-energy.jpg", az: 122, lat: 24 },
  tiles.brand,
  { id: "md24", kind: "site", title: "MobileDokan24", country: "BD", work: "WooCommerce catalogue", image: "/clients/mobiledokan24.jpg", az: 182, lat: 6 },
  { id: "patriot", kind: "site", title: "Patriot Insurance Group", country: "US", work: "Full-stack WordPress", image: "/clients/patriot-insurance.jpg", az: 212, lat: 30 },
  tiles.stack,
  { id: "ronvil", kind: "site", title: "Ronemus & Vilensky", country: "US", work: "Law firm website", image: "/clients/ronemus-vilensky.jpg", az: 272, lat: 14 },
  { id: "yume", kind: "site", title: "Yume Nihongo", country: "BD", work: "Education website", image: "/clients/yume-nihongo.jpg", az: 302, lat: -30 },
  tiles.hours,
];

/**
 * TODO(owner): the clients shown as round badges around the globe, best first —
 * businesses whose sites our founder built, all named on this site already.
 * Trim this list to the ones you want on the hero; the rest still appear in the
 * case studies. A `logo` is the client's own mark, saved square in
 * public/clients/logos/; leave it out and the badge shows the client's initials.
 * Remove a client here if they ask not to be shown.
 */
export const featuredClients: FeaturedClient[] = [
  { id: "hp4p", name: "Heat Pumps 4 Pools", work: "WooCommerce store", country: "UK", logo: "/clients/logos/heat-pumps-4-pools.png" },
  { id: "ascent", name: "Ascent Energy", work: "WooCommerce build", country: "UK", logo: "/clients/logos/ascent-energy.png" },
  { id: "seo", name: "SEO Agency in Essex", work: "Technical-SEO site", country: "UK", logo: "/clients/logos/seo-agency-in-essex.png" },
  { id: "ronvil", name: "Ronemus & Vilensky", work: "Law firm website", country: "US", logo: "/clients/logos/ronemus-vilensky.png", logoFill: true },
  { id: "yume", name: "Yume Nihongo", work: "Education website", country: "BD", logo: "/clients/logos/yume-nihongo.png" },
  { id: "bbm", name: "The Bulk Bag Man", work: "Headless WordPress + Next.js", country: "UK" },
  { id: "patriot", name: "Patriot Insurance Group", work: "Full-stack WordPress", country: "US" },
  { id: "md24", name: "MobileDokan24", work: "WooCommerce catalogue", country: "BD" },
];

/**
 * Globe markers. "market" = one of the markets we serve, as published in
 * `site.markets`: each is labelled on the globe and gets an arc from Dhaka.
 * "coverage" = the EU member states, drawn as small unlabelled rings so the
 * European market reads as a region rather than one pin.
 *
 * Market pins sit near the middle of each country (Europe near its centre),
 * so the labels stay apart; the globe also skips any label that would overlap
 * one already drawn. Add or remove a market here and the globe follows.
 */
export const globeLocations: GlobeLocation[] = [
  { id: "dhaka", label: "Dhaka · HQ", lat: 23.81, lon: 90.41, kind: "hq" },
  { id: "uk", label: "UK", lat: 51.51, lon: -0.13, kind: "market" },
  { id: "us", label: "USA", lat: 40.71, lon: -74.01, kind: "market" },
  { id: "ca", label: "Canada", lat: 56.13, lon: -106.35, kind: "market" },
  { id: "au", label: "Australia", lat: -25.27, lon: 133.78, kind: "market" },
  { id: "eu", label: "Europe", lat: 48.5, lon: 22.0, kind: "market" },
  // European Union — all 27 member states, pinned at the capital
  { id: "ie", label: "Ireland", lat: 53.35, lon: -6.26, kind: "coverage" },
  { id: "nl", label: "Netherlands", lat: 52.37, lon: 4.9, kind: "coverage" },
  { id: "de", label: "Germany", lat: 52.52, lon: 13.4, kind: "coverage" },
  { id: "fr", label: "France", lat: 48.86, lon: 2.35, kind: "coverage" },
  { id: "be", label: "Belgium", lat: 50.85, lon: 4.35, kind: "coverage" },
  { id: "lu", label: "Luxembourg", lat: 49.61, lon: 6.13, kind: "coverage" },
  { id: "dk", label: "Denmark", lat: 55.68, lon: 12.57, kind: "coverage" },
  { id: "se", label: "Sweden", lat: 59.33, lon: 18.07, kind: "coverage" },
  { id: "fi", label: "Finland", lat: 60.17, lon: 24.94, kind: "coverage" },
  { id: "ee", label: "Estonia", lat: 59.44, lon: 24.75, kind: "coverage" },
  { id: "lv", label: "Latvia", lat: 56.95, lon: 24.11, kind: "coverage" },
  { id: "lt", label: "Lithuania", lat: 54.69, lon: 25.28, kind: "coverage" },
  { id: "pl", label: "Poland", lat: 52.23, lon: 21.01, kind: "coverage" },
  { id: "cz", label: "Czechia", lat: 50.08, lon: 14.44, kind: "coverage" },
  { id: "sk", label: "Slovakia", lat: 48.15, lon: 17.11, kind: "coverage" },
  { id: "at", label: "Austria", lat: 48.21, lon: 16.37, kind: "coverage" },
  { id: "hu", label: "Hungary", lat: 47.5, lon: 19.04, kind: "coverage" },
  { id: "si", label: "Slovenia", lat: 46.06, lon: 14.51, kind: "coverage" },
  { id: "hr", label: "Croatia", lat: 45.81, lon: 15.98, kind: "coverage" },
  { id: "ro", label: "Romania", lat: 44.43, lon: 26.1, kind: "coverage" },
  { id: "bg", label: "Bulgaria", lat: 42.7, lon: 23.32, kind: "coverage" },
  { id: "gr", label: "Greece", lat: 37.98, lon: 23.73, kind: "coverage" },
  { id: "cy", label: "Cyprus", lat: 35.19, lon: 33.38, kind: "coverage" },
  { id: "mt", label: "Malta", lat: 35.9, lon: 14.51, kind: "coverage" },
  { id: "it", label: "Italy", lat: 41.9, lon: 12.5, kind: "coverage" },
  { id: "es", label: "Spain", lat: 40.42, lon: -3.7, kind: "coverage" },
  { id: "pt", label: "Portugal", lat: 38.72, lon: -9.14, kind: "coverage" },
];

const MAX_GLOBE_CARDS = 12;
/** Neighbouring cards alternate high and low so they never sit on top of each other. */
const ORBIT_LATITUDES = [6, -28, 30, -6, 24, -30, 14, -18];

/** How far ahead of its own country a card rides, in degrees: far enough that the country stays in view beside it. */
const CARD_PHASE = 38;
/** No two cards closer than this on the orbit, so a country's clients fan out instead of stacking up. */
const MIN_GAP = 24;

const norm = (deg: number) => ((deg % 360) + 360) % 360;

/** Where a country sits on the map: its own pin, home for Bangladesh, the European pin for anywhere else we serve. */
function lonOf(country: string) {
  const code = country.toLowerCase();
  const pin =
    globeLocations.find((l) => l.id === code) ??
    (code === "bd" ? globeLocations.find((l) => l.kind === "hq") : globeLocations.find((l) => l.id === "eu"));
  return pin?.lon ?? 0;
}

/**
 * Cards ride above the country they belong to — a card swings to the side of
 * the globe just as its country turns to face us, so the line drawn between
 * the two is always in view. Cards that would land on top of each other are
 * pushed apart, and the context tiles fill the widest gaps left over.
 */
function countryOrbit(cards: GlobeCard[]): GlobeCard[] {
  const placed = cards
    .map((card) => ({ card, az: norm(lonOf("country" in card ? card.country : "") + CARD_PHASE) }))
    .sort((a, b) => a.az - b.az);

  for (let pass = 0; pass < 80 && placed.length > 1; pass++) {
    let moved = false;
    for (let i = 0; i < placed.length; i++) {
      const next = placed[(i + 1) % placed.length];
      const gap = norm(next.az - placed[i].az);
      if (gap >= MIN_GAP) continue;
      const push = (MIN_GAP - gap) / 2;
      placed[i].az = norm(placed[i].az - push);
      next.az = norm(next.az + push);
      moved = true;
    }
    if (!moved) break;
    placed.sort((a, b) => a.az - b.az);
  }

  const out: GlobeCard[] = placed.map((p) => ({ ...p.card, az: Math.round(p.az) }));
  // with many clients, keep only the two tiles that say where and when
  const extras: GlobeCard[] = cards.length > 8 ? [tiles.brand, tiles.hours] : [tiles.cities, tiles.brand, tiles.stack, tiles.hours];
  for (const tile of extras) {
    let at = 0;
    let widest = -1;
    for (let i = 0; i < out.length; i++) {
      const gap = norm(out[(i + 1) % out.length].az - out[i].az);
      if (gap > widest) {
        widest = gap;
        at = i;
      }
    }
    out.splice(at + 1, 0, { ...tile, az: Math.round(norm(out[at].az + widest / 2)) });
  }
  // neighbours alternate high and low, so no two sit on top of each other
  return out.map((card, i) => ({ ...card, lat: ORBIT_LATITUDES[i % ORBIT_LATITUDES.length], scale: undefined }));
}

/** Photo cards for people who recommend us — real ones from `recommendingClients`, or local preview photos. */
export const clientOrbit = (people: RecommendingClient[]): GlobeCard[] =>
  countryOrbit(
    people.slice(0, MAX_GLOBE_CARDS).map((p) => ({ id: `client-${p.id}`, kind: "client", name: p.name, role: p.role, company: p.company, country: p.country, photo: p.photo, az: 0, lat: 0 })),
  );

const logoOrbit = (businesses: FeaturedClient[]): GlobeCard[] =>
  countryOrbit(businesses.slice(0, MAX_GLOBE_CARDS).map((b) => ({ id: `logo-${b.id}`, kind: "logo", name: b.name, work: b.work, country: b.country, logo: b.logo, logoFill: b.logoFill, az: 0, lat: 0 })));

/**
 * The cards orbiting the hero globe, in order of preference: clients who
 * recommend us (photos), then the clients we have delivered for (badges), then
 * the delivered projects themselves.
 */
export const globeCards: GlobeCard[] = recommendingClients.length
  ? clientOrbit(recommendingClients)
  : featuredClients.length
    ? logoOrbit(featuredClients)
    : projectOrbit;
