import type { Metadata } from 'next'
import { DEMO_MODE, SITE_URL, absUrl, imgUrl } from './payload'

type SeoDoc = {
  title?: string | null
  excerpt?: string | null
  meta?: { title?: string | null; description?: string | null; image?: unknown } | null
  canonical?: string | null
  noindex?: boolean | null
  cover?: unknown
  publishedAt?: string | null
  updatedAt?: string | null
}

export function buildMeta(
  doc: SeoDoc,
  path: string,
  opts: { type?: 'article' | 'website'; noindex?: boolean; titleAbsolute?: boolean } = {},
): Metadata {
  const title = doc.meta?.title || doc.title || 'CHEATAI'
  const description = (doc.meta?.description || doc.excerpt || '').slice(0, 300)
  const image = imgUrl(doc.meta?.image, 'og') || imgUrl(doc.cover, 'og') || '/og-default.png'
  const canonical = doc.canonical || `${SITE_URL}${path}`
  const noindex = DEMO_MODE || !!doc.noindex || !!opts.noindex
  const titleIsFull = /CHEATAI/.test(title)
  return {
    title: titleIsFull || opts.titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: opts.type ?? 'website',
      title,
      description,
      url: canonical,
      siteName: 'CHEATAI',
      locale: 'ru_RU',
      images: [{ url: absUrl(image)!, width: 1200, height: 630, alt: doc.title ?? 'CHEATAI' }],
      ...(opts.type === 'article'
        ? { publishedTime: doc.publishedAt ?? undefined, modifiedTime: doc.updatedAt ?? undefined }
        : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [absUrl(image)!] },
  }
}
