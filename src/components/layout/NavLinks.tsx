'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLinks({ items }: { items: { label: string; href: string }[] }) {
  const path = usePathname()
  const isActive = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'))
  return (
    <nav aria-label="Основное меню" className="max-lg:hidden">
      <ul className="flex items-center gap-1">
        {items.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              aria-current={isActive(n.href) ? 'page' : undefined}
              className="relative block rounded-full border-2 border-transparent px-3 py-1.5 text-[0.86rem] font-bold transition hover:-translate-y-0.5 hover:border-line hover:bg-yellow hover:text-black aria-[current=page]:border-line aria-[current=page]:bg-yellow aria-[current=page]:text-black"
            >
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
