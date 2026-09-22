import type { Metadata } from "next";
import { ThankYou } from "@/components/sections/ThankYou";
import { thankYouCopy } from "@/content/copy/thank-you";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

/** Where the four-step brief sends people once it has gone. */
export async function generateMetadata(): Promise<Metadata> {
  const meta = await copyMetadata(thankYouCopy);
  return { ...meta, alternates: { canonical: "/thank-you/brief" }, robots: { index: false, follow: true } };
}

export default async function BriefThankYouPage() {
  const copy = await getCopy(thankYouCopy);
  return <ThankYou facts={copy.banner.facts} crumb={{ name: "Brief received", href: "/thank-you/brief" }} sent={copy.brief} next={copy.next} />;
}
