import type { Metadata } from 'next'
import Link from 'next/link'
import type { Where } from 'payload'
import { AdSlot } from '@/components/content/AdSlot'
import { ToolCard } from '@/components/content/Cards'
import { PageHero } from '@/components/content/Listing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { TOOL_CATEGORIES, TOOL_PLATFORMS, TOOL_PRICING, TOOL_TASKS } from '@/lib/constants'
import { findMany, pageParam } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300

type SP = { category?: string; task?: string; pricing?: string; platform?: string; page?: string }
type Props = { searchParams: Promise<SP> }

const FACETS = [
  { key: 'category', label: 'Категория', options: TOOL_CATEGORIES },
  { key: 'task', label: 'Задача', options: TOOL_TASKS },
  { key: 'pricing', label: 'Стоимость', options: TOOL_PRICING },
  { key: 'platform', label: 'Платформа', options: TOOL_PLATFORMS },
] as const

const clean = (sp: SP) => {
  const out: Record<string, string | undefined> = {}
  for (const f of FACETS) {
    const v = sp[f.key]
    if (v && f.options.some((o) => o.value === v)) out[f.key] = v
  }
  return out
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const filtered = Object.keys(clean(sp)).length > 0
  const page = pageParam(sp.page)
  // Фильтры не индексируем (дубли), но ссылки по ним — follow. Пагинация — с self-canonical.
  return buildMeta(
    {
      title: 'Каталог AI-инструментов — нейросети для текста, картинок, видео и автоматизации',
      excerpt: 'Каталог нейросетей с фильтрами по задачам, стоимости и платформам. Для каждого инструмента — описание, сценарии и ограничения.',
      canonical: filtered ? undefined : null,
    },
    page > 1 && !filtered ? `/tools?page=${page}` : '/tools',
    { noindex: filtered },
  )
}

export default async function ToolsPage({ searchParams }: Props) {
  const sp = await searchParams
  const f = clean(sp)
  const page = pageParam(sp.page)
  const where: Where[] = []
  if (f.category) where.push({ category: { equals: f.category } })
  if (f.task) where.push({ tasks: { contains: f.task } })
  if (f.pricing) where.push({ pricing: { equals: f.pricing } })
  if (f.platform) where.push({ platforms: { contains: f.platform } })
  const res = await findMany('tools', { where: where.length ? { and: where } : undefined, page, limit: 24, sort: 'title' })

  const link = (key: string, value?: string) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries({ ...f, [key]: value })) if (v) q.set(k, v)
    const s = q.toString()
    return s ? `/tools?${s}` : '/tools'
  }
  const active = Object.keys(f).length

  return (
    <>
      <PageHero
        kicker="Каталог"
        title="AI-инструменты"
        description="Подберите нейросеть под задачу. Мы описываем, что инструмент умеет и о чём помнить, — без выдуманных цен и рейтингов."
        color="orange"
      />
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Инструменты', href: '/tools' }]} />

        <div className="panel mt-4 grid gap-4 p-4 md:p-6" role="region" aria-label="Фильтры каталога">
          {FACETS.map((facet) => (
            <div key={facet.key} className="grid gap-2 md:flex md:flex-wrap md:items-center">
              <span className="w-28 shrink-0 font-display text-xs font-black uppercase">{facet.label}</span>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:p-0">
              <Link href={link(facet.key, undefined)} className="chip shrink-0" aria-current={!f[facet.key] ? 'true' : undefined}>
                Все
              </Link>
              {facet.options.map((o) => (
                <Link
                  key={o.value}
                  href={link(facet.key, f[facet.key] === o.value ? undefined : o.value)}
                  className="chip shrink-0"
                  aria-current={f[facet.key] === o.value ? 'true' : undefined}
                  rel="nofollow"
                >
                  {o.label}
                </Link>
              ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-line pt-4 text-sm">
            <span>
              Найдено: <b>{res.totalDocs}</b>
            </span>
            {active > 0 && (
              <Link href="/tools" className="btn btn-paper text-xs">
                Сбросить фильтры
              </Link>
            )}
          </div>
        </div>

        <AdSlot placement="catalog" className="mt-8" />

        {res.docs.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {res.docs.map((t) => (
              <ToolCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <p className="panel halftone mt-8 p-8 text-center font-display text-lg font-bold">
            Под такие фильтры ничего нет. <Link href="/tools" className="underline">Сбросить</Link>
          </p>
        )}
        <Pagination page={page} totalPages={res.totalPages} basePath="/tools" query={f} />
      </div>
    </>
  )
}
