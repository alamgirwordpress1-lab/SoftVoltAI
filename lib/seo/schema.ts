import { site } from "@/content/site";
import { founder } from "@/content/founder";
import { pillars } from "@/content/pillars";

const orgId = `${site.url}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId,
    name: site.name,
    url: site.url,
    description: site.longDescription,
    email: site.email,
    // the logo search engines may show beside the name in results and knowledge panels
    logo: { "@type": "ImageObject", url: `${site.url}${site.logo.src}`, width: site.logo.width, height: site.logo.height },
    image: `${site.url}${site.logo.src}`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        areaServed: ["GB", "US", "CA", "AU"],
        availableLanguage: ["en"],
      },
    ],
    // no profiles, no key: an empty sameAs says nothing
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    areaServed: site.markets.map((name) => ({ "@type": "Country", name })),
    founder: {
      "@type": "Person",
      name: founder.name,
      jobTitle: "Founder",
      sameAs: [founder.linkedin],
    },
    knowsAbout: pillars.flatMap((p) => p.services.map((s) => s.name)),
    makesOffer: pillars.flatMap((p) =>
      p.services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `White-label ${s.name}`,
          description: s.summary,
          provider: { "@id": orgId },
        },
      })),
    ),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": orgId },
    inLanguage: "en-GB",
  };
}
