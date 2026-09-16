import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Manrope, Roboto } from "next/font/google";
import { site } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import { MotionRoot } from "@/components/motion/MotionRoot";
import "./globals.css";

// Four families, one job each: display headings, body copy, interface, data.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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

const title = "SoftVolt AI — White-label production & growth partner for agencies";

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
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint so the hero intro never flashes its final state first.
const jsFlag = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${jakarta.variable} ${inter.variable} ${manrope.variable} ${roboto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <MotionRoot />
        {children}
      </body>
    </html>
  );
}
