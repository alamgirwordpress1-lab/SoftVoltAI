import { caseStudiesCopy } from "@/content/copy/case-studies";
import { pageCard } from "@/lib/og/page-card";

export const alt = "SoftVolt AI — case studies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card a shared link to this page unfolds into — see lib/og/card.tsx. */
export default function Image() {
  return pageCard(caseStudiesCopy);
}
