import { homeCard } from "@/lib/og/home-card";

export const alt = "SoftVolt AI — You win the client. We deliver the work. Your brand gets the credit.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The home card at a fixed address, /opengraph-image. Images inside the (site)
 * group get a hashed name, so a page that has to name its picture — one an
 * editor added in WordPress, under the catch-all route — points here instead.
 */
export default function Image() {
  return homeCard();
}
