import type { Metadata } from "next";
import { ThankYou } from "@/components/sections/ThankYou";
import { thankYouCopy } from "@/content/copy/thank-you";
import { getCopy } from "@/lib/cms/copy";
import { copyMetadata } from "@/lib/cms/meta";

/** Where the message form on the contact page sends people once it has gone. */
export async function generateMetadata(): Promise<Metadata> {
  return { ...(await copyMetadata(thankYouCopy)), robots: { index: false, follow: true } };
}

export default async function ThankYouPage() {
  const copy = await getCopy(thankYouCopy);
  return <ThankYou crumb={{ name: "Thank you", href: "/thank-you" }} sent={copy.message} next={copy.next} />;
}
