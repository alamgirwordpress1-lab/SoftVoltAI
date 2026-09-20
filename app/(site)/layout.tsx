import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteChrome } from "@/lib/cms/site";

/**
 * The chrome is read once per request here and handed to the header and the
 * footer, so neither of them has to know whether it came from WordPress or
 * from /content.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChrome();
  return (
    <>
      <SiteHeader chrome={chrome} />
      <main id="main">{children}</main>
      <SiteFooter chrome={chrome} />
    </>
  );
}
