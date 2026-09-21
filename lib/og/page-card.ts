import "server-only";
import type { PageCopy, ParaField, Section, TextField } from "@/content/copy/schema";
import { getCopy } from "@/lib/cms/copy";
import { shareCard } from "@/lib/og/card";

type BannerPage = PageCopy<
  { seo: Section<{ title: TextField; description: ParaField }>; banner: Section<{ eyebrow: TextField; heading: TextField }> } & Record<string, Section>
>;

/**
 * A designed page's share card: the small line and headline from its Banner
 * tab and the description from its "Google & sharing" tab, so an editor who
 * rewrites the banner in WordPress rewrites the card with it.
 */
export async function pageCard(page: BannerPage) {
  const { banner, seo } = await getCopy(page);
  return shareCard({ eyebrow: banner.eyebrow, title: banner.heading, subtitle: seo.description });
}
