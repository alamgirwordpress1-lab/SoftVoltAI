import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Manrope, Roboto } from "next/font/google";
import { site } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { shareMetadata } from "@/lib/seo/share";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";
import "./globals.css";

// Four families, one job each: display headings, body copy, interface, data.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  // 600 is never rendered anywhere on the site; 700 and 800 are the display weights
  weight: ["700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
  display: "swap",
});

const title = "SoftVolt AI — White-label production for agencies";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s · SoftVolt AI",
  },
  description: site.description,
  alternates: { canonical: "/" },
  keywords: [
    "white label web development agency",
    "white label WordPress development",
    "white label WooCommerce development",
    "headless WordPress agency",
    "Next.js Payload CMS development",
    "white label AI automation",
    "white label SEO services",
    "white label Google Ads management",
    "agency development partner",
  ],
  ...shareMetadata({ title, description: site.description, path: "/" }),
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // the theme script switches this to THEME_COLORS.dark when the visitor chose dark
  themeColor: THEME_COLORS.light,
  // the site opens light; html[data-theme="dark"] sets `color-scheme: dark` in CSS
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${jakarta.variable} ${inter.variable} ${manrope.variable} ${roboto.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: marks JS as present (the hero intro never flashes its final
            state) and applies a stored dark theme (the page never flashes light). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* browser extensions such as Grammarly add attributes to <body> before React loads */}
      <body suppressHydrationWarning>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <MotionRoot />
        {children}
      </body>
    </html>
  );
}
