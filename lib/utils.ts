import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * A name for use mid-sentence ("For digital marketing agencies"): lower-cases the
 * first letter unless the first word is an acronym or a brand ("SEO agencies",
 * "Google Ads & PPC agencies"), which keep their capitals.
 */
export function midSentence(name: string) {
  const first = name.split(/\s+/)[0] ?? "";
  const keep = (first.length > 1 && first === first.toUpperCase()) || /^(Google|Meta|Shopify|WordPress|WooCommerce|Webflow|Elementor)$/.test(first);
  return keep ? name : name.charAt(0).toLowerCase() + name.slice(1);
}

/** Lower-case, hyphenated slug for URLs and staging hostnames. */
export function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "your-agency"
  );
}

/**
 * Small counts read better as words in a heading, and a heading that counts
 * its own list can never say "eight" above seven cards.
 */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
export function countWord(n: number) {
  return WORDS[n] ?? String(n);
}
