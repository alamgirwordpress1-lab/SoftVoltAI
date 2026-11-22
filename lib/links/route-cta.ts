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

/** Is this an address on the plain contact page (not the call booking)? */
function isPlainContact(url: string): boolean {
  return /^\/contact\/?(?:[?#](?!call)|$)/.test(url);
}

/** The address this call to action should really use. */
export function routeCta(text: string, url: string): string {
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

/** The same rule for the links inside a post's HTML, written in the WordPress editor. */
export function routeHtml(html: string): string {
  return html.replace(
    /<a(\s[^>]*?)href="(?:https:\/\/www\.softvoltai\.com)?(\/contact[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g,
    (whole, before: string, url: string, after: string, inner: string) => {
      const href = routeCta(inner.replace(/<[^>]+>/g, " "), url);
      return href === url
        ? whole
        : `<a${before}href="${href}"${after}>${inner}</a>`;
    },
  );
}
