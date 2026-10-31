import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolCard } from '@/components/content/Cards'
import { ArticleGrid, PageHero } from '@/components/content/Listing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { findArticles, findMany, getPayloadClient, pageParam } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }

async function getTag(slug: string) {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'tags', where: { slug: { equals: slug } }, limit: 1 })).docs[0] ?? null
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const tag = await getTag((await params).slug)
  if (!tag) return {}
  const page = pageParam((await searchParams).page)
  const res = await findArticles({ where: { tags: { contains: tag.id } }, limit: 1, depth: 0 })
  // Тонкие страницы тегов (меньше 2 материалов и без описания) не индексируем
  const thin = res.totalDocs < 2 && !tag.description
  return buildMeta(
    { title: `${tag.title}: статьи, гайды и инструменты`, excerpt: tag.description },
    page > 1 ? `/tag/${tag.slug}?page=${page}` : `/tag/${tag.slug}`,
    { noindex: thin },
  )
}

export default async function TagPage({ params, searchParams }: Props) {
  const tag = await getTag((await params).slug)
  if (!tag) notFound()
  const page = pageParam((await searchParams).page)
  const [res, tools] = await Promise.all([
    findArticles({ where: { tags: { contains: tag.id } }, page, limit: 13 }),
    page === 1 ? findMany('tools', { where: { tags: { contains: tag.id } }, limit: 4 }) : null,
  ])
  return (
    <>
      <PageHero kicker="Тема" title={tag.title} description={tag.description} color={tag.color ?? 'blue'} />
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: `#${tag.title}`, href: `/tag/${tag.slug}` }]} />
        {tools && tools.docs.length > 0 && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tools.docs.map((t) => (
              <ToolCard key={t.id} t={t} />
            ))}
          </div>
        )}
        <ArticleGrid docs={res.docs} page={page} totalPages={res.totalPages} basePath={`/tag/${tag.slug}`} />
      </div>
    </>
  )
}
