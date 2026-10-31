import type { MetadataRoute } from 'next'
import { DEMO_MODE, SITE_URL } from '@/lib/payload'

export default function robots(): MetadataRoute.Robots {
  if (DEMO_MODE) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/search', '/preview', '/exit-preview'],
      },
      { userAgent: 'Yandex', allow: '/', disallow: ['/admin', '/api/', '/search', '/preview'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
