import { aboutCopy } from "@/content/copy/about";
import { pageCard } from "@/lib/og/page-card";

export const alt = "About SoftVolt AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card a shared link to this page unfolds into — see lib/og/card.tsx. */
export default function Image() {
  return pageCard(aboutCopy);
}
