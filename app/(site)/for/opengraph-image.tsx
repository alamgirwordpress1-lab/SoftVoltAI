import { forCopy } from "@/content/copy/for";
import { pageCard } from "@/lib/og/page-card";

export const alt = "SoftVolt AI — the agencies we work with";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card a shared link to this page unfolds into — see lib/og/card.tsx. */
export default function Image() {
  return pageCard(forCopy);
}
