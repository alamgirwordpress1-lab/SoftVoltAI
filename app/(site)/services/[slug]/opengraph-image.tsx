import { cms } from "@/lib/cms";
import { shareCard } from "@/lib/og/card";

export const alt = "A SoftVolt AI white-label service";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// an image route does not inherit the page's params, so it lists them itself and every card is drawn at build
export async function generateStaticParams() {
  const services = await cms.getServices();
  return services.map((s) => ({ slug: s.slug }));
}

/** A service's card: its pillar, its page headline and the description it gives search results. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await cms.getService(slug);
  if (!service) return shareCard({ eyebrow: "Services", title: "White-label production for agencies" });
  return shareCard({ eyebrow: `Service · ${service.pillarGroup.name}`, title: service.title, subtitle: service.seo });
}
