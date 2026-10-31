import type { Article } from '@/payload-types'
import { ArticleCard } from './Cards'
import { Pagination } from '../ui/Pagination'

export function PageHero({
  kicker,
  title,
  description,
  color = 'yellow',
  children,
}: {
  kicker?: string
  title: string
  description?: string | null
  color?: string
  children?: React.ReactNode
}) {
  const bg: Record<string, string> = {
    yellow: 'bg-yellow text-black',
    red: 'bg-red text-white',
    blue: 'bg-blue text-white',
    orange: 'bg-orange text-black',
    black: 'bg-black text-white',
  }
  return (
    <section className={`relative overflow-hidden border-b-[3px] border-line ${bg[color] ?? bg.yellow}`}>
      <div className="halftone-strong absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-[1320px] px-4 py-10 md:px-6 md:py-14">
        {children}
        {kicker && (
          <span className="mb-4 inline-block rounded-full border-[3px] border-black bg-white px-4 py-1 font-display text-[0.7rem] font-black uppercase tracking-[0.14em] text-black">
            {kicker}
          </span>
        )}
        <h1 className="max-w-4xl font-display text-[clamp(2rem,1.3rem+3.4vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg font-medium opacity-90">{description}</p>}
      </div>
    </section>
  )
}

export function ArticleGrid({
  docs,
  page,
  totalPages,
  basePath,
  empty = 'Материалы скоро появятся.',
}: {
  docs: Article[]
  page: number
  totalPages: number
  basePath: string
  empty?: string
}) {
  if (!docs.length)
    return <p className="panel halftone mt-10 p-8 text-center font-display text-lg font-bold">{empty}</p>
  const [first, ...rest] = docs
  return (
    <>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {page === 1 ? (
          <div className="md:col-span-2 lg:col-span-3">
            <ArticleCard a={first} variant="hero" priority />
          </div>
        ) : (
          <ArticleCard a={first} />
        )}
        {rest.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} basePath={basePath} />
    </>
  )
}
