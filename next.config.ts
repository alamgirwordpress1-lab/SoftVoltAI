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
    remotePatterns: [
      { protocol: "https", hostname: "cms.softvoltai.com", pathname: "/wp-content/uploads/**" },
      // the CMS's first address, kept while pages cached before the move still point at it
      { protocol: "https", hostname: "cms.charguty.online", pathname: "/wp-content/uploads/**" },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    // /work became /case-studies
    return [{ source: "/work", destination: "/case-studies", permanent: true }];
  },
};

export default nextConfig;
