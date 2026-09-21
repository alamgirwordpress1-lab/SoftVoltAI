import { forCopy } from "@/content/copy/for";
import { cms } from "@/lib/cms";
import { getCopy } from "@/lib/cms/copy";
import { shareCard } from "@/lib/og/card";
import { midSentence } from "@/lib/utils";

export const alt = "How SoftVolt AI works with one kind of agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// an image route does not inherit the page's params, so it lists them itself and every card is drawn at build
export async function generateStaticParams() {
  const types = await cms.getAgencyTypes();
  return types.map((a) => ({ slug: a.slug }));
}

/** An agency type's card: the same small line and headline as the page, then its problem in one line. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = await cms.getAgencyType(slug);
  if (!type) return shareCard({ eyebrow: "Who we help", title: "Built for agencies that have already sold the work." });
  const { detail_top: top } = await getCopy(forCopy, { agency: midSentence(type.name) });
  return shareCard({ eyebrow: top.eyebrow, title: top.heading, subtitle: type.problem });
}
