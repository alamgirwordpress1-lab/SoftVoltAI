import type { Client, GlobeCard, GlobeLocation } from "@/lib/cms/types";

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

/** The twelve cards orbiting the hero globe: real client sites plus a few context tiles. */
export const globeCards: GlobeCard[] = [
  { id: "bbm", kind: "site", title: "The Bulk Bag Man", country: "UK", work: "Headless WordPress + Next.js", image: "/clients/bulk-bag-man.jpg", az: 0, lat: 6, scale: 1.06 },
  { id: "hp4p", kind: "site", title: "Heat Pumps 4 Pools", country: "UK", work: "WooCommerce store", image: "/clients/heat-pumps-4-pools.jpg", az: 32, lat: -28 },
  { id: "cities", kind: "cities", lines: ["London", "New York", "Dhaka"], az: 62, lat: 30 },
  { id: "seo", kind: "site", title: "SEO Agency in Essex", country: "UK", work: "Technical-SEO site", image: "/clients/seo-agency-in-essex.jpg", az: 92, lat: -6 },
  { id: "ascent", kind: "site", title: "Ascent Energy", country: "UK", work: "WooCommerce build", image: "/clients/ascent-energy.jpg", az: 122, lat: 24 },
  { id: "brand", kind: "brand", title: "Delivered worldwide", sub: "UK · US · Bangladesh", az: 152, lat: -30 },
  { id: "md24", kind: "site", title: "MobileDokan24", country: "BD", work: "WooCommerce catalogue", image: "/clients/mobiledokan24.jpg", az: 182, lat: 6 },
  { id: "patriot", kind: "site", title: "Patriot Insurance Group", country: "US", work: "Full-stack WordPress", image: "/clients/patriot-insurance.jpg", az: 212, lat: 30 },
  { id: "stack", kind: "stack", title: "Our stack", items: ["WordPress", "WooCommerce", "Next.js", "Payload", "Shopify"], az: 242, lat: -18 },
  { id: "ronvil", kind: "site", title: "Ronemus & Vilensky", country: "US", work: "Law firm website", image: "/clients/ronemus-vilensky.jpg", az: 272, lat: 14 },
  { id: "yume", kind: "site", title: "Yume Nihongo", country: "BD", work: "Education website", image: "/clients/yume-nihongo.jpg", az: 302, lat: -30 },
  { id: "hours", kind: "hours", big: "UTC+6", sub: "UK & US overlap, daily", az: 332, lat: 26 },
];

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
