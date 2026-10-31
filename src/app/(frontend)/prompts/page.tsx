import type { Metadata } from 'next'
import Link from 'next/link'
import { PromptCardSmall } from '@/components/content/Cards'
import { PageHero } from '@/components/content/Listing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { PROMPT_CATEGORIES } from '@/lib/constants'
import { findMany, pageParam } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { searchParams: Promise<{ category?: string; page?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const cat = PROMPT_CATEGORIES.find((c) => c.value === sp.category)
  return buildMeta(
    {
      title: 'Библиотека промптов для нейросетей — готовые запросы на русском',
      excerpt: 'Проверенные шаблоны промптов для ChatGPT, Claude, GigaChat и других нейросетей: тексты, учёба, бизнес, маркетинг, код и картинки.',
    },
    '/prompts',
    { noindex: !!cat || pageParam(sp.page) > 1 },
  )
}

export default async function PromptsPage({ searchParams }: Props) {
  const sp = await searchParams
  const cat = PROMPT_CATEGORIES.find((c) => c.value === sp.category)?.value
  const page = pageParam(sp.page)
  const res = await findMany('prompts', { where: cat ? { category: { equals: cat } } : undefined, page, limit: 24, sort: 'title' })
  return (
    <>
      <PageHero kicker="Копируй и пользуйся" title="Библиотека промптов" description="Шаблоны запросов, которые экономят время. Подставьте свои данные в [квадратные скобки] — и в путь." color="blue" />
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Промпты', href: '/prompts' }]} />
        <div className="mt-2 flex flex-wrap gap-2" aria-label="Категории промптов">
          <Link href="/prompts" className="chip" aria-current={!cat ? 'true' : undefined}>
            Все
          </Link>
          {PROMPT_CATEGORIES.map((c) => (
            <Link key={c.value} href={`/prompts?category=${c.value}`} className="chip" aria-current={cat === c.value ? 'true' : undefined}>
              {c.label}
            </Link>
          ))}
        </div>
        {res.docs.length ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {res.docs.map((p) => (
              <PromptCardSmall key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="panel halftone mt-8 p-8 text-center font-display text-lg font-bold">В этой категории пока пусто.</p>
        )}
        <Pagination page={page} totalPages={res.totalPages} basePath="/prompts" query={{ category: cat }} />
      </div>
    </>
  )
}
