import { cms } from "@/lib/cms";
import { shareCard } from "@/lib/og/card";

export const alt = "A post on the SoftVolt AI blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// an image route does not inherit the page's params, so it lists them itself and every card is drawn at
// build; a post published later gets its card on the first share, then keeps it
export async function generateStaticParams() {
  const slugs = await cms.getWpSlugs();
  return (slugs?.posts ?? []).map((p) => ({ slug: p.slug }));
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** A post's card: its date, title and excerpt, with the featured image beside them when the post has one. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await cms.getPost(slug);
  if (!post) return shareCard({ eyebrow: "Blog", title: "Notes from the team behind agencies" });
  const date = post.date ? dateFormat.format(new Date(post.date)) : "";
  return shareCard({
    eyebrow: date ? `Blog · ${date}` : "Blog",
    title: post.seo.ogTitle || post.title,
    subtitle: post.seo.ogDescription || post.excerpt,
    image: post.image?.src,
  });
}
