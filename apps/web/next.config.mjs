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

/**
 * Reduce a configured URL to a bare origin.
 *
 * DASHBOARD_URL must be an origin only, because the rewrites below append
 * `/dashboard/:path*` themselves. Setting it to the URL you actually visit
 * (…vercel.app/dashboard) is the natural mistake and produces a destination of
 * /dashboard/dashboard/*, which the dashboard zone 404s — the page still comes
 * from the dashboard app, so it looks like a broken rewrite rather than a bad
 * env var. Normalizing here makes both forms work.
 */
function toOrigin(value) {
  try {
    return new URL(value).origin
  } catch {
    // Not a parseable absolute URL: strip a trailing /dashboard and any trailing
    // slash so a host:port style value still behaves.
    return value.replace(/\/+$/, '').replace(/\/dashboard$/, '')
  }
}

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

  const configured = process.env.DASHBOARD_URL
  return configured ? toOrigin(configured) : 'http://localhost:3001'
}

/** @type {import('next').NextConfig} */
const nextConfig = {
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
