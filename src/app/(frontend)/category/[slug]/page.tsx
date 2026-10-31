import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleGrid, PageHero } from '@/components/content/Listing'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { findArticles, getPayloadClient, pageParam } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }

async function getCat(slug: string) {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })).docs[0] ?? null
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const cat = await getCat((await params).slug)
  if (!cat) return {}
  const page = pageParam((await searchParams).page)
  const res = await findArticles({ where: { category: { equals: cat.id } }, limit: 1, depth: 0 })
  return buildMeta(
    { title: page > 1 ? `${cat.title} — страница ${page}` : cat.title, excerpt: cat.description },
    page > 1 ? `/category/${cat.slug}?page=${page}` : `/category/${cat.slug}`,
    { noindex: res.totalDocs === 0 },
  )
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const cat = await getCat((await params).slug)
  if (!cat) notFound()
  const page = pageParam((await searchParams).page)
  const res = await findArticles({ where: { category: { equals: cat.id } }, page, limit: 13 })
  return (
    <>
      <PageHero kicker="Категория" title={cat.title} description={cat.description} color={cat.color ?? 'yellow'} />
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: cat.title, href: `/category/${cat.slug}` }]} />
        <ArticleGrid docs={res.docs} page={page} totalPages={res.totalPages} basePath={`/category/${cat.slug}`} />
      </div>
    </>
  )
}
