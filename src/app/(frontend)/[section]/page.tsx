import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { ArticleGrid, PageHero } from '@/components/content/Listing'
import { RichTextBody } from '@/components/content/RichText'
import { MessageForm } from '@/components/forms/Forms'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SECTIONS, type SectionKey } from '@/lib/constants'
import { findArticles, findOne, findRedirect, pageParam } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
export const dynamicParams = true

type Props = { params: Promise<{ section: string }>; searchParams: Promise<{ page?: string }> }

const isSection = (s: string): s is SectionKey => s in SECTIONS

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }))
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { section } = await params
  const page = pageParam((await searchParams).page)
  if (isSection(section)) {
    const s = SECTIONS[section]
    const path = page > 1 ? `${s.path}?page=${page}` : s.path
    return buildMeta(
      { title: page > 1 ? `${s.label} — страница ${page}` : `${s.label} — CHEATAI`, excerpt: s.description },
      path,
    )
  }
  const doc = await findOne('pages', section)
  if (!doc) return {}
  return buildMeta(doc, `/${doc.slug}`)
}

export default async function SectionOrPage({ params, searchParams }: Props) {
  const { section } = await params

  if (isSection(section)) {
    const s = SECTIONS[section]
    const page = pageParam((await searchParams).page)
    const res = await findArticles({ where: { section: { equals: section } }, page, limit: 13 })
    if (page > 1 && page > res.totalPages) notFound()
    return (
      <>
        <PageHero kicker="Раздел" title={s.label} description={s.description} color={s.color} />
        <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
          <Breadcrumbs items={[{ name: s.label, href: s.path }]} />
          <ArticleGrid docs={res.docs} page={page} totalPages={res.totalPages} basePath={s.path} />
        </div>
      </>
    )
  }

  const doc = await findOne('pages', section)
  if (!doc) {
    const to = await findRedirect(`/${section}`)
    if (to) permanentRedirect(to)
    notFound()
  }

  return (
    <>
      <PageHero title={doc.title} description={doc.excerpt} color="yellow" />
      <div className="mx-auto max-w-3xl px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: doc.title, href: `/${doc.slug}` }]} />
        <article className="mt-6">
          <RichTextBody data={doc.content} />
        </article>
        {doc.form && doc.form !== 'none' && (
          <section className="mt-12" id="form" aria-label="Форма">
            <MessageForm topic={doc.form as 'contact' | 'ads' | 'lead'} />
          </section>
        )}
      </div>
    </>
  )
}
