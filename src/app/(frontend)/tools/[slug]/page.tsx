import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Tool } from '@/payload-types'
import { ArticleCard, BattleCard, ToolBadge, ToolCard } from '@/components/content/Cards'
import { FaqBlock, SourcesBlock } from '@/components/content/Extras'
import { RichTextBody } from '@/components/content/RichText'
import { JsonLd, faqLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { TOOL_CATEGORIES, TOOL_PLATFORMS, TOOL_PRICING, TOOL_TASKS, labelOf } from '@/lib/constants'
import { SITE_URL, findArticles, findMany, findOne, findRedirect } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await findMany('tools', { limit: 300, depth: 0 })).docs.map((t) => ({ slug: t.slug! }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await findOne('tools', (await params).slug)
  if (!t) return {}
  return buildMeta({ ...t, title: t.meta?.title || `${t.title}: что умеет и кому подходит` }, `/tools/${t.slug}`)
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const t = await findOne('tools', slug)
  if (!t) {
    const to = await findRedirect(`/tools/${slug}`)
    if (to) permanentRedirect(to)
    notFound()
  }
  const [battles, articles, similar] = await Promise.all([
    findMany('comparisons', { where: { or: [{ toolA: { equals: t.id } }, { toolB: { equals: t.id } }] }, limit: 4, depth: 1 }),
    findArticles({ where: { tools: { contains: t.id } }, limit: 3 }),
    findMany('tools', { where: { and: [{ category: { equals: t.category } }, { id: { not_equals: t.id } }] }, limit: 4 }),
  ])

  const promoted = t.partner?.promoted
  const outUrl = t.partner?.url || t.website
  const facts: [string, string][] = [
    ['Разработчик', t.developer ?? '—'],
    ['Категория', labelOf(TOOL_CATEGORIES, t.category)],
    ['Задачи', (t.tasks ?? []).map((x) => labelOf(TOOL_TASKS, x)).join(', ') || '—'],
    ['Модель оплаты', labelOf(TOOL_PRICING, t.pricing)],
    ['Платформы', (t.platforms ?? []).map((x) => labelOf(TOOL_PLATFORMS, x)).join(', ') || '—'],
  ]

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: t.title,
          description: t.excerpt,
          url: `${SITE_URL}/tools/${t.slug}`,
          applicationCategory: labelOf(TOOL_CATEGORIES, t.category),
          operatingSystem: (t.platforms ?? []).map((x) => labelOf(TOOL_PLATFORMS, x)).join(', ') || undefined,
          author: t.developer ? { '@type': 'Organization', name: t.developer } : undefined,
          sameAs: t.website || undefined,
        }}
      />
      {faqLd(t.faq) && <JsonLd data={faqLd(t.faq)} />}
      <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Инструменты', href: '/tools' }, { name: t.title, href: `/tools/${t.slug}` }]} />

        <section className="panel halftone relative grid gap-6 overflow-hidden p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-9">
          <ToolBadge t={t} className="size-24 text-3xl md:size-28" />
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Link href={`/tools?category=${t.category}`} className="chip">
                {labelOf(TOOL_CATEGORIES, t.category)}
              </Link>
              {t.isDemo && <span className="chip !border-dashed">Черновик · на проверке</span>}
              {promoted && <span className="chip !bg-black !text-white">Реклама</span>}
            </div>
            <h1 className="font-display text-[clamp(2rem,1.4rem+2.6vw,3.4rem)] font-black leading-none">{t.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{t.excerpt}</p>
            {promoted && (t.partner?.advertiser || t.partner?.erid) && (
              <p className="mt-2 text-xs text-muted">
                Реклама. {t.partner?.advertiser} {t.partner?.erid ? `erid: ${t.partner.erid}` : ''}
              </p>
            )}
          </div>
          {outUrl && (
            <a
              href={outUrl}
              target="_blank"
              rel={t.partner?.url ? 'sponsored noopener noreferrer' : 'noopener noreferrer nofollow'}
              className="btn btn-yellow self-start px-6 py-3.5 md:self-center"
            >
              Открыть сайт <Icon name="arrow" className="size-4" />
            </a>
          )}
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <RichTextBody data={t.content} />

            {(t.useCases?.length || t.limitations?.length) && (
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {!!t.useCases?.length && (
                  <div className="panel bg-yellow p-5 text-black">
                    <h2 className="mb-3 font-display text-lg font-black uppercase">Для каких задач</h2>
                    <ul className="grid gap-2">
                      {t.useCases.map((u, i) => (
                        <li key={u.id ?? i} className="flex gap-2">
                          <Icon name="check" className="mt-1 size-4 shrink-0" />
                          {u.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!!t.limitations?.length && (
                  <div className="panel p-5">
                    <h2 className="mb-3 font-display text-lg font-black uppercase">О чём помнить</h2>
                    <ul className="grid gap-2">
                      {t.limitations.map((u, i) => (
                        <li key={u.id ?? i} className="flex gap-2">
                          <span className="font-black text-red" aria-hidden>
                            !
                          </span>
                          {u.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <FaqBlock items={t.faq} />
            <SourcesBlock items={t.sources} />
          </div>

          <aside className="grid content-start gap-6">
            <div className="panel overflow-hidden">
              <p className="border-b-[3px] border-line bg-black px-5 py-3 font-display text-sm font-black uppercase text-yellow">Карточка инструмента</p>
              <dl className="divide-y-2 divide-dashed divide-line">
                {facts.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[120px_1fr] gap-3 px-5 py-3 text-[0.95rem]">
                    <dt className="font-bold">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="border-t-2 border-line px-5 py-3 text-xs text-muted">Условия и тарифы меняются — проверяйте на официальном сайте.</p>
            </div>
          </aside>
        </div>

        {battles.docs.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">Сравнения с {t.title}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {battles.docs.map((c, i) => (
                <BattleCard key={c.id} c={c} index={i} />
              ))}
            </div>
          </section>
        )}
        {articles.docs.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">Статьи про {t.title}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {articles.docs.map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          </section>
        )}
        {similar.docs.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">Похожие инструменты</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(similar.docs as Tool[]).map((x) => (
                <ToolCard key={x.id} t={x} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
