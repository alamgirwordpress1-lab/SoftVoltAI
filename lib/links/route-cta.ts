/**
 * Where a call to action goes, by what it says.
 *
 * Two doors, two jobs:
 *  - /quote is the project brief: "Send us a brief", "Start a project",
 *    "Get a quote". New work comes in here.
 *  - /contact is the ordinary contact page: questions, support, booking a
 *    call ("/contact#call").
 *
 * Buttons are written by editors in WordPress, so a brief button can still be
 * pointed at /contact by mistake. Every link that passes through the page copy
 * or the site settings is checked here: if it goes to /contact but its words
 * are about a brief or a project, it is sent to /quote instead. A link to the
 * call booking (#call) or one that mentions a call or a question is left alone.
 */

const BRIEF_WORDS =
  /\b(brief|quote|project|figma|estimate|start with one)\b|send us one/i;
const CONTACT_WORDS = /\b(call|question|contact|ask|talk|support|message)\b/i;

/**
 * Pages that moved: a link to the old address still works (next.config.ts
 * redirects it), but a link straight to the new one saves a hop for visitors
 * and crawlers. Keep in step with the redirects in next.config.ts.
 */
const MOVED: Record<string, string> = {
  "/rates": "/pricing",
  "/work": "/case-studies",
  "/products/softvoltai-ai-seo-engine": "/products/ai-seo-audit",
  "/case-studies/seo-agency-in-essex":
    "/case-studies/technical-seo-wordpress-site-uk-seo-agency",
  "/case-studies/bulk-bag-man":
    "/case-studies/headless-wordpress-nextjs-uk-aggregates-supplier",
  "/case-studies/heat-pumps-4-pools":
    "/case-studies/woocommerce-store-maintenance-uk-pool-heating-retailer",
  "/case-studies/ascent-energy":
    "/case-studies/woocommerce-store-uk-renewable-energy-company",
  "/case-studies/rwd-agency":
    "/case-studies/agency-website-uk-experiential-marketing-agency",
  "/case-studies/komfort-partitioning":
    "/case-studies/manufacturer-website-uk-partitioning-company",
};

/** The current address for an internal link whose page has moved. */
export function current(url: string): string {
  const m = url.match(/^(\/[^?#]*?)\/?([?#].*)?$/);
  if (!m) return url;
  const to = MOVED[m[1]];
  return to ? to + (m[2] ?? "") : url;
}

/** Is this an address on the plain contact page (not the call booking)? */
function isPlainContact(url: string): boolean {
  return /^\/contact\/?(?:[?#](?!call)|$)/.test(url);
}

/** The address this call to action should really use. */
export function routeCta(text: string, rawUrl: string): string {
  const url = current(rawUrl);
  // the brief form used to live at the foot of the home page
  if (url === "/#brief") return "/quote";
  if (!url || !isPlainContact(url)) return url;
  if (!BRIEF_WORDS.test(text) || CONTACT_WORDS.test(text)) return url;
  return "/quote";
}

/** The same rule for a { label, href } link from the site settings. */
export function routeLink<T extends { label: string; href: string }>(
  link: T,
): T {
  const href = routeCta(link.label, link.href);
  return href === link.href ? link : { ...link, href };
}

/** The same rules for the links inside a post's HTML, written in the WordPress editor. */
export function routeHtml(html: string): string {
  return html.replace(
    /<a(\s[^>]*?)href="(?:https:\/\/www\.softvoltai\.com)?(\/[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g,
    (whole, before: string, url: string, after: string, inner: string) => {
      const href = routeCta(inner.replace(/<[^>]+>/g, " "), url);
      return href === url
        ? whole
        : `<a${before}href="${href}"${after}>${inner}</a>`;
    },
  );
}
