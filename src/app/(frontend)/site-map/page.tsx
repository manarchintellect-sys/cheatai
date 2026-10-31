import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/content/Listing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SECTIONS, type SectionKey } from '@/lib/constants'
import { findArticles, findMany } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 3600

export const generateMetadata = (): Metadata =>
  buildMeta({ title: 'Карта сайта', excerpt: 'Все разделы и материалы CHEATAI на одной странице.' }, '/site-map')

export default async function SiteMapPage() {
  const [articles, tools, comps, prompts, pages] = await Promise.all([
    findArticles({ limit: 1000, depth: 0, sort: 'title' }),
    findMany('tools', { limit: 1000, depth: 0 }),
    findMany('comparisons', { limit: 500, depth: 0 }),
    findMany('prompts', { limit: 1000, depth: 0 }),
    findMany('pages', { limit: 100, depth: 0 }),
  ])
  const groups: { title: string; href?: string; links: { href: string; label: string }[] }[] = [
    ...(Object.keys(SECTIONS) as SectionKey[]).map((k) => ({
      title: SECTIONS[k].label,
      href: SECTIONS[k].path,
      links: articles.docs.filter((a) => a.section === k).map((a) => ({ href: `/${a.section}/${a.slug}`, label: a.title })),
    })),
    { title: 'Инструменты', href: '/tools', links: tools.docs.map((t) => ({ href: `/tools/${t.slug}`, label: t.title })) },
    { title: 'Сравнения', href: '/compare', links: comps.docs.map((c) => ({ href: `/compare/${c.slug}`, label: c.title })) },
    { title: 'Промпты', href: '/prompts', links: prompts.docs.map((p) => ({ href: `/prompts/${p.slug}`, label: p.title })) },
    { title: 'О проекте', links: pages.docs.map((p) => ({ href: `/${p.slug}`, label: p.title })) },
  ]
  return (
    <>
      <PageHero title="Карта сайта" color="yellow" />
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Карта сайта', href: '/site-map' }]} />
        <div className="mt-6 columns-1 gap-8 md:columns-2 lg:columns-3">
          {groups.map((g) => (
            <section key={g.title} className="panel mb-8 break-inside-avoid p-5">
              <h2 className="mb-3 font-display text-lg font-black uppercase">{g.href ? <Link href={g.href} className="hover:underline">{g.title}</Link> : g.title}</h2>
              <ul className="grid gap-1.5 text-[0.95rem]">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
