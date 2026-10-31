'use client'
import { useEffect, useState } from 'react'
import type { Heading } from '@/lib/lexical'

export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null)
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px' },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [headings])
  if (!headings.length) return null
  return (
    <ol className="grid gap-1 text-[0.92rem]">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? 'pl-4' : ''}>
          <a
            href={`#${h.id}`}
            aria-current={active === h.id ? 'location' : undefined}
            className="block rounded-xl border-2 border-transparent px-3 py-1.5 leading-snug transition hover:translate-x-1 hover:border-line aria-[current=location]:border-line aria-[current=location]:bg-yellow aria-[current=location]:font-bold aria-[current=location]:text-black"
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  )
}

export function ReadingProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => {
      const el = document.getElementById('article-body')
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight * 0.6
      setP(Math.min(1, Math.max(0, -r.top / Math.max(total, 1))))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <div className="fixed inset-x-0 top-[68px] z-40 h-1.5 bg-transparent" aria-hidden>
      <div className="h-full origin-left bg-red" style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}

export function ShareLink() {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      className="btn btn-paper text-xs"
      onClick={async () => {
        const url = location.href.split('#')[0]
        if (navigator.share) {
          try {
            await navigator.share({ url, title: document.title })
            return
          } catch {}
        }
        await navigator.clipboard?.writeText(url)
        setOk(true)
        setTimeout(() => setOk(false), 1600)
      }}
    >
      {ok ? 'Ссылка скопирована!' : 'Поделиться'}
    </button>
  )
}
