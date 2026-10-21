import type { NextConfig } from "next";
import path from "path";

/** The three every response needs, scripts and pictures included: a crawler checks them on everything. */
const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const securityHeaders = [
  ...baseSecurityHeaders,
  // the microphone is allowed for this origin only: Volt, the site's assistant, listens when a visitor talks to it
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
  // HTTPS only, for two years, on this host and anything under it
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // A broad Content-Security-Policy: scripts, styles and media stay on HTTPS, plugins (object/embed) are
  // blocked, <base> can't be hijacked and only this origin may frame the site. Third-party hosts are
  // allowed over https: because Google Tag Manager, reCAPTCHA and CookieYes load scripts from several domains.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "media-src 'self' data: blob: https:",
      "frame-src 'self' https:",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https:",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

/**
 * Vercel sets VERCEL_ENV on every deployment: "production" for the live site,
 * "preview" for every branch and pull request. A preview is a full copy of the
 * site on a public URL, so it tells search engines to stay out: a preview in
 * the index competes with the real page. Production, and a build anywhere
 * else, sends nothing extra.
 */
const isPreviewDeployment = Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // the site's CSS goes into the HTML instead of four separate files the browser
  // must fetch before it can paint: removes the render-blocking requests on mobile
  experimental: { inlineCss: true },
  // OneDrive + Windows: pin the tracing/turbopack root so Next never walks up
  // into the home directory looking for a lockfile.
  outputFileTracingRoot: path.join(process.cwd()),
  turbopack: { root: path.join(process.cwd()) },
  images: {
    formats: ["image/avif", "image/webp"],
    // next/image puts the largest width in the plain src that crawlers and old browsers fetch.
    // 1440 covers the widest picture on the site (a banner at about 1100px) on a sharp laptop
    // screen, and keeps every src under 100 kB: at 1920 the blog and guide pictures were
    // 120–140 kB, which Screaming Frog reports as "Images over 100 kB".
    deviceSizes: [640, 750, 828, 1080, 1200, 1440],
    // media lives on the WordPress install; Next optimises it and caches the
    // result at the edge, so the CMS serves each original once
    remotePatterns: [{ protocol: "https", hostname: "cms.softvoltai.com", pathname: "/wp-content/uploads/**" }],
    // WordPress never rewrites an upload in place — a replaced image gets a new
    // file name — so an optimised copy can stay cached for a month instead of
    // the default four hours. Fewer re-optimisations, fewer slow first loads.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // On Vercel the rule above never reaches the scripts under /_next/static or the
      // pictures /_next/image makes, so they went out without these headers. Named here,
      // they get them too. Cache-Control is left alone: those files set their own.
      { source: "/_next/:path*", headers: baseSecurityHeaders },
      ...(isPreviewDeployment ? [{ source: "/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : []),
      // Pictures in /public keep their names across deploys, so a browser keeps
      // them a day and refreshes them in the background for a week after. The
      // hashed files under /_next are left alone: they are already immutable.
      {
        source: "/:file((?!_next/).+\\.(?:png|jpe?g|svg|webp|avif|gif|ico))",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  async redirects() {
    // /work became /case-studies
    return [{ source: "/work", destination: "/case-studies", permanent: true }];
  },
};

export default nextConfig;
