import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Tool } from '@/payload-types'
import { PromptCardSmall, ToolBadge } from '@/components/content/Cards'
import { PromptCard, RichTextBody } from '@/components/content/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PROMPT_CATEGORIES, labelOf } from '@/lib/constants'
import { SITE_URL, findMany, findOne, findRedirect } from '@/lib/payload'
import { buildMeta } from '@/lib/seo'

export const revalidate = 300
type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  try {
    return (await findMany('prompts', { limit: 300, depth: 0 })).docs.map((p) => ({ slug: p.slug! }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await findOne('prompts', (await params).slug)
  if (!p) return {}
  return buildMeta({ ...p, title: p.meta?.title || `Промпт: ${p.title}` }, `/prompts/${p.slug}`)
}

export default async function PromptPage({ params }: Props) {
  const { slug } = await params
  const p = await findOne('prompts', slug)
  if (!p) {
    const to = await findRedirect(`/prompts/${slug}`)
    if (to) permanentRedirect(to)
    notFound()
  }
  const tools = (p.tools ?? []).filter((t): t is Tool => typeof t === 'object')
  const more = await findMany('prompts', { where: { and: [{ category: { equals: p.category } }, { id: { not_equals: p.id } }] }, limit: 3 })

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: p.title,
          description: p.excerpt,
          text: p.prompt,
          url: `${SITE_URL}/prompts/${p.slug}`,
          inLanguage: 'ru-RU',
          publisher: { '@id': `${SITE_URL}/#org` },
        }}
      />
      <div className="mx-auto max-w-[900px] px-4 pt-6 md:px-6">
        <Breadcrumbs items={[{ name: 'Промпты', href: '/prompts' }, { name: p.title, href: `/prompts/${p.slug}` }]} />
        <div className="mb-4 flex flex-wrap gap-2">
          <Link href={`/prompts?category=${p.category}`} className="chip">
            {labelOf(PROMPT_CATEGORIES, p.category)}
          </Link>
          {p.isDemo && <span className="chip !border-dashed">Черновик · на проверке</span>}
        </div>
        <h1 className="font-display text-[clamp(1.8rem,1.2rem+2.4vw,3rem)] font-black leading-tight">{p.title}</h1>
        <p className="mt-4 text-lg text-muted">{p.excerpt}</p>

        <PromptCard title="Промпт целиком" prompt={p.prompt} note="Скопируйте, замените текст в [квадратных скобках] на свой и отправьте нейросети." />

        {!!p.variables?.length && (
          <section className="panel p-5 md:p-6" aria-labelledby="vars">
            <h2 id="vars" className="mb-4 font-display text-lg font-black uppercase">Что подставить</h2>
            <dl className="grid gap-3">
              {p.variables.map((v, i) => (
                <div key={v.id ?? i} className="grid gap-1 sm:grid-cols-[220px_1fr]">
                  <dt>
                    <code className="rounded-lg border-2 border-line bg-yellow px-2 py-0.5 font-mono text-sm text-black">{v.name}</code>
                  </dt>
                  <dd className="text-muted">{v.hint}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-10">
          <RichTextBody data={p.content} />
        </div>

        {tools.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-lg font-black uppercase">Где пробовать</h2>
            <div className="flex flex-wrap gap-3">
              {tools.map((t) => (
                <Link key={t.id} href={`/tools/${t.slug}`} className="panel panel-hover flex items-center gap-3 py-2 pl-2 pr-5">
                  <ToolBadge t={t} className="size-10 text-sm" />
                  <span className="font-display font-black">{t.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      {more.docs.length > 0 && (
        <section className="mx-auto mt-16 max-w-[1320px] px-4 md:px-6">
          <h2 className="section-title mb-6">Ещё промпты</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {more.docs.map((x) => (
              <PromptCardSmall key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
