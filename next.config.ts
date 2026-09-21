import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // OneDrive + Windows: pin the tracing/turbopack root so Next never walks up
  // into the home directory looking for a lockfile.
  outputFileTracingRoot: path.join(process.cwd()),
  turbopack: { root: path.join(process.cwd()) },
  images: {
    formats: ["image/avif", "image/webp"],
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
