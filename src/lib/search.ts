import 'server-only'
import { sql } from '@payloadcms/db-postgres'
import { getPayloadClient, showDrafts } from './payload'

export type SearchType = 'all' | 'articles' | 'tools' | 'prompts' | 'comparisons'
export type SearchHit = { type: Exclude<SearchType, 'all'>; slug: string; title: string; excerpt: string | null; section: string | null; score: number; href: string }

const hrefOf = (h: Omit<SearchHit, 'href'>) =>
  h.type === 'tools' ? `/tools/${h.slug}` : h.type === 'prompts' ? `/prompts/${h.slug}` : h.type === 'comparisons' ? `/compare/${h.slug}` : `/${h.section}/${h.slug}`

/**
 * Полнотекстовый поиск по заголовкам и содержимому с исправлением опечаток (pg_trgm, word_similarity).
 * Если расширения нет — работает обычный ILIKE.
 */
export async function search(qRaw: string, type: SearchType = 'all', limit = 30): Promise<SearchHit[]> {
  const q = qRaw.trim().slice(0, 100)
  if (q.length < 2) return []
  const payload = await getPayloadClient()
  const db = payload.db.drizzle
  const drafts = await showDrafts()
  const ql = q.toLowerCase()
  const like = `%${q.replace(/[%_\\]/g, (m) => '\\' + m)}%`

  const part = (table: string, t: Exclude<SearchType, 'all'>, hasSection: boolean, trgm: boolean) => {
    const status = drafts ? sql`true` : sql`_status = 'published'`
    const section = hasSection ? sql.raw('section::text') : sql`null`
    const score = trgm
      ? sql`(word_similarity(${ql}, lower(title)) * 3 + word_similarity(${ql}, lower(coalesce(excerpt, ''))) + word_similarity(${ql}, lower(coalesce(search_text, ''))) * 0.8 + (case when title ilike ${like} then 2 else 0 end))`
      : sql`(case when title ilike ${like} then 3 else 0 end + case when excerpt ilike ${like} then 1 else 0 end)`
    const match = trgm
      ? sql`(title ilike ${like} or excerpt ilike ${like} or search_text ilike ${like} or word_similarity(${ql}, lower(title)) > 0.45 or word_similarity(${ql}, lower(coalesce(search_text, ''))) > 0.5)`
      : sql`(title ilike ${like} or excerpt ilike ${like} or search_text ilike ${like})`
    return sql`select ${t}::text as type, slug, title, excerpt, ${section} as section, ${score} as score from ${sql.raw(`"${table}"`)} where slug is not null and ${status} and ${match}`
  }

  const run = async (trgm: boolean) => {
    const parts = [
      (type === 'all' || type === 'articles') && part('articles', 'articles', true, trgm),
      (type === 'all' || type === 'tools') && part('tools', 'tools', false, trgm),
      (type === 'all' || type === 'prompts') && part('prompts', 'prompts', false, trgm),
      (type === 'all' || type === 'comparisons') && part('comparisons', 'comparisons', false, trgm),
    ].filter(Boolean) as ReturnType<typeof sql>[]
    const union = sql.join(parts, sql` union all `)
    const res = await db.execute(sql`select * from (${union}) s order by score desc, title asc limit ${limit}`)
    return (res.rows as Omit<SearchHit, 'href'>[]).map((r) => ({ ...r, score: Number(r.score), href: hrefOf(r) }))
  }

  try {
    return await run(true)
  } catch {
    return run(false)
  }
}
