export const site = {
  name: "SoftVolt AI",
  // `||` rather than `??`: a host that defines the variable and leaves it empty
  // — which is what Vercel does when it imports the keys out of .env.example —
  // would otherwise leave us with an empty origin, and `new URL("")` throws
  // during the build.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://softvoltai.com",
  tagline: "The white-label production and growth team behind agencies.",
  /** Meta description and Open Graph copy: kept under 160 characters so search results do not cut it off. */
  description:
    "White-label production and growth for agencies: WordPress, WooCommerce, headless Next.js, SEO and paid media, built under your brand from Dhaka.",
  /** The longer description, for schema.org where length is not penalised. */
  longDescription:
    "SoftVolt AI is the white-label production and growth team behind agencies in the UK, US, Canada and Australia. WordPress, WooCommerce, headless Next.js, Payload, Sanity, Shopify, Webflow, AI automation, SEO and paid media — delivered under your brand from Dhaka, with UK and US overlap hours.",
  // TODO(owner): create this mailbox on softvoltai.com before launch.
  email: "hello@softvoltai.com",
  location: "Dhaka, Bangladesh",
  timeZone: "Asia/Dhaka",
  utcOffset: "UTC+6",
  calUrl: process.env.NEXT_PUBLIC_CAL_URL ?? "",
  founderLinkedIn: "https://www.linkedin.com/in/wordpress-developer-alan/",
  markets: ["United Kingdom", "United States", "Canada", "Australia", "European Union"],
};

/**
 * Header navigation: Services (mega menu), Agency Solutions (dropdown),
 * Case Studies, About (dropdown), then the "Book a call" button.
 */
export const nav = {
  services: { label: "Services", href: "/services" },
  agencies: { label: "Agency Solutions", href: "/for" },
  caseStudies: { label: "Case Studies", href: "/case-studies" },
  about: { label: "About SoftVolt AI", href: "/about" },
};

export const aboutLinks = [
  { label: "Our story", href: "/about#story", description: "Why an agency developer built the team behind agencies" },
  { label: "Meet the founder", href: "/about#founder", description: "The named person who scopes and builds your work" },
  { label: "How we work", href: "/about#how-it-works", description: "Five steps, each one written down" },
  { label: "Why SoftVolt AI", href: "/about#why", description: "The rules we keep on every project" },
];

export const headerCta = { label: "Book a call", href: "/contact#call" };

export const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Partner programme", href: "/partner-programme" },
  { label: "Security & confidentiality", href: "/security" },
  { label: "Contact", href: "/contact" },
];

export const resourceLinks = [
  { label: "All services", href: "/services" },
  { label: "Agency solutions", href: "/for" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Rates", href: "/rates" },
];

// TODO(owner): add the company's own profiles once they exist. Entries without an href are not rendered.
export const socials: { label: string; href: string; icon: "linkedin" | "mail" | "facebook" | "instagram" | "x" }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/wordpress-developer-alan/", icon: "linkedin" },
  { label: "Email", href: "mailto:hello@softvoltai.com", icon: "mail" },
  { label: "Facebook", href: "", icon: "facebook" },
  { label: "Instagram", href: "", icon: "instagram" },
  { label: "X", href: "", icon: "x" },
];

export const cta = {
  primary: { label: "Send us a brief", href: "/contact" },
  secondary: { label: "Book a 20-min scoping call", href: "/contact#call" },
  tertiary: { label: "See services & rates", href: "/services" },
};
