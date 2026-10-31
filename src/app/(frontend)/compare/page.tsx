import type { Metadata } from 'next'
import { BattleCard } from '@/components/content/Cards'
import { PageHero } from '@/components/content/Listing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { findMany, pageParam } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { searchParams: Promise<{ page?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = pageParam((await searchParams).page)
  return buildMeta(
    { title: 'Битва нейросетей — сравнения AI-сервисов', excerpt: 'ChatGPT или Claude, Midjourney или FLUX? Сравниваем нейросети по проверяемым критериям и объясняем, кому что подходит.' },
    page > 1 ? `/compare?page=${page}` : '/compare',
  )
}

export default async function ComparePage({ searchParams }: Props) {
  const page = pageParam((await searchParams).page)
  const res = await findMany('comparisons', { page, limit: 12, sort: '-updatedAt', depth: 1 })
  return (
    <>
      <PageHero kicker="Арена" title="Битва нейросетей" description="Сравнения по фактам: разработчик, возможности, платформы и сценарии. Без рейтингов «с потолка»." color="black" />
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Сравнения', href: '/compare' }]} />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {res.docs.map((c, i) => (
            <BattleCard key={c.id} c={c} index={i} />
          ))}
        </div>
        <Pagination page={page} totalPages={res.totalPages} basePath="/compare" />
      </div>
    </>
  )
}
