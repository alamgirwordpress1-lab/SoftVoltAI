import type { ReactNode } from "react";
import type { IntroPoint, JumpLink } from "@/components/ui/PageIntro";
import type { PageHighlight } from "@/components/ui/PageHeroVisual";
import { Rich } from "@/components/ui/Rich";

/**
 * The banner and intro tabs every inner page has, turned into the props of
 * PageHero and PageIntro. A list an editor left empty falls back to what the
 * page works out for itself — the live figures, the links to its own sections.
 */

export interface BannerCopy {
  eyebrow: string;
  heading: string;
  lede: string;
  facts: { label: string; value: string }[];
}

export interface IntroCopy {
  eyebrow: string;
  heading: string;
  subheading: string;
  paragraphs: { text: string }[];
  points: { title: string; text: string }[];
  links: { text: string; url: string }[];
}

export function bannerProps(banner: BannerCopy, liveFacts: PageHighlight[] = []) {
  return {
    eyebrow: banner.eyebrow,
    title: banner.heading,
    lede: banner.lede || undefined,
    highlights: banner.facts.length ? banner.facts : liveFacts,
  };
}

export function introProps(
  intro: IntroCopy,
  options: { links?: JumpLink[]; paragraph?: (node: ReactNode, index: number, all: IntroCopy["paragraphs"]) => ReactNode } = {},
) {
  const points: IntroPoint[] = intro.points.map(({ title, text }) => ({ title, text }));
  const jump: JumpLink[] = intro.links.length ? intro.links.map(({ text, url }) => ({ label: text, href: url })) : (options.links ?? []);
  return {
    eyebrow: intro.eyebrow,
    title: intro.heading,
    subtitle: intro.subheading || undefined,
    body: intro.paragraphs.map((p, i, all) => {
      const node = <Rich key={i} text={p.text} />;
      return options.paragraph ? options.paragraph(node, i, all) : node;
    }),
    points: points.length ? points : undefined,
    jump: jump.length ? jump : undefined,
  };
}
