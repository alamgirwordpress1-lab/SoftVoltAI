export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  /** One bold line: what this person owns. Optional — omitted if not set. */
  headline?: string;
  /** Optional so a new member can go live with a name and photo while their
      bio is still being written. */
  bio?: string;
  /** Their own words, in their own voice. Never write this for them. */
  quote?: string;
  /** Shown as the tag row under the bio. */
  facts?: string[];
  linkedin: string;
}

export const team: TeamMember[] = [
  {
    name: "Md Alamgir Hossen",
    role: "Founder · Senior WordPress & Next.js developer",
    photo: "/founder.png",
    headline: "Building SoftVolt AI's production side — the code, the QA and the handover",
    bio: "Nine years of PHP, WordPress, WooCommerce and Elementor work for agencies in the UK and Bangladesh, most recently leading the WordPress team at a UK agency. Custom themes and plugins, headless WordPress with Next.js, and the unglamorous fixes that keep client sites alive.",
    facts: ["BSc in Computer Science & Engineering", "Team lead at a UK agency", "Based in Dhaka, works UK and US hours"],
    linkedin: "https://www.linkedin.com/in/wordpress-developer-alan/",
  },
  {
    name: "Md Mazidul Hossain Likhon",
    role: "Co-founder · SEO & search strategy",
    photo: "/team-likhon.png",
    headline: "Building future-ready search — semantic SEO, link building and AI-driven optimisation (GEO & AEO)",
    // His own copy, moved into the site's third-person voice and UK spelling.
    bio: "An SEO specialist with a deep focus on link building and outreach. Four years of hands-on experience across more than 50 clients, building tailored strategies with semantic SEO and AI-driven search optimisation — GEO and AEO.",
    facts: ["4+ years in SEO", "50+ clients", "Semantic SEO, GEO & AEO"],
    // TODO(owner): a quote from him, in his own words, whenever he writes one.
    linkedin: "https://www.linkedin.com/in/md-mazidul-hossain-likhon/",
  },
];

/** Kept so existing imports of the single founder keep working. */
export const founder = team[0];
