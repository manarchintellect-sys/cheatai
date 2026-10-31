import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleGrid, PageHero } from '@/components/content/Listing'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SITE_URL, findArticles, getPayloadClient, pageParam } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }

async function getAuthor(slug: string) {
  const payload = await getPayloadClient()
  return (await payload.find({ collection: 'authors', where: { slug: { equals: slug } }, limit: 1 })).docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const au = await getAuthor((await params).slug)
  if (!au) return {}
  return buildMeta({ title: `${au.name} — автор CHEATAI`, excerpt: au.bio }, `/author/${au.slug}`)
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const au = await getAuthor((await params).slug)
  if (!au) notFound()
  const page = pageParam((await searchParams).page)
  const res = await findArticles({ where: { authors: { contains: au.id } }, page, limit: 13 })
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: au.name,
          jobTitle: au.position ?? undefined,
          description: au.bio ?? undefined,
          url: `${SITE_URL}/author/${au.slug}`,
          worksFor: { '@id': `${SITE_URL}/#org` },
          sameAs: (au.links ?? []).map((l) => l.url),
        }}
      />
      <PageHero kicker={au.position ?? 'Автор'} title={au.name} description={au.bio} color="yellow" />
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Редакция', href: '/editorial' }, { name: au.name, href: `/author/${au.slug}` }]} />
        <ArticleGrid docs={res.docs} page={page} totalPages={res.totalPages} basePath={`/author/${au.slug}`} empty="У автора пока нет опубликованных материалов." />
      </div>
    </>
  )
}
