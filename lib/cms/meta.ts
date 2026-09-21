import "server-only";
import type { Metadata } from "next";
import type { PageCopy, Section, TextField, ParaField } from "@/content/copy/schema";
import { getCopy } from "@/lib/cms/copy";
import { shareMetadata } from "@/lib/seo/share";

type SeoPage = PageCopy<{ seo: Section<{ title: TextField; description: ParaField }> } & Record<string, Section>>;

/**
 * A designed page's title and description, from its "Google & sharing" tab.
 * The home page's title is used as written; every other page gets the site
 * name after it, from the root layout's title template.
 */
export async function copyMetadata(page: SeoPage, options: { absoluteTitle?: boolean } = {}): Promise<Metadata> {
  const { seo } = await getCopy(page);
  return {
    title: options.absoluteTitle ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: page.uri },
    ...shareMetadata({ title: seo.title, description: seo.description, path: page.uri }),
  };
}
