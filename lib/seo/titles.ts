import { site } from "@/content/site";

/**
 * The SEO title an editor typed into Yoast for one entry, or "" when they left
 * it on Yoast's template.
 *
 * WPGraphQL hands back the title Yoast would print, so an untouched entry
 * comes back as "Its title - SoftVolt AI". That is not a choice anyone made:
 * the brand suffix is taken off and what is left is compared with the entry's
 * own title. Only a title that says something different counts.
 */
export function customSeoTitle(yoastTitle: string | null | undefined, entryTitle: string): string {
  const brand = site.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const trimmed = (yoastTitle ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(new RegExp(`\\s*[-–—|·:]\\s*${brand}$`, "i"), "")
    .trim();
  if (!trimmed) return "";
  return trimmed.toLowerCase() === entryTitle.replace(/\s+/g, " ").trim().toLowerCase() ? "" : trimmed;
}

/** A topic page only goes in the index once it has this many posts; below that it is a thin list of links. */
export const TOPIC_INDEX_MIN = 5;

/**
 * Whether a category or tag has a page worth linking to. A topic page under
 * the threshold is noindex, and a link to it only sends crawlers (and Screaming
 * Frog) to a page that asks to be left out, so the name is shown as a plain
 * label instead until the topic has enough posts.
 */
export const topicIsIndexed = (topic: { count?: number | null }) => (topic.count ?? 0) >= TOPIC_INDEX_MIN;
