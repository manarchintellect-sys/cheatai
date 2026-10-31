import Image from 'next/image'
import Link from 'next/link'
import type { Article, Category, Comparison, Prompt, Tool } from '@/payload-types'
import { articlePath, fmtDate, imgUrl, mediaOf } from '@/lib/payload'
import { SECTIONS, TOOL_PRICING, PROMPT_CATEGORIES, TOOL_CATEGORIES, labelOf } from '@/lib/constants'
import { accentClass, Sticker } from '../ui/Comic'
import { Icon } from '../ui/Icon'

const catOf = (a: Article) => (a.category && typeof a.category === 'object' ? (a.category as Category) : null)

function Cover({ a, size, className, priority }: { a: Article; size: 'thumb' | 'card' | 'og'; className?: string; priority?: boolean }) {
  const media = mediaOf(a.cover)
  const url = imgUrl(a.cover, size)
  const cat = catOf(a)
  if (!url || !media)
    return (
      <div className={`halftone-strong grid place-items-center ${accentClass(cat?.color)} ${className}`}>
        <Icon name={cat?.icon ?? 'spark'} className="size-16" />
      </div>
    )
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={url}
        alt={media.alt || a.title}
        fill
        priority={priority}
        sizes={size === 'og' ? '(min-width:1024px) 760px, 100vw' : '(min-width:1024px) 420px, (min-width:640px) 50vw, 100vw'}
        className="object-cover transition duration-500 group-hover:scale-[1.04]"
      />
    </div>
  )
}

function Meta({ a, light = false }: { a: Article; light?: boolean }) {
  const cat = catOf(a)
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
      <span className={`chip !border-black ${accentClass(cat?.color ?? SECTIONS[a.section].color)}`}>{cat?.title ?? SECTIONS[a.section].short}</span>
      {a.readingTime ? (
        <span className={`inline-flex items-center gap-1 ${light ? 'text-white/80' : 'text-muted'}`}>
          <Icon name="clock" className="size-3.5" />
          {a.readingTime} мин
        </span>
      ) : null}
      {a.publishedAt && <span className={light ? 'text-white/80' : 'text-muted'}>{fmtDate(a.publishedAt)}</span>}
      {a.isDemo && <span className="chip !border-dashed !bg-transparent !text-[0.6rem]">черновик</span>}
    </div>
  )
}

export function ArticleCard({ a, variant = 'default', priority = false }: { a: Article; variant?: 'hero' | 'big' | 'tall' | 'compact' | 'default'; priority?: boolean }) {
  const href = articlePath(a)
  if (variant === 'hero') {
    return (
      <article className="panel panel-hover group relative grid overflow-hidden md:grid-cols-[1.25fr_1fr]">
        <Cover a={a} size="og" priority={priority} className="aspect-[1200/630] border-b-[3px] border-line md:aspect-auto md:min-h-[380px] md:border-b-0 md:border-r-[3px]" />
        <div className="relative flex flex-col justify-center gap-4 p-6 md:p-9">
          <span className="caption absolute -top-4 right-6 z-[2] text-xs">Статья дня</span>
          <Meta a={a} />
          <h3 className="font-display text-2xl font-black leading-[1.08] md:text-[2.1rem]">
            <Link href={href} className="after:absolute after:inset-0">
              {a.title}
            </Link>
          </h3>
          <p className="text-[1.05rem] text-muted">{a.excerpt}</p>
          <span className="btn btn-ink relative z-[1] self-start text-xs">
            Читать <Icon name="arrow" className="size-4" />
          </span>
        </div>
      </article>
    )
  }
  if (variant === 'big') {
    return (
      <article className="panel panel-hover group relative flex h-full flex-col overflow-hidden">
        <Cover a={a} size="og" priority={priority} className="aspect-[1200/630] border-b-[3px] border-line" />
        <div className="flex flex-1 flex-col gap-3 p-5 md:p-7">
          <Meta a={a} />
          <h3 className="font-display text-xl font-black leading-tight md:text-[1.7rem]">
            <Link href={href} className="after:absolute after:inset-0">
              {a.title}
            </Link>
          </h3>
          <p className="line-clamp-3 text-muted">{a.excerpt}</p>
        </div>
        <Sticker color="red" rotate={10} className="absolute right-3 top-3 size-16 text-sm">
          HOT!
        </Sticker>
      </article>
    )
  }
  if (variant === 'tall') {
    return (
      <article className="panel panel-hover group relative flex h-full flex-col overflow-hidden">
        <Cover a={a} size="card" className="aspect-[4/3] border-b-[3px] border-line" />
        <div className="flex flex-1 flex-col gap-3 p-5">
          <Meta a={a} />
          <h3 className="font-display text-lg font-extrabold leading-snug">
            <Link href={href} className="after:absolute after:inset-0">
              {a.title}
            </Link>
          </h3>
          <p className="line-clamp-3 text-[0.95rem] text-muted">{a.excerpt}</p>
        </div>
      </article>
    )
  }
  if (variant === 'compact') {
    return (
      <article className="panel panel-hover group relative flex gap-4 overflow-hidden p-3">
        <Cover a={a} size="thumb" className="aspect-square w-24 shrink-0 rounded-xl border-[3px] border-line sm:w-28" />
        <div className="flex min-w-0 flex-col justify-center gap-2 py-1 pr-1">
          <Meta a={a} />
          <h3 className="line-clamp-3 font-display text-[0.98rem] font-extrabold leading-snug">
            <Link href={href} className="after:absolute after:inset-0">
              {a.title}
            </Link>
          </h3>
        </div>
      </article>
    )
  }
  return (
    <article className="panel panel-hover group relative flex h-full flex-col overflow-hidden">
      <Cover a={a} size="card" className="aspect-[1200/630] border-b-[3px] border-line" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Meta a={a} />
        <h3 className="font-display text-lg font-extrabold leading-snug">
          <Link href={href} className="after:absolute after:inset-0">
            {a.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[0.95rem] text-muted">{a.excerpt}</p>
      </div>
    </article>
  )
}

export function ToolBadge({ t, className = 'size-14 text-lg' }: { t: Pick<Tool, 'title' | 'monogram' | 'color' | 'logo'>; className?: string }) {
  const logo = imgUrl(t.logo, 'thumb')
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-2xl border-[3px] border-black font-display font-black ${accentClass(t.color)} ${className}`} aria-hidden>
      {logo ? <Image src={logo} alt="" width={64} height={64} className="size-full object-cover" /> : <span className={(t.monogram || '').length > 2 ? 'text-[0.78em]' : ''}>{(t.monogram || t.title.slice(0, 2)).toUpperCase()}</span>}
    </span>
  )
}

export function ToolCard({ t }: { t: Tool }) {
  return (
    <article className="panel panel-hover group relative flex h-full flex-col gap-4 p-5">
      <div className="flex items-center gap-4">
        <ToolBadge t={t} />
        <div className="min-w-0">
          <h3 className="font-display text-lg font-black leading-tight">
            <Link href={`/tools/${t.slug}`} className="after:absolute after:inset-0">
              {t.title}
            </Link>
          </h3>
          {t.developer && <p className="text-sm text-muted">{t.developer}</p>}
        </div>
        {t.partner?.promoted && <span className="chip ml-auto !text-[0.6rem]">Реклама</span>}
      </div>
      <p className="line-clamp-3 flex-1 text-[0.95rem] text-muted">{t.excerpt}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="chip !text-[0.65rem]">{labelOf(TOOL_CATEGORIES, t.category)}</span>
        <span className="chip !text-[0.65rem]">{labelOf(TOOL_PRICING, t.pricing)}</span>
        {t.isDemo && <span className="chip !border-dashed !text-[0.6rem]">черновик</span>}
      </div>
    </article>
  )
}

export function BattleCard({ c, index = 0 }: { c: Comparison; index?: number }) {
  const a = typeof c.toolA === 'object' ? (c.toolA as Tool) : null
  const b = typeof c.toolB === 'object' ? (c.toolB as Tool) : null
  const bgs = ['bg-yellow', 'bg-blue', 'bg-red', 'bg-orange']
  const Side = ({ t }: { t: Tool | null }) =>
    t ? (
      <div className="flex min-w-0 flex-col items-center gap-2 text-center">
        <ToolBadge t={t} className="size-14 text-base" />
        <span className="max-w-full break-words rounded-2xl border-[3px] border-black bg-white px-2 py-0.5 font-display text-[0.72rem] font-black leading-tight">{t.title}</span>
      </div>
    ) : null
  return (
    <article className={`panel panel-hover group relative flex h-full flex-col overflow-hidden ${bgs[index % 4]} text-black`}>
      <div className="halftone-strong grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 px-3 py-6">
        <Side t={a} />
        <span className="relative grid size-14 place-items-center transition group-hover:rotate-6 group-hover:scale-110">
          <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
            <polygon points="50,0 62,30 98,22 72,50 98,78 62,70 50,100 38,70 2,78 28,50 2,22 38,30" fill="#111" />
          </svg>
          <span className="relative font-display text-base font-black italic text-yellow">VS</span>
        </span>
        <Side t={b} />
      </div>
      <div className="flex-1 border-t-[3px] border-black bg-white p-4 dark:bg-[#1b1b1b] dark:text-white">
        <h3 className="font-display text-[0.98rem] font-extrabold leading-snug">
          <Link href={`/compare/${c.slug}`} className="after:absolute after:inset-0">
            {c.title}
          </Link>
        </h3>
      </div>
    </article>
  )
}

export function PromptCardSmall({ p }: { p: Prompt }) {
  return (
    <article className="panel panel-hover group relative flex h-full flex-col gap-3 p-5">
      <span className="chip self-start !text-[0.65rem]">{labelOf(PROMPT_CATEGORIES, p.category)}</span>
      <h3 className="font-display text-lg font-black leading-tight">
        <Link href={`/prompts/${p.slug}`} className="after:absolute after:inset-0">
          {p.title}
        </Link>
      </h3>
      <p className="line-clamp-2 text-[0.95rem] text-muted">{p.excerpt}</p>
      <pre className="halftone mt-auto whitespace-pre-wrap break-words rounded-xl border-2 border-dashed border-line p-3 font-mono text-xs leading-relaxed text-muted">{p.prompt.length > 150 ? p.prompt.slice(0, 150).trimEnd() + "…" : p.prompt}</pre>
    </article>
  )
}
