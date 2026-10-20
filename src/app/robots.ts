import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// The public site (landing, blog, legal pages) is open to crawlers, with its CSS/JS. App pages need a session and
// redirect to /login, so there is nothing to index there; API, auth callbacks and unsubscribe links stay out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/auth/', '/unsubscribe', '/reset-password', '/onboarding'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
