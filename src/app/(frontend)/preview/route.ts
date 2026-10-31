import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

/** Предпросмотр черновика: доступен только авторизованным пользователям CMS. */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') ?? '/'
  if (!path.startsWith('/') || path.startsWith('//')) return new Response('Bad path', { status: 400 })
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return new Response('Войдите в CMS, чтобы смотреть черновики', { status: 401 })
  ;(await draftMode()).enable()
  redirect(path)
}
