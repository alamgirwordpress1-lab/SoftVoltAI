import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { getSiteChrome } from "@/lib/cms/site";

/**
 * The fallback for a 404 outside the (site) group, where no layout draws the
 * header and the footer — so this one draws them itself. Inside the group,
 * app/(site)/not-found.tsx answers instead; rendering the chrome here as well
 * is what used to put two headers on the page.
 */
export default async function NotFound() {
  const chrome = await getSiteChrome();
  return (
    <>
      <SiteHeader chrome={chrome} />
      <main id="main">
        <NotFoundContent />
      </main>
      <SiteFooter chrome={chrome} />
    </>
  );
}
