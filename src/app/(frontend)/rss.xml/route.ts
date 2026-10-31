import { DEMO_MODE, SITE_URL, getPayloadClient } from '@/lib/payload'

export const revalidate = 900

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET() {
  const payload = await getPayloadClient()
  const res = DEMO_MODE
    ? { docs: [] }
    : await payload.find({ collection: 'articles', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 50, depth: 0 })
  const items = res.docs
    .map(
      (a) => `<item><title>${esc(a.title)}</title><link>${SITE_URL}/${a.section}/${a.slug}</link><guid>${SITE_URL}/${a.section}/${a.slug}</guid>${
        a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ''
      }<description>${esc(a.excerpt ?? '')}</description></item>`,
    )
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>CHEATAI</title><link>${SITE_URL}</link><description>Искусственный интеллект простым языком</description><language>ru</language>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
