'use server'
import { headers } from 'next/headers'
import { z } from 'zod'
import { getPayloadClient } from '@/lib/payload'

export type FormState = { ok: boolean; message: string } | null

/* Простейший rate-limit в памяти процесса: 5 запросов в 10 минут с одного IP. */
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return list.length > 5
}

/** Антиспам: honeypot-поле + минимальное время заполнения формы + лимит. */
async function spamCheck(fd: FormData) {
  if (String(fd.get('website') ?? '').length > 0) return 'spam'
  const ts = Number(fd.get('ts'))
  if (!ts || Date.now() - ts < 2500) return 'Слишком быстро — похоже на робота. Попробуйте ещё раз.'
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'local'
  if (limited(ip)) return 'Слишком много запросов. Попробуйте через несколько минут.'
  return null
}

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Проверьте адрес почты').max(200),
  consent: z.literal('on', { errorMap: () => ({ message: 'Нужно согласие на обработку персональных данных' }) }),
  source: z.string().max(100).optional(),
})

export async function subscribe(_: FormState, fd: FormData): Promise<FormState> {
  const spam = await spamCheck(fd)
  if (spam === 'spam') return { ok: true, message: 'Готово!' }
  if (spam) return { ok: false, message: spam }
  const parsed = subscribeSchema.safeParse({ email: fd.get('email'), consent: fd.get('consent'), source: fd.get('source') ?? undefined })
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }
  const payload = await getPayloadClient()
  const exists = await payload.find({ collection: 'subscribers', where: { email: { equals: parsed.data.email } }, limit: 1, depth: 0 })
  if (!exists.docs.length) {
    await payload.create({
      collection: 'subscribers',
      overrideAccess: true,
      data: { email: parsed.data.email, source: parsed.data.source ?? 'site', consent: true },
    })
  }
  return { ok: true, message: 'BOOM! Вы подписаны. Первое письмо уже летит.' }
}

const messageSchema = z.object({
  name: z.string().trim().min(2, 'Как к вам обращаться?').max(120),
  email: z.string().trim().email('Проверьте адрес почты').max(200),
  company: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, 'Напишите чуть подробнее (от 10 символов)').max(5000),
  topic: z.enum(['contact', 'ads', 'lead']),
  consent: z.literal('on', { errorMap: () => ({ message: 'Нужно согласие на обработку персональных данных' }) }),
})

export async function sendMessage(_: FormState, fd: FormData): Promise<FormState> {
  const spam = await spamCheck(fd)
  if (spam === 'spam') return { ok: true, message: 'Спасибо!' }
  if (spam) return { ok: false, message: spam }
  const parsed = messageSchema.safeParse({
    name: fd.get('name'),
    email: fd.get('email'),
    company: fd.get('company') || undefined,
    message: fd.get('message'),
    topic: fd.get('topic'),
    consent: fd.get('consent'),
  })
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message }
  const { consent: _c, ...data } = parsed.data
  const payload = await getPayloadClient()
  await payload.create({ collection: 'messages', overrideAccess: true, data })
  return { ok: true, message: 'Сообщение получено! Ответим на почту в течение рабочего дня.' }
}
