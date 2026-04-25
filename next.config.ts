import type { NextConfig } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alfisalcon.com";

// Content-Security-Policy directive values
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Scripts — Next.js inline scripts + Google tag if you add it later
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  // Styles — inline styles (Tailwind) + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts — Google Fonts CDN
  "font-src 'self' https://fonts.gstatic.com data:",
  // Images — self, Supabase storage, Google avatars, data URIs
  "img-src 'self' data: blob: https://cmubwrhnnuxphrblzpkh.supabase.co https://lh3.googleusercontent.com",
  // Connections — Supabase API + analytics
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com",
  // Frames — disallow by default
  "frame-ancestors 'none'",
  "frame-src 'none'",
  // Media
  "media-src 'self'",
  // Object
  "object-src 'none'",
  // Manifest
  "manifest-src 'self'",
  // Base URI hardening
  "base-uri 'self'",
  // Form action (Supabase auth)
  `form-action 'self' https://*.supabase.co`,
  // Upgrade insecure requests in production
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  // CSP
  { key: "Content-Security-Policy", value: CSP_DIRECTIVES },
  // HSTS — 2 years, include subdomains, preload-ready
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // No MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // DNS prefetch control
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Referrer — send full URL on same origin, origin-only cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Permissions / privacy-sensitive browser features
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",  // disables FLoC
    ].join(", "),
  },
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Remove X-Powered-By fingerprint (also set via poweredByHeader: false)
  { key: "X-Powered-By", value: "" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,      // removes "X-Powered-By: Next.js"
  compress: true,              // gzip responses (Hostinger Node servers honour this)

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,  // 30-day edge cache
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cmubwrhnnuxphrblzpkh.supabase.co" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Cache favicons + manifest
        source: "/(favicon.ico|icon|icon512|opengraph-image|manifest.webmanifest)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // www → non-www canonical redirect
      {
        source: "/(.*)",
        has: [{ type: "host", value: `www.${SITE_URL.replace("https://", "")}` }],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
