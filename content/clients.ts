import type { Client, GlobeCard, GlobeLocation, RecommendingClient } from "@/lib/cms/types";

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

/**
 * Neutral silhouettes for designing the client globe before real clients are in.
 * They render only under `next dev` (localhost) and never in a build, so they can
 * never reach the live site; the moment `recommendingClients` has anyone in it,
 * these are ignored. Delete them once the real list is filled.
 */
const placeholderClients: RecommendingClient[] = [
  { id: "placeholder-1", name: "Client name", role: "Founder", company: "Agency name", country: "UK", photo: "/clients/people/placeholder-1.png", consent: "placeholder" },
  { id: "placeholder-2", name: "Client name", role: "Managing director", company: "Agency name", country: "US", photo: "/clients/people/placeholder-2.png", consent: "placeholder" },
  { id: "placeholder-3", name: "Client name", role: "Head of delivery", company: "Agency name", country: "CA", photo: "/clients/people/placeholder-3.png", consent: "placeholder" },
  { id: "placeholder-4", name: "Client name", role: "Founder", company: "Agency name", country: "AU", photo: "/clients/people/placeholder-4.png", consent: "placeholder" },
  { id: "placeholder-5", name: "Client name", role: "SEO lead", company: "Agency name", country: "UK", photo: "/clients/people/placeholder-5.png", consent: "placeholder" },
  { id: "placeholder-6", name: "Client name", role: "Creative director", company: "Agency name", country: "US", photo: "/clients/people/placeholder-6.png", consent: "placeholder" },
  { id: "placeholder-7", name: "Client name", role: "Operations lead", company: "Agency name", country: "IE", photo: "/clients/people/placeholder-7.png", consent: "placeholder" },
  { id: "placeholder-8", name: "Client name", role: "Founder", company: "Agency name", country: "AU", photo: "/clients/people/placeholder-8.png", consent: "placeholder" },
];

const globeClients = recommendingClients.length ? recommendingClients : process.env.NODE_ENV === "development" ? placeholderClients : [];

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

const MAX_GLOBE_CLIENTS = 12;
/** Neighbouring cards alternate high and low so they never sit on top of each other. */
const ORBIT_LATITUDES = [6, -28, 30, -6, 24, -30, 14, -18];

/** Client photos spread evenly round the orbit, with the context tiles spaced out between them. */
function clientOrbit(people: RecommendingClient[]): GlobeCard[] {
  const cards: GlobeCard[] = people.slice(0, MAX_GLOBE_CLIENTS).map((p) => ({
    id: `client-${p.id}`,
    kind: "client",
    name: p.name,
    role: p.role,
    company: p.company,
    country: p.country,
    photo: p.photo,
    az: 0,
    lat: 0,
  }));
  // with many people, keep only the two tiles that say where and when
  const extras: GlobeCard[] = cards.length > 8 ? [tiles.brand, tiles.hours] : [tiles.cities, tiles.brand, tiles.stack, tiles.hours];
  const every = Math.max(1, Math.round(cards.length / extras.length));
  const ordered: GlobeCard[] = [];
  let next = 0;
  cards.forEach((card, i) => {
    ordered.push(card);
    if ((i + 1) % every === 0 && next < extras.length) ordered.push(extras[next++]);
  });
  ordered.push(...extras.slice(next));
  return ordered.map((card, i) => ({ ...card, az: Math.round((i * 360) / ordered.length), lat: ORBIT_LATITUDES[i % ORBIT_LATITUDES.length], scale: undefined }));
}

/** The cards orbiting the hero globe: recommending clients once there are any, delivered projects until then. */
export const globeCards: GlobeCard[] = globeClients.length ? clientOrbit(globeClients) : projectOrbit;

/**
 * Globe markers. "clients" = where the clients above are (these also draw the
 * arcs from Dhaka); "market" = a market we sell into, no clients claimed.
 *
 * The market list is the one published in `site.markets` — UK, US, Canada,
 * Australia and the EU — with the EU drawn as its individual member states so
 * the coverage reads on the globe instead of sitting under one pin. Markets
 * render as small hollow rings and stay unlabelled, so they cluster without
 * colliding. Add or remove a country here and the globe follows.
 */
export const globeLocations: GlobeLocation[] = [
  { id: "dhaka", label: "Dhaka · HQ", lat: 23.81, lon: 90.41, kind: "hq" },
  { id: "uk", label: "United Kingdom", lat: 51.51, lon: -0.13, kind: "clients" },
  { id: "us", label: "United States", lat: 40.71, lon: -74.01, kind: "clients" },
  { id: "ca", label: "Canada", lat: 43.65, lon: -79.38, kind: "market" },
  { id: "au", label: "Australia", lat: -33.87, lon: 151.21, kind: "market" },
  // European Union — all 27 member states, pinned at the capital
  { id: "ie", label: "Ireland", lat: 53.35, lon: -6.26, kind: "market" },
  { id: "nl", label: "Netherlands", lat: 52.37, lon: 4.9, kind: "market" },
  { id: "de", label: "Germany", lat: 52.52, lon: 13.4, kind: "market" },
  { id: "fr", label: "France", lat: 48.86, lon: 2.35, kind: "market" },
  { id: "be", label: "Belgium", lat: 50.85, lon: 4.35, kind: "market" },
  { id: "lu", label: "Luxembourg", lat: 49.61, lon: 6.13, kind: "market" },
  { id: "dk", label: "Denmark", lat: 55.68, lon: 12.57, kind: "market" },
  { id: "se", label: "Sweden", lat: 59.33, lon: 18.07, kind: "market" },
  { id: "fi", label: "Finland", lat: 60.17, lon: 24.94, kind: "market" },
  { id: "ee", label: "Estonia", lat: 59.44, lon: 24.75, kind: "market" },
  { id: "lv", label: "Latvia", lat: 56.95, lon: 24.11, kind: "market" },
  { id: "lt", label: "Lithuania", lat: 54.69, lon: 25.28, kind: "market" },
  { id: "pl", label: "Poland", lat: 52.23, lon: 21.01, kind: "market" },
  { id: "cz", label: "Czechia", lat: 50.08, lon: 14.44, kind: "market" },
  { id: "sk", label: "Slovakia", lat: 48.15, lon: 17.11, kind: "market" },
  { id: "at", label: "Austria", lat: 48.21, lon: 16.37, kind: "market" },
  { id: "hu", label: "Hungary", lat: 47.5, lon: 19.04, kind: "market" },
  { id: "si", label: "Slovenia", lat: 46.06, lon: 14.51, kind: "market" },
  { id: "hr", label: "Croatia", lat: 45.81, lon: 15.98, kind: "market" },
  { id: "ro", label: "Romania", lat: 44.43, lon: 26.1, kind: "market" },
  { id: "bg", label: "Bulgaria", lat: 42.7, lon: 23.32, kind: "market" },
  { id: "gr", label: "Greece", lat: 37.98, lon: 23.73, kind: "market" },
  { id: "cy", label: "Cyprus", lat: 35.19, lon: 33.38, kind: "market" },
  { id: "mt", label: "Malta", lat: 35.9, lon: 14.51, kind: "market" },
  { id: "it", label: "Italy", lat: 41.9, lon: 12.5, kind: "market" },
  { id: "es", label: "Spain", lat: 40.42, lon: -3.7, kind: "market" },
  { id: "pt", label: "Portugal", lat: 38.72, lon: -9.14, kind: "market" },
];
