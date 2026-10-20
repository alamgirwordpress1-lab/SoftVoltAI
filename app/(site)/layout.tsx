import Script from "next/script";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BackToTop } from "@/components/layout/BackToTop";
import { VoltLauncher } from "@/components/volt/VoltLauncher";
import { PageFx } from "@/components/motion/PageFx";
import { getSiteChrome } from "@/lib/cms/site";

/** Volt, the sales assistant, answers from /api/volt; without a DeepSeek key there is no assistant on the site. */
const voltEnabled = Boolean(process.env.DEEPSEEK_API_KEY);

/**
 * The chrome is read once per request here and handed to the header and the
 * footer, so neither of them has to know whether it came from WordPress or
 * from /content.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChrome();
  return (
    <>
      {/* The cookie banner. A consent plugin on the WordPress install can only
          draw its banner on WordPress pages, which nobody visits — so the
          banner is a script named on the Headless settings screen and loaded
          here. Empty there means no banner and nothing loaded. It loads after the page
          has finished loading, so it never delays the first screen on a phone. */}
      {chrome.cookieScript ? <Script id="cookieyes" src={chrome.cookieScript} strategy="lazyOnload" /> : null}
      <SiteHeader chrome={chrome} />
      <main id="main">{children}</main>
      <SiteFooter chrome={chrome} />
      <BackToTop aboveLauncher={voltEnabled} />
      {voltEnabled ? <VoltLauncher endpoint="/api/volt" /> : null}
      {/* cursor light on .fx-spot cards and parallax on [data-parallax] drawings */}
      <PageFx />
    </>
  );
}
