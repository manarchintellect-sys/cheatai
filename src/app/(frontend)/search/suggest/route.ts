import { NextResponse } from 'next/server'
import { search } from '@/lib/search'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q') ?? ''
  const hits = await search(q, 'all', 8)
  return NextResponse.json(
    { items: hits.map((h) => ({ type: h.type, title: h.title, href: h.href, excerpt: h.excerpt })) },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', 'X-Robots-Tag': 'noindex' } },
  )
}
