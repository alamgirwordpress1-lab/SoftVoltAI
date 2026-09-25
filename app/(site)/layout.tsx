import Script from "next/script";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { VoltLauncher } from "@/components/volt/VoltLauncher";
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
          here. Empty there means no banner and nothing loaded. */}
      {chrome.cookieScript ? <Script id="cookieyes" src={chrome.cookieScript} strategy="afterInteractive" /> : null}
      <SiteHeader chrome={chrome} />
      <main id="main">{children}</main>
      <SiteFooter chrome={chrome} />
      {voltEnabled ? <VoltLauncher endpoint="/api/volt" /> : null}
    </>
  );
}
