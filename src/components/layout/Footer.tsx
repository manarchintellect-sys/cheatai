import Link from 'next/link'
import { Logo } from '../brand/Logo'
import { SubscribeForm } from '../forms/Forms'
import { SECTIONS } from '@/lib/constants'

const COLS = [
  {
    title: 'Разделы',
    links: [
      ...Object.values(SECTIONS).map((s) => ({ label: s.label, href: s.path })),
      { label: 'Инструменты', href: '/tools' },
      { label: 'Промпты', href: '/prompts' },
      { label: 'Битва нейросетей', href: '/compare' },
    ],
  },
  {
    title: 'Проект',
    links: [
      { label: 'О проекте', href: '/about' },
      { label: 'Редакция', href: '/editorial' },
      { label: 'Реклама', href: '/advertising' },
      { label: 'Контакты', href: '/contacts' },
    ],
  },
  {
    title: 'Документы',
    links: [
      { label: 'Политика конфиденциальности', href: '/privacy' },
      { label: 'Пользовательское соглашение', href: '/terms' },
      { label: 'Карта сайта', href: '/site-map' },
    ],
  },
]

export function Footer({ socials = [] }: { socials?: { label: string; url: string }[] }) {
  return (
    <footer className="mt-20 bg-black text-white">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="block h-8 w-full bg-paper" aria-hidden="true">
        <path d="M0 40L1440 0V40z" fill="#111" />
      </svg>
      <div className="mx-auto grid max-w-[1320px] gap-12 px-4 pb-10 pt-6 md:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="text-4xl" aria-label="CHEATAI — на главную">
            <Logo variant="inverse" slogan />
          </Link>
          <p className="mt-5 max-w-sm text-white/75">Искусственный интеллект простым языком. Разборы, инструменты, промпты и гайды без лишнего хайпа.</p>
          <div className="mt-6 max-w-md rounded-[18px] border-[3px] border-white/90 p-4 [--ink:#f4f1e8] [--line:#f4f1e8] [--muted:#b3b0a6] [--panel:#1b1b1b]">
            <p className="mb-3 font-display text-sm font-black uppercase text-yellow">Рассылка CHEATAI</p>
            <SubscribeForm source="footer" compact />
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="mb-4 font-display text-xs font-black uppercase tracking-wider text-yellow">{c.title}</p>
              <ul className="grid gap-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/85 transition hover:text-yellow">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t-2 border-white/15">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-sm text-white/70 md:px-6">
          <p>
            <b className="text-white">CHEATAI — медиапроект BONGO GROUP.</b> © {new Date().getFullYear()}
          </p>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="chip !border-white !bg-transparent !text-white hover:!bg-yellow hover:!text-black">
                {s.label}
              </a>
            ))}
            <span className="chip !border-white !bg-transparent !text-white">18+</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
