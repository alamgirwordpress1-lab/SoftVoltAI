import { cms } from "@/lib/cms";
import { shareCard } from "@/lib/og/card";

export const alt = "A SoftVolt AI case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// an image route does not inherit the page's params, so it lists them itself and every card is drawn at build
export async function generateStaticParams() {
  const work = await cms.getWork();
  return work.map((w) => ({ slug: w.slug }));
}

/** A case study's card: the kind of build, its title, who it was for — and the screenshot of the live site. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await cms.getWorkItem(slug);
  if (!item) return shareCard({ eyebrow: "Case studies", title: "Builds you can open, not logos you have to trust." });
  return shareCard({
    eyebrow: `Case study · ${item.category}`,
    title: item.title,
    subtitle: `${item.client} · ${item.region}`,
    image: item.image,
  });
}
