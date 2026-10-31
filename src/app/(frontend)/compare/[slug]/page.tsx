import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Tool } from '@/payload-types'
import { BattleCard, ToolBadge } from '@/components/content/Cards'
import { CompareTable } from '@/components/content/CompareTable'
import { FaqBlock, SourcesBlock } from '@/components/content/Extras'
import { Callout, RichTextBody } from '@/components/content/RichText'
import { JsonLd, faqLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SITE_URL, findMany, findOne, findRedirect, fmtDate } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await findMany('comparisons', { limit: 200, depth: 0 })).docs.map((c) => ({ slug: c.slug! }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await findOne('comparisons', (await params).slug)
  if (!c) return {}
  return buildMeta(c, `/compare/${c.slug}`, { type: 'article' })
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params
  const c = await findOne('comparisons', slug)
  if (!c) {
    const to = await findRedirect(`/compare/${slug}`)
    if (to) permanentRedirect(to)
    notFound()
  }
  const A = c.toolA as Tool
  const B = c.toolB as Tool
  const others = await findMany('comparisons', { where: { id: { not_equals: c.id } }, limit: 3, sort: '-updatedAt' })

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: c.title,
          description: c.excerpt,
          datePublished: c.publishedAt ?? undefined,
          dateModified: c.publishedAt ? c.updatedAt : undefined,
          mainEntityOfPage: `${SITE_URL}/compare/${c.slug}`,
          publisher: { '@id': `${SITE_URL}/#org` },
          about: [A, B].filter(Boolean).map((t) => ({ '@type': 'SoftwareApplication', name: t.title })),
        }}
      />
      {faqLd(c.faq) && <JsonLd data={faqLd(c.faq)} />}

      <section className="relative overflow-hidden border-b-[3px] border-line bg-black text-white">
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fff_1.4px,transparent_1.8px)] [background-size:11px_11px]" aria-hidden />
        <div className="relative mx-auto max-w-[1100px] px-4 py-10 md:px-6 md:py-14 [--muted:#cfccc2]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8">
            {[A, B].map((t, i) =>
              t ? (
                <Link key={t.id} href={`/tools/${t.slug}`} className={`flex flex-col items-center gap-3 text-center transition hover:-translate-y-1 ${i === 1 ? 'order-3' : ''}`}>
                  <ToolBadge t={t} className="size-20 bg-white text-2xl md:size-28 md:text-3xl" />
                  <span className="font-display text-lg font-black md:text-2xl">{t.title}</span>
                </Link>
              ) : null,
            )}
            <span className="order-2 grid size-20 place-items-center md:size-28">
              <svg viewBox="0 0 100 100" className="absolute size-20 md:size-28" aria-hidden>
                <polygon points="50,0 62,30 98,22 72,50 98,78 62,70 50,100 38,70 2,78 28,50 2,22 38,30" fill="#FFDE00" stroke="#fff" strokeWidth="3" />
              </svg>
              <span className="relative font-display text-2xl font-black italic text-black md:text-4xl">VS</span>
            </span>
          </div>
          <h1 className="mt-10 text-center font-display text-[clamp(1.7rem,1.2rem+2.4vw,3rem)] font-black leading-tight">{c.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/80">{c.excerpt}</p>
          {c.isDemo && <p className="mt-4 text-center"><span className="chip !border-dashed !border-white !bg-transparent !text-white">Черновик · на проверке редакции</span></p>}
          {c.publishedAt && <p className="mt-3 text-center text-sm text-white/60">Обновлено {fmtDate(c.updatedAt)}</p>}
        </div>
      </section>

      <div className="mx-auto max-w-[1100px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Сравнения', href: '/compare' }, { name: c.title, href: `/compare/${c.slug}` }]} />
        {!!c.criteria?.length && (
          <section className="mt-6" aria-labelledby="table">
            <h2 id="table" className="section-title mb-5">Сравнение по пунктам</h2>
            <CompareTable a={A?.title ?? 'A'} b={B?.title ?? 'B'} rows={c.criteria} />
          </section>
        )}
        <div className="mx-auto mt-12 max-w-[760px]">
          <RichTextBody data={c.content} />
          {c.verdict && <Callout variant="conclusion" title="Кому что выбрать" text={c.verdict} />}
          <FaqBlock items={c.faq} />
          <SourcesBlock items={c.sources} />
        </div>
        {others.docs.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">Ещё битвы</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.docs.map((o, i) => (
                <BattleCard key={o.id} c={o} index={i + 1} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
