import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

// Security headers (Security Policy finding SW-9). The CSP lists only what the
// site actually loads: Google Analytics, the Meta Pixel, Firebase Storage media
// and same-origin BotID / Vercel Analytics. Scripts keep 'unsafe-inline' because
// the pages are static and Next's inline flight scripts and the GA / Pixel loaders
// have no nonce; every other directive is locked down.
const isPreview = process.env.VERCEL_ENV === "preview";
const isDev = process.env.NODE_ENV === "development";
// The Vercel toolbar is injected on preview deployments only.
const toolbar = isPreview ? " https://vercel.live" : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://connect.facebook.net${toolbar}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://storage.googleapis.com https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com" + (isPreview ? " https://vercel.live https://vercel.com" : ""),
  "font-src 'self' data:" + (isPreview ? " https://vercel.live" : ""),
  "media-src 'self' https://storage.googleapis.com",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net" +
    (isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""),
  `frame-src ${isPreview ? "https://vercel.live" : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/groovy-ego-462522-v2.firebasestorage.app/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withBotId(nextConfig);
