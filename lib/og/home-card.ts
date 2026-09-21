import "server-only";
import { homeCopy } from "@/content/copy/home";
import { getCopy } from "@/lib/cms/copy";
import { shareCard } from "@/lib/og/card";

/** The home page's card: the banner's small line and its three-row headline, the last row in green. */
export async function homeCard() {
  const { banner } = await getCopy(homeCopy);
  return shareCard({ eyebrow: banner.eyebrow, title: banner.headline });
}
