import fs from "node:fs";
import path from "node:path";
import type { RecommendingClient } from "@/lib/cms/types";

/**
 * Preview-only client photos.
 *
 * Drop square images into public/clients/people/ and they take over the hero
 * globe on this machine, so the layout can be judged with faces on it before
 * any real client has been asked. That folder is git-ignored, so these never
 * reach the repo, the deployed site or anyone outside this machine.
 *
 * The names below are deliberately the standard placeholder names — nobody can
 * mistake them for a real endorsement. Real people go in `recommendingClients`
 * (content/clients.ts), with their own name and their permission on record.
 */
const PLACEHOLDER_IDENTITIES = [
  { name: "Jane Doe", role: "Founder", company: "Sample Agency", country: "UK" },
  { name: "John Smith", role: "Managing Director", company: "Example Media", country: "US" },
  { name: "Alex Roe", role: "Head of Delivery", company: "Placeholder Studio", country: "UK" },
  { name: "Sam Poe", role: "Marketing Director", company: "Specimen Group", country: "CA" },
  { name: "Robin Doe", role: "Creative Director", company: "Sample Collective", country: "AU" },
  { name: "Chris Roe", role: "Operations Lead", company: "Example Partners", country: "US" },
  { name: "Taylor Doe", role: "SEO Lead", company: "Placeholder Digital", country: "UK" },
  { name: "Jordan Poe", role: "Account Director", company: "Specimen Media", country: "DE" },
];

const IMAGE = /\.(avif|jpe?g|png|webp)$/i;

/** Placeholder people, or an empty list when the folder is empty — which is always the case in the repo. */
export function placeholderClients(): RecommendingClient[] {
  const dir = path.join(process.cwd(), "public", "clients", "people");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => IMAGE.test(f)).sort();
  } catch {
    return []; // no folder: nothing to preview
  }
  if (!files.length) return [];
  console.warn(`[globe] preview photos in use: ${files.length} file(s) from public/clients/people/. They are placeholders and never ship.`);
  return files.map((file, i) => {
    const who = PLACEHOLDER_IDENTITIES[i % PLACEHOLDER_IDENTITIES.length];
    return { id: `preview-${i + 1}`, ...who, photo: `/clients/people/${file}`, consent: "Placeholder — not a real client" };
  });
}
