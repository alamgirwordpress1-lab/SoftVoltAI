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
    description: site.description,
    email: site.email,
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
