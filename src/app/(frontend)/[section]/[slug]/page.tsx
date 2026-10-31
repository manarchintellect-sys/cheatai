import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Article, Author, Category, Tag, Tool } from '@/payload-types'
import { AdSlot } from '@/components/content/AdSlot'
import { ArticleCard, ToolCard } from '@/components/content/Cards'
import { FaqBlock, SourcesBlock } from '@/components/content/Extras'
import { RichTextBody } from '@/components/content/RichText'
import { ReadingProgress, ShareLink, Toc } from '@/components/content/Toc'
import { SubscribeForm } from '@/components/forms/Forms'
import { JsonLd, faqLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { accentClass } from '@/components/ui/Comic'
import { Icon } from '@/components/ui/Icon'
import { SECTIONS, type SectionKey } from '@/lib/constants'
import { extractHeadings } from '@/lib/lexical'
import { SITE_URL, absUrl, articlePath, findArticles, findOne, findRedirect, fmtDate, imgUrl, mediaOf } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
export const dynamicParams = true

type Props = { params: Promise<{ section: string; slug: string }> }

export async function generateStaticParams() {
  try {
    const res = await findArticles({ limit: 200, depth: 0 })
    return res.docs.map((a) => ({ section: a.section, slug: a.slug! }))
  } catch {
    return []
  }
}

async function load(section: string, slug: string) {
  if (!(section in SECTIONS)) return null
  return findOne('articles', slug, { section: { equals: section } })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params
  const a = await load(section, slug)
  if (!a) return {}
  return buildMeta(a, articlePath(a), { type: 'article' })
}

const obj = <T,>(x: unknown): x is T => !!x && typeof x === 'object'

export default async function ArticlePage({ params }: Props) {
  const { section, slug } = await params
  const a = await load(section, slug)
  if (!a) {
    const to = await findRedirect(`/${section}/${slug}`)
    if (to) permanentRedirect(to)
    notFound()
  }
  const sec = SECTIONS[a.section as SectionKey]
  const cat = obj<Category>(a.category) ? a.category : null
  const tags = (a.tags ?? []).filter(obj<Tag>)
  const authors = (a.authors ?? []).filter(obj<Author>)
  const tools = (a.tools ?? []).filter(obj<Tool>)
  const headings = extractHeadings(a.content)
  const cover = mediaOf(a.cover)
  const coverUrl = imgUrl(a.cover, 'og')

  let related = (a.related ?? []).filter(obj<Article>)
  if (related.length < 3) {
    const more = await findArticles({
      where: {
        and: [{ id: { not_equals: a.id } }, cat ? { category: { equals: cat.id } } : { section: { equals: a.section } }],
      },
      limit: 3,
    })
    related = [...related, ...more.docs.filter((d) => !related.some((r) => r.id === d.id))].slice(0, 3)
  }

  const url = `${SITE_URL}${articlePath(a)}`
  const ld = {
    '@context': 'https://schema.org',
    '@type': a.section === 'news' ? 'NewsArticle' : 'BlogPosting',
    headline: a.title,
    description: a.excerpt,
    image: coverUrl ? [absUrl(coverUrl)] : undefined,
    datePublished: a.publishedAt ?? undefined,
    dateModified: a.publishedAt ? a.updatedAt : undefined,
    inLanguage: 'ru-RU',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: authors.length
      ? authors.map((au) => ({ '@type': 'Person', name: au.name, url: `${SITE_URL}/author/${au.slug}` }))
      : { '@type': 'Organization', name: 'Редакция CHEATAI', url: `${SITE_URL}/editorial` },
    publisher: { '@id': `${SITE_URL}/#org` },
    articleSection: sec.label,
    keywords: tags.map((t) => t.title).join(', ') || undefined,
    timeRequired: a.readingTime ? `PT${a.readingTime}M` : undefined,
  }

  return (
    <>
      <ReadingProgress />
      <JsonLd data={ld} />
      {faqLd(a.faq) && <JsonLd data={faqLd(a.faq)} />}

      <article className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: sec.label, href: sec.path }, { name: a.title, href: articlePath(a) }]} />

        <header className="mx-auto max-w-[920px] text-left lg:text-center">
          <div className="mb-5 flex flex-wrap items-center gap-2 lg:justify-center">
            <Link href={sec.path} className={`chip !border-black ${accentClass(sec.color)}`}>
              {sec.label}
            </Link>
            {cat && (
              <Link href={`/category/${cat.slug}`} className="chip">
                {cat.title}
              </Link>
            )}
            {a.sponsored?.enabled && <span className="chip !bg-black !text-white">Партнёрский материал</span>}
            {a.isDemo && <span className="chip !border-dashed">Черновик · на проверке редакции</span>}
          </div>
          <h1 className="font-display text-[clamp(1.9rem,1.2rem+3vw,3.4rem)] font-black leading-[1.04] tracking-[-0.02em]">{a.title}</h1>
          <p className="mt-5 text-lg text-muted md:text-xl">{a.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm lg:justify-center">
            <span className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full border-[3px] border-line bg-yellow font-display text-xs font-black text-black" aria-hidden>
                {(authors[0]?.name ?? 'Р').slice(0, 1)}
              </span>
              {authors.length ? (
                authors.map((au) => (
                  <Link key={au.id} href={`/author/${au.slug}`} className="font-bold hover:underline">
                    {au.name}
                  </Link>
                ))
              ) : (
                <Link href="/editorial" className="font-bold hover:underline">
                  Редакция CHEATAI
                </Link>
              )}
            </span>
            {a.publishedAt ? (
              <span>
                Опубликовано: <time dateTime={a.publishedAt}>{fmtDate(a.publishedAt)}</time>
              </span>
            ) : (
              <span className="text-muted">Ещё не опубликовано</span>
            )}
            {a.publishedAt && a.updatedAt && fmtDate(a.updatedAt) !== fmtDate(a.publishedAt) && (
              <span>
                Обновлено: <time dateTime={a.updatedAt}>{fmtDate(a.updatedAt)}</time>
              </span>
            )}
            {a.readingTime ? (
              <span className="inline-flex items-center gap-1">
                <Icon name="clock" className="size-4" /> {a.readingTime} мин чтения
              </span>
            ) : null}
          </div>
          {a.sponsored?.enabled && (a.sponsored.advertiser || a.sponsored.erid) && (
            <p className="mt-3 text-xs text-muted">
              Реклама. {a.sponsored.advertiser}
              {a.sponsored.erid ? ` erid: ${a.sponsored.erid}` : ''}
            </p>
          )}
        </header>

        {coverUrl && cover && (
          <figure className="mx-auto mt-8 max-w-[1100px]">
            <div className="panel relative aspect-[1200/630] overflow-hidden">
              <Image src={coverUrl} alt={cover.alt || a.title} fill priority sizes="(min-width:1100px) 1100px, 100vw" className="object-cover" />
            </div>
            {cover.credit && <figcaption className="mt-2 text-right text-xs text-muted">{cover.credit}</figcaption>}
          </figure>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,760px)_1fr]">
          <aside className="max-lg:order-first">
            {headings.length > 0 && (
              <>
                <details className="panel p-4 lg:hidden">
                  <summary className="cursor-pointer font-display text-sm font-black uppercase">Содержание</summary>
                  <div className="mt-3">
                    <Toc headings={headings} />
                  </div>
                </details>
                <nav aria-label="Содержание статьи" className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto pb-4 lg:block">
                  <p className="caption mb-4 text-xs">Содержание</p>
                  <Toc headings={headings} />
                  <AdSlot placement="article-sidebar" className="mt-6" />
                </nav>
              </>
            )}
          </aside>

          <div id="article-body" className="min-w-0">
            <RichTextBody data={a.content} />
            <AdSlot placement="article-inline" className="my-10" />

            {tools.length > 0 && (
              <section className="mt-14" aria-labelledby="tools-in">
                <h2 id="tools-in" className="mb-5 font-display text-lg font-black uppercase">
                  Инструменты из статьи
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {tools.map((t) => (
                    <ToolCard key={t.id} t={t} />
                  ))}
                </div>
              </section>
            )}

            <FaqBlock items={a.faq} />
            <SourcesBlock items={a.sources} />

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y-[3px] border-line py-5">
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link key={t.id} href={`/tag/${t.slug}`} className="chip">
                    #{t.title}
                  </Link>
                ))}
              </div>
              <ShareLink />
            </div>

            <div className="panel mt-10 bg-yellow p-6 text-black [--ink:#111] [--line:#111] [--panel:#fff] [--muted:#333]">
              <p className="font-display text-xl font-black uppercase">Понравилось? Читай дальше!</p>
              <p className="mb-4 mt-1">Раз в неделю присылаем лучшие разборы и промпты.</p>
              <SubscribeForm source={`article:${a.slug}`} />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-[1320px] px-4 md:px-6" aria-labelledby="related">
          <h2 id="related" className="section-title mb-8">
            Похожие материалы
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.id} a={r} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
