import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is a Next.js Multi-Zone served under /dashboard on the marketing
  // site's domain. apps/web rewrites /dashboard/:path* here; basePath makes this
  // app generate its own routes and assets under that prefix.
  basePath: "/dashboard",

  images: {
    // The image optimizer does not apply basePath to its `url` query param, so
    // <Image src="/FirstByteBitex4.png" /> made the optimizer fetch
    // /FirstByteBitex4.png (404) instead of /dashboard/FirstByteBitex4.png,
    // returning 400 and a broken image. Serving images unoptimized emits a plain
    // <img src> that basePath does prefix correctly, and it drops the optimizer
    // as an extra moving part behind the zone rewrite. Matches apps/web.
    unoptimized: true,
  },

  /**
   * Security headers for apps/web, same as apps/dashboard
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  experimental: {
    // Requests arrive proxied through apps/web, so the Origin header is the
    // marketing domain rather than this deployment's own host. Next rejects
    // server actions whose Origin does not match x-forwarded-host, which would
    // break login, settings, password reset, and feedback submission with
    // "Invalid Server Actions request" while every page still rendered fine.
    serverActions: {
      allowedOrigins: [
        "teachfirstbyte.com",
        "www.teachfirstbyte.com",
        "localhost:3000",
      ],
    },
  },
};

export default nextConfig;
