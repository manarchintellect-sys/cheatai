import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'
import { lexicalToText, readingMinutes } from '../lib/lexical'

/** Сбрасывает ISR-кэш сайта после изменения контента. */
export const revalidateSite: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (req.context?.skipRevalidate) return doc
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    /* вне Next.js (сид, CLI) — пропускаем */
  }
  return doc
}

/**
 * - Автор не может публиковать: только сохранять черновики.
 * - Реальная дата публикации ставится в момент фактической публикации.
 * - Считается время чтения и поисковый текст.
 */
export const prepareContent: CollectionBeforeChangeHook = ({ data, req, originalDoc }) => {
  const role = (req.user as { role?: string } | null)?.role
  if (role === 'author' && data._status === 'published' && originalDoc?._status !== 'published') {
    throw new APIError('Автор не может публиковать материалы. Сохраните черновик — его опубликует редактор.', 403)
  }
  if (data._status === 'published' && !data.publishedAt && !originalDoc?.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }
  if (data.content) {
    const extra = [
      ...(Array.isArray(data.faq) ? data.faq.map((f: { question?: string; answer?: string }) => `${f.question} ${f.answer}`) : []),
    ].join(' ')
    const text = `${lexicalToText(data.content)} ${extra}`.trim()
    data.searchText = `${data.title ?? ''} ${data.excerpt ?? ''} ${text}`.slice(0, 20000)
    data.readingTime = readingMinutes(text)
  }
  return data
}
