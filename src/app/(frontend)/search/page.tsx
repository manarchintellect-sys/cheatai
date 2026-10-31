import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/content/Listing'
import { Icon } from '@/components/ui/Icon'
import { search, type SearchType } from '@/lib/search'

// Технические страницы поиска не индексируем
export const metadata: Metadata = { title: 'Поиск', robots: { index: false, follow: true } }

type Props = { searchParams: Promise<{ q?: string; type?: string }> }

const TYPES: { value: SearchType; label: string }[] = [
  { value: 'all', label: 'Всё' },
  { value: 'articles', label: 'Статьи' },
  { value: 'tools', label: 'Инструменты' },
  { value: 'prompts', label: 'Промпты' },
  { value: 'comparisons', label: 'Сравнения' },
]
const LABEL: Record<string, string> = { articles: 'Статья', tools: 'Инструмент', prompts: 'Промпт', comparisons: 'Сравнение' }

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const q = (sp.q ?? '').trim().slice(0, 100)
  const type = (TYPES.find((t) => t.value === sp.type)?.value ?? 'all') as SearchType
  const hits = q ? await search(q, type, 40) : []
  return (
    <>
      <PageHero kicker="Поиск" title={q ? `«${q}»` : 'Поиск по CHEATAI'} color="yellow">
        <form action="/search" role="search" className="mb-8 flex max-w-2xl gap-2">
          <label htmlFor="q" className="sr-only">Запрос</label>
          <div className="flex flex-1 items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 text-black">
            <Icon name="search" />
            <input id="q" name="q" defaultValue={q} placeholder="Например: промпт для резюме" className="h-12 min-w-0 flex-1 bg-transparent text-lg outline-none" enterKeyHint="search" />
          </div>
          {type !== 'all' && <input type="hidden" name="type" value={type} />}
          <button className="btn btn-ink h-[54px]">Найти</button>
        </form>
      </PageHero>
      <div className="mx-auto max-w-[1000px] px-4 pt-8 md:px-6">
        {q && (
          <div className="mb-6 flex flex-wrap gap-2" aria-label="Тип материалов">
            {TYPES.map((t) => (
              <Link key={t.value} href={`/search?q=${encodeURIComponent(q)}${t.value !== 'all' ? `&type=${t.value}` : ''}`} className="chip" aria-current={type === t.value ? 'true' : undefined} rel="nofollow">
                {t.label}
              </Link>
            ))}
          </div>
        )}
        {q && <p className="mb-4 text-muted">Найдено: {hits.length}</p>}
        <ul className="grid gap-3">
          {hits.map((h) => (
            <li key={h.href}>
              <Link href={h.href} className="panel panel-hover flex items-start gap-4 p-4 md:p-5">
                <span className="chip mt-0.5 shrink-0 !text-[0.65rem]">{LABEL[h.type]}</span>
                <span>
                  <span className="block font-display text-lg font-extrabold leading-snug">{h.title}</span>
                  {h.excerpt && <span className="mt-1 line-clamp-2 block text-muted">{h.excerpt}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {q && !hits.length && (
          <div className="panel halftone p-8 text-center">
            <p className="font-display text-xl font-black">Ничего не нашлось</p>
            <p className="mt-2 text-muted">Попробуйте другое слово или загляните в <Link href="/guides" className="underline">гайды</Link> и <Link href="/tools" className="underline">каталог</Link>.</p>
          </div>
        )}
      </div>
    </>
  )
}
