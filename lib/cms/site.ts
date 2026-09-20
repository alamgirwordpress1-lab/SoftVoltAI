import "server-only";
import { cache } from "react";
import { aboutLinks, companyLinks, cta, headerCta, nav, resourceLinks, site, socials } from "@/content/site";
import { wpMenus, wpSettings, type WpMenuItem } from "@/lib/cms/wordpress";

/**
 * The header, the footer and the identity, from WordPress when it has them.
 *
 * The settings screen on the CMS owns the brand line, the contact details and
 * the two calls to action; the WordPress menus own the navigation. Anything an
 * editor has not filled in falls back to /content/site.ts, so the chrome is
 * never half-empty while the CMS is being set up.
 */

export interface ChromeLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface ChromeColumn {
  title: string;
  links: ChromeLink[];
}

export interface SiteChrome {
  name: string;
  tagline: string;
  description: string;
  email: string;
  location: string;
  timeZone: string;
  utcOffset: string;
  calUrl: string;
  url: string;
  markets: string[];
  nav: { services: ChromeLink; agencies: ChromeLink; caseStudies: ChromeLink; about: ChromeLink };
  aboutLinks: ChromeLink[];
  headerCta: ChromeLink;
  cta: { primary: ChromeLink; secondary: ChromeLink };
  footerColumns: ChromeColumn[] | null;
  footerBlurb: string;
  footerNote: string;
  socials: typeof socials;
  /** Where this came from — useful in the admin, and in a bug report. */
  source: "wordpress" | "content";
}

const ICONS: Record<string, (typeof socials)[number]["icon"]> = {
  linkedin: "linkedin",
  facebook: "facebook",
  instagram: "instagram",
  x: "x",
  twitter: "x",
  email: "mail",
  mail: "mail",
};

/** A WordPress header menu, matched onto the four slots the header renders. */
function navFromMenu(items: WpMenuItem[]) {
  const find = (...needles: string[]) => items.find((item) => needles.some((n) => item.href.startsWith(n) || item.label.toLowerCase().includes(n)));
  return {
    services: find("/services", "service") ?? nav.services,
    agencies: find("/for", "agency", "solutions") ?? nav.agencies,
    caseStudies: find("/case-studies", "case") ?? nav.caseStudies,
    about: find("/about", "about") ?? nav.about,
  };
}

export const getSiteChrome = cache(async (): Promise<SiteChrome> => {
  const local: SiteChrome = {
    name: site.name,
    tagline: site.tagline,
    description: site.description,
    email: site.email,
    location: site.location,
    timeZone: site.timeZone,
    utcOffset: site.utcOffset,
    calUrl: site.calUrl,
    url: site.url,
    markets: [...site.markets],
    nav,
    aboutLinks: [...aboutLinks],
    headerCta,
    cta,
    footerColumns: null,
    footerBlurb: "",
    footerNote: "",
    socials,
    source: "content",
  };

  const settings = await wpSettings();
  if (!settings) return local;

  const menus = (await wpMenus(settings.siteUrl)) ?? {};
  const header = menus.header ?? [];
  const footer = menus.footer ?? [];

  const wpSocials = settings.socialLinks?.length
    ? settings.socialLinks.map((link) => ({
        label: link.label,
        href: link.href,
        icon: ICONS[link.label.trim().toLowerCase()] ?? "mail",
      }))
    : null;

  return {
    ...local,
    name: settings.brandName || local.name,
    tagline: settings.tagline || local.tagline,
    description: settings.description || local.description,
    email: settings.email || local.email,
    location: settings.location || local.location,
    timeZone: settings.timeZone || local.timeZone,
    utcOffset: settings.utcOffset || local.utcOffset,
    calUrl: settings.calUrl || local.calUrl,
    url: settings.siteUrl || local.url,
    markets: settings.markets?.length ? settings.markets : local.markets,
    nav: header.length ? navFromMenu(header) : local.nav,
    // a header item's children are the dropdown under "About"
    aboutLinks: header.find((item) => item.href.startsWith("/about"))?.children?.length
      ? (header.find((item) => item.href.startsWith("/about"))?.children ?? []).map(({ label, href, description }) => ({ label, href, description }))
      : local.aboutLinks,
    headerCta: settings.headerCta?.label ? settings.headerCta : local.headerCta,
    cta: {
      primary: settings.ctaPrimary?.label ? settings.ctaPrimary : local.cta.primary,
      secondary: settings.ctaSecondary?.label ? settings.ctaSecondary : local.cta.secondary,
    },
    // each top-level footer item is a column; its children are that column's links
    footerColumns: footer.length
      ? footer.map((item) => ({
          title: item.label,
          links: item.children.length ? item.children.map(({ label, href }) => ({ label, href })) : [{ label: item.label, href: item.href }],
        }))
      : null,
    footerBlurb: settings.footerBlurb || "",
    footerNote: settings.footerNote || "",
    socials: wpSocials ?? local.socials,
    source: "wordpress",
  };
});

/** The two columns the footer builds from content rather than from a menu. */
export const footerFallbackColumns = { companyLinks, resourceLinks };
