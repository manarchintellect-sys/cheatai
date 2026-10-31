'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '../ui/Icon'
import { SubscribeForm } from '../forms/Forms'

type NavItem = { label: string; href: string }
type Suggestion = { type: string; title: string; href: string; excerpt?: string }

const TYPE_LABEL: Record<string, string> = {
  articles: 'Статья',
  tools: 'Инструмент',
  prompts: 'Промпт',
  comparisons: 'Сравнение',
}

function useLockScroll(on: boolean) {
  useEffect(() => {
    if (!on) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [on])
}

function Modal({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: React.ReactNode; label: string }) {
  useLockScroll(open)
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/55 p-3 pt-[8vh] backdrop-blur-[2px] md:p-6" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={label} className="panel max-h-[84dvh] w-full max-w-2xl animate-[rise_.25s_ease_both] overflow-y-auto p-4 md:p-6" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function SearchBox({ onDone }: { onDone: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [items, setItems] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => inputRef.current?.focus(), [])
  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) {
      setItems([])
      return
    }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const r = await fetch(`/search/suggest?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        const j = (await r.json()) as { items: Suggestion[] }
        setItems(j.items)
        setActive(-1)
      } catch {
        /* отменён */
      } finally {
        setLoading(false)
      }
    }, 180)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q])

  const go = (href: string) => {
    onDone()
    router.push(href)
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        if (active >= 0 && items[active]) return go(items[active].href)
        if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`)
      }}
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border-[3px] border-line bg-panel px-4">
          <Icon name="search" className="size-5 shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(a + 1, items.length - 1))
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(a - 1, -1))
              }
            }}
            placeholder="ChatGPT, промпты, автоматизация…"
            aria-label="Поиск по сайту"
            aria-autocomplete="list"
            aria-controls="search-suggest"
            className="h-12 min-w-0 flex-1 bg-transparent text-lg outline-none"
            enterKeyHint="search"
          />
          {loading && <span className="size-4 animate-spin rounded-full border-2 border-line border-t-transparent" aria-hidden />}
        </div>
        <button className="btn btn-yellow h-12 max-sm:hidden">Найти</button>
      </div>
      <ul id="search-suggest" role="listbox" className="mt-4 grid gap-2">
        {items.map((it, i) => (
          <li key={it.href} role="option" aria-selected={active === i}>
            <button
              type="button"
              onClick={() => go(it.href)}
              className={`flex w-full items-start gap-3 rounded-2xl border-2 border-line px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-yellow hover:text-black ${
                active === i ? 'bg-yellow text-black' : 'bg-panel'
              }`}
            >
              <span className="chip mt-0.5 shrink-0 !text-[0.65rem]">{TYPE_LABEL[it.type] ?? it.type}</span>
              <span>
                <span className="block font-bold leading-snug">{it.title}</span>
                {it.excerpt && <span className="line-clamp-1 text-sm opacity-75">{it.excerpt}</span>}
              </span>
            </button>
          </li>
        ))}
        {q.trim().length >= 2 && !loading && !items.length && (
          <li className="rounded-2xl border-2 border-dashed border-line px-4 py-3 text-sm text-muted">
            Ничего не нашлось. Нажмите Enter — поищем по всему тексту.
          </li>
        )}
      </ul>
    </form>
  )
}

export function HeaderActions({ nav }: { nav: NavItem[] }) {
  const [search, setSearch] = useState(false)
  const [sub, setSub] = useState(false)
  const [menu, setMenu] = useState(false)
  const [dark, setDark] = useState(false)
  const pathname = usePathname()

  useEffect(() => setDark(document.documentElement.classList.contains('dark')), [])
  useEffect(() => setMenu(false), [pathname])
  useLockScroll(menu)

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch(true)
      }
      if (e.key === '/' && !/input|textarea/i.test((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
  }
  const closeSearch = useCallback(() => setSearch(false), [])
  const closeSub = useCallback(() => setSub(false), [])

  return (
    <>
      <div className="flex items-center gap-2">
        <button className="btn btn-paper btn-icon" onClick={() => setSearch(true)} aria-label="Поиск (Ctrl+K)">
          <Icon name="search" />
        </button>
        <button className="btn btn-paper btn-icon" onClick={toggleTheme} aria-label={dark ? 'Светлая тема' : 'Тёмная тема'}>
          <Icon name={dark ? 'sun' : 'moon'} />
        </button>
        <button className="btn btn-yellow max-md:hidden" onClick={() => setSub(true)}>
          Подписаться
        </button>
        <button className="btn btn-ink btn-icon lg:hidden" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label="Меню">
          <Icon name={menu ? 'close' : 'menu'} />
        </button>
      </div>

      {menu && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[68px] z-50 overflow-y-auto border-t-[3px] border-line bg-paper lg:hidden">
          <nav aria-label="Мобильное меню" className="halftone grid gap-3 p-4">
            {nav.map((n, i) => (
              <a
                key={n.href}
                href={n.href}
                aria-current={pathname === n.href ? 'page' : undefined}
                className="panel panel-hover flex items-center justify-between px-5 py-4 font-display text-lg font-black uppercase"
                style={{ animation: `rise .35s ${i * 0.04}s ease both` }}
              >
                {n.label} <Icon name="arrow" />
              </a>
            ))}
            <button className="btn btn-yellow mt-2 py-4" onClick={() => setSub(true)}>
              Подписаться на рассылку
            </button>
          </nav>
        </div>
      )}

      <Modal open={search} onClose={closeSearch} label="Поиск">
        <SearchBox onDone={closeSearch} />
      </Modal>
      <Modal open={sub} onClose={closeSub} label="Подписка">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <span className="caption mb-3 text-xs">Рассылка</span>
            <h2 className="font-display text-2xl font-black uppercase">Главное об AI раз в неделю</h2>
            <p className="mt-2 text-muted">Без спама и хайпа: разборы, инструменты и промпты, которые реально работают.</p>
          </div>
          <button className="btn btn-paper btn-icon shrink-0" onClick={closeSub} aria-label="Закрыть">
            <Icon name="close" />
          </button>
        </div>
        <SubscribeForm source="header" />
      </Modal>
    </>
  )
}
