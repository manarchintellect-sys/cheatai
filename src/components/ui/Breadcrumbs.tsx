import Link from 'next/link'
import { JsonLd, breadcrumbLd } from '../seo/JsonLd'
import { SITE_URL } from '@/lib/payload'

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: 'Главная', href: '/' }, ...items]
  return (
    <>
      <nav aria-label="Хлебные крошки" className="mb-5 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="line-clamp-1 font-semibold text-ink">
                  {it.name}
                </span>
              ) : (
                <Link href={it.href} className="font-semibold underline-offset-4 hover:text-ink hover:underline">
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(all.map((i) => ({ name: i.name, url: `${SITE_URL}${i.href === '/' ? '' : i.href}` })))} />
    </>
  )
}
