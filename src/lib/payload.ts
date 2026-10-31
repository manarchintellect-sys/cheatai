import 'server-only'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from 'react'
import { getPayload, type Where } from 'payload'
import type { Article, Comparison, Media, Page, Prompt, Tool } from '@/payload-types'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
/** Демо-режим (staging): показываем черновики-заглушки и закрываем весь сайт от индексации. */
export const DEMO_MODE = process.env.DEMO_MODE === 'true'

export const getPayloadClient = cache(() => getPayload({ config }))

/** Можно ли показывать черновики в этом запросе. */
export const showDrafts = async () => {
  if (DEMO_MODE) return true
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

export const visibility = async (): Promise<{ draft: boolean; where: Where }> => {
  const drafts = await showDrafts()
  return { draft: drafts, where: drafts ? {} : { _status: { equals: 'published' } } }
}

export const and = (...parts: (Where | undefined)[]): Where => {
  const list = parts.filter((p): p is Where => !!p && Object.keys(p).length > 0)
  return list.length ? { and: list } : {}
}


export async function findArticles(opts: {
  where?: Where
  limit?: number
  page?: number
  depth?: number
  sort?: string
}) {
  const payload = await getPayloadClient()
  const v = await visibility()
  return payload.find({
    collection: 'articles',
    draft: v.draft,
    overrideAccess: true,
    where: and(v.where, opts.where),
    limit: opts.limit ?? 12,
    page: opts.page ?? 1,
    depth: opts.depth ?? 1,
    sort: (opts.sort ?? ['-publishedAt', '-createdAt']) as string,
  })
}

export async function findOne<T extends 'articles' | 'tools' | 'comparisons' | 'prompts' | 'pages'>(
  collection: T,
  slug: string,
  extra?: Where,
  depth = 2,
) {
  const payload = await getPayloadClient()
  const v = await visibility()
  const res = await payload.find({
    collection,
    draft: v.draft,
    overrideAccess: true,
    where: and(v.where, { slug: { equals: slug } }, extra),
    limit: 1,
    depth,
  })
  return (res.docs[0] ?? null) as unknown as
    | (T extends 'articles' ? Article : T extends 'tools' ? Tool : T extends 'comparisons' ? Comparison : T extends 'prompts' ? Prompt : Page)
    | null
}

export async function findMany<T extends 'tools' | 'comparisons' | 'prompts' | 'pages'>(
  collection: T,
  opts: { where?: Where; limit?: number; page?: number; sort?: string; depth?: number } = {},
) {
  const payload = await getPayloadClient()
  const v = await visibility()
  return payload.find({
    collection,
    draft: v.draft,
    overrideAccess: true,
    where: and(v.where, opts.where),
    limit: opts.limit ?? 24,
    page: opts.page ?? 1,
    sort: opts.sort ?? 'title',
    depth: opts.depth ?? 1,
  })
}

export const getHome = cache(async () => (await getPayloadClient()).findGlobal({ slug: 'home', depth: 2 }))
export const getSettings = cache(async () => (await getPayloadClient()).findGlobal({ slug: 'site-settings', depth: 0 }))

/** Проверка 301/308-редиректа для несуществующего адреса. */
export async function findRedirect(path: string) {
  const payload = await getPayloadClient()
  const res = await payload.find({ collection: 'redirects', where: { from: { equals: path } }, limit: 1, depth: 0 })
  return res.docs[0]?.to ?? null
}

export async function getActiveAd(placement: string) {
  const payload = await getPayloadClient()
  const now = new Date().toISOString()
  const res = await payload.find({
    collection: 'ad-slots',
    where: {
      and: [
        { placement: { equals: placement } },
        { active: { equals: true } },
        { or: [{ startsAt: { exists: false } }, { startsAt: { less_than_equal: now } }] },
        { or: [{ endsAt: { exists: false } }, { endsAt: { greater_than_equal: now } }] },
      ],
    },
    limit: 1,
    depth: 1,
  })
  const ad = res.docs[0]
  // внешнюю рекламу без erid и рекламодателя не показываем — требование закона о рекламе
  if (ad && ad.kind === 'external' && (!ad.erid || !ad.advertiser)) return null
  return ad ?? null
}

/* ---------- helpers ---------- */

export const mediaOf = (m: unknown): Media | null => (m && typeof m === 'object' && 'url' in (m as object) ? (m as Media) : null)

export const imgUrl = (m: unknown, size: 'thumb' | 'card' | 'og' | 'original' = 'card') => {
  const media = mediaOf(m)
  if (!media) return null
  const s = size === 'original' ? null : media.sizes?.[size]
  const u = s?.url || media.url || null
  // относительный путь: next/image оптимизирует локальные файлы без настройки доменов
  return u ? u.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '') : null
}

export const absUrl = (path?: string | null) => (!path ? undefined : path.startsWith('http') ? path : `${SITE_URL}${path}`)

export const articlePath = (a: Pick<Article, 'section' | 'slug'>) => `/${a.section}/${a.slug}`

export const fmtDate = (d?: string | null) =>
  d ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d)) : null

export const pageParam = (v?: string | string[]) => {
  const n = Number(Array.isArray(v) ? v[0] : v)
  return Number.isInteger(n) && n > 1 && n < 10000 ? n : 1
}

