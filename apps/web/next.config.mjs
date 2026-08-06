/**
 * Resolve the dashboard zone's origin.
 *
 * Prefers Vercel's Related Projects wiring so that each environment proxies to
 * its own matching dashboard deployment: a preview of this app hits the
 * corresponding dashboard preview rather than production. A hardcoded
 * production URL would make cross-app changes impossible to preview.
 *
 * Falls back to DASHBOARD_URL, then to the local dev port.
 */
function dashboardOrigin() {
  const related = process.env.VERCEL_RELATED_PROJECTS
  if (related) {
    try {
      // Shape: [{ "project": { "name": ... }, "production": { "host": ... },
      //           "preview": { "branch": ..., "host": ... } }, ...]
      const projects = JSON.parse(related)
      const dashboard = projects.find((p) =>
        p?.project?.name?.includes('dashboard'),
      )
      const host =
        process.env.VERCEL_ENV === 'production'
          ? dashboard?.production?.host
          : (dashboard?.preview?.host ?? dashboard?.production?.host)
      if (host) return `https://${host}`
    } catch {
      // Malformed value: fall through to the explicit env var below rather than
      // failing the build.
    }
  }

  return process.env.DASHBOARD_URL ?? 'http://localhost:3001'
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: remove once the dead three.js components are fixed or deleted.
    // Currently hides 56 pre-existing type errors (@react-three/fiber and
    // @react-three/drei are imported but never installed).
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },

  /**
   * Serve the club dashboard under /dashboard on this domain.
   *
   * The dashboard is a separate Next app (apps/dashboard) with
   * basePath: "/dashboard", so it already emits its routes AND its assets under
   * that prefix. One rewrite therefore covers both /dashboard/* pages and
   * /dashboard/_next/* static files.
   */
  async rewrites() {
    const origin = dashboardOrigin()
    return [
      {
        source: '/dashboard',
        destination: `${origin}/dashboard`,
      },
      {
        source: '/dashboard/:path*',
        destination: `${origin}/dashboard/:path*`,
      },
    ]
  },
}

export default nextConfig
