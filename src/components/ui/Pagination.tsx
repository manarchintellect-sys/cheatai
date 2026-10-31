import Link from 'next/link'

/** Пагинация реальными ссылками (?page=N) — индексируется и работает без JS. */
export function Pagination({ page, totalPages, basePath, query = {} }: { page: number; totalPages: number; basePath: string; query?: Record<string, string | undefined> }) {
  if (totalPages <= 1) return null
  const href = (p: number) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries(query)) if (v) q.set(k, v)
    if (p > 1) q.set('page', String(p))
    const s = q.toString()
    return s ? `${basePath}?${s}` : basePath
  }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
  return (
    <nav aria-label="Страницы" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className="btn btn-paper">
          ← Назад
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span aria-hidden>…</span>}
          <Link href={href(p)} aria-current={p === page ? 'page' : undefined} className={`btn btn-icon ${p === page ? 'btn-yellow' : 'btn-paper'}`}>
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} rel="next" className="btn btn-paper">
          Дальше →
        </Link>
      )}
    </nav>
  )
}
