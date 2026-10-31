import Link from 'next/link'
import { Logo } from '../brand/Logo'
import { HeaderActions } from './HeaderActions'
import { NavLinks } from './NavLinks'

export const NAV = [
  { label: 'Главная', href: '/' },
  { label: 'Новости AI', href: '/news' },
  { label: 'Нейросети', href: '/articles' },
  { label: 'Инструменты', href: '/tools' },
  { label: 'Промпты', href: '/prompts' },
  { label: 'AI для бизнеса', href: '/business' },
  { label: 'Гайды', href: '/guides' },
]

export function Header({ demo }: { demo: boolean }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-yellow focus:px-4 focus:py-2 focus:text-black">
        Перейти к содержимому
      </a>
      {demo && (
        <div className="bg-black px-4 py-1.5 text-center font-display text-[0.68rem] font-bold uppercase tracking-wider text-yellow dark:bg-yellow dark:text-black">
          Демо-режим: материалы — черновики до редакционной проверки, сайт закрыт от индексации
        </div>
      )}
      <header className="sticky top-0 z-50 border-b-[3px] border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="mx-auto flex h-[65px] max-w-[1320px] items-center justify-between gap-4 px-4 md:px-6">
          <Link href="/" aria-label="CHEATAI — на главную" className="shrink-0 text-[1.65rem] transition hover:-rotate-2 md:text-[1.85rem]">
            <Logo />
          </Link>
          <NavLinks items={NAV} />
          <HeaderActions nav={NAV} />
        </div>
      </header>
    </>
  )
}
