import { site } from "@/content/site";
import { cms } from "@/lib/cms";

/**
 * /llms.txt: a plain-text map of the site for AI assistants and answer engines
 * (ChatGPT, Claude, Perplexity, Gemini, Copilot). Built from the same content as
 * the pages and the sitemap, so a new service, product or case study is listed
 * here automatically.
 */
export const revalidate = 3600;

const clean = (text: string | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

export async function GET() {
  const [services, agencyTypes, products, work] = await Promise.all([cms.getServices(), cms.getAgencyTypes(), cms.getProducts(), cms.getWork()]);
  const url = (path: string) => `${site.url}${path}`;

  const lines = [
    "# SoftVolt AI",
    "",
    "> White-label web development, SEO and AI automation for digital agencies in the UK, the US, Canada, Australia and Europe. A senior team in Dhaka, Bangladesh works UK and US hours. The agency keeps the client, the relationship and the credit.",
    "",
    "Key facts:",
    "- Founded in 2023. Senior team based in Dhaka, Bangladesh, working UK and US overlap hours.",
    "- Works only with agencies, under the agency's brand: mutual NDA, no contact with the agency's client, a named producer, fixed-price scopes.",
    "- Services: website builds (WordPress, WooCommerce, Next.js, Laravel, Shopify, Webflow), AI and workflow automation, SEO and paid media, website care and support.",
    "- Contact: hello@softvoltai.com",
    "",
    "## Services",
    ...services.map((s) => `- [${s.name}](${url(`/services/${s.slug}`)}): ${clean(s.summary)}`),
    "",
    "## Who we work with",
    ...agencyTypes.map((a) => `- [${a.name}](${url(`/for/${a.slug}`)}): ${clean(a.seo)}`),
    "",
    "## Products",
    ...products.map((p) => `- [${p.name}](${url(`/products/${p.slug}`)}): ${clean(p.summary)}`),
    "",
    "## Case studies",
    ...work.map((w) => `- [${w.title}](${url(`/case-studies/${w.slug}`)}): ${clean(w.summary)}`),
    "",
    "## Company",
    `- [Pricing and monthly plans](${url("/rates")})`,
    `- [Security and confidentiality](${url("/security")})`,
    `- [Partner programme](${url("/partner-programme")})`,
    `- [About the team](${url("/about")})`,
    `- [Contact and project brief](${url("/contact")})`,
    `- [Blog](${url("/blog")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
