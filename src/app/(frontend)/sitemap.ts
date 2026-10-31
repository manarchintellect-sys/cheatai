import type { MetadataRoute } from 'next'
import type { Where } from 'payload'
import { DEMO_MODE, SITE_URL, getPayloadClient } from '@/lib/payload'
import { SECTIONS } from '@/lib/constants'

export const revalidate = 3600

/** XML-карта: только опубликованные и индексируемые страницы. В демо-режиме — пустая. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (DEMO_MODE) return []
  const payload = await getPayloadClient()
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1 },
    ...Object.values(SECTIONS).map((s) => ({ url: `${SITE_URL}${s.path}`, changeFrequency: 'daily' as const, priority: 0.8 })),
    { url: `${SITE_URL}/tools`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/prompts`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/compare`, changeFrequency: 'weekly', priority: 0.7 },
  ]
  const where: Where = { and: [{ _status: { equals: 'published' } }, { noindex: { not_equals: true } }] }
  const q = { where, limit: 50000, depth: 0, pagination: false, overrideAccess: true } as const

  const [articles, tools, comps, prompts, pages, cats, tags] = await Promise.all([
    payload.find({ collection: 'articles', ...q, select: { slug: true, section: true, updatedAt: true } }),
    payload.find({ collection: 'tools', ...q, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'comparisons', ...q, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'prompts', ...q, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'pages', ...q, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'categories', limit: 1000, depth: 0, pagination: false }),
    payload.find({ collection: 'tags', limit: 5000, depth: 0, pagination: false }),
  ])

  return [
    ...base,
    ...articles.docs.map((d) => ({ url: `${SITE_URL}/${d.section}/${d.slug}`, lastModified: d.updatedAt, changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...tools.docs.map((d) => ({ url: `${SITE_URL}/tools/${d.slug}`, lastModified: d.updatedAt, priority: 0.7 })),
    ...comps.docs.map((d) => ({ url: `${SITE_URL}/compare/${d.slug}`, lastModified: d.updatedAt, priority: 0.8 })),
    ...prompts.docs.map((d) => ({ url: `${SITE_URL}/prompts/${d.slug}`, lastModified: d.updatedAt, priority: 0.6 })),
    ...pages.docs.map((d) => ({ url: `${SITE_URL}/${d.slug}`, lastModified: d.updatedAt, priority: 0.3 })),
    ...cats.docs.map((d) => ({ url: `${SITE_URL}/category/${d.slug}`, priority: 0.5 })),
    ...tags.docs.filter((t) => t.description).map((d) => ({ url: `${SITE_URL}/tag/${d.slug}`, priority: 0.4 })),
  ]
}
