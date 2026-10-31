import Link from 'next/link'
import type { Article, Comparison, Tag } from '@/payload-types'
import { Mascot } from '@/components/brand/Mascot'
import { AdSlot } from '@/components/content/AdSlot'
import { ArticleCard, BattleCard, PromptCardSmall, ToolCard } from '@/components/content/Cards'
import { SubscribeForm } from '@/components/forms/Forms'
import { Bubble, SectionHeading, Sticker, accentClass } from '@/components/ui/Comic'
import { Icon } from '@/components/ui/Icon'
import { findArticles, findMany, getHome, getPayloadClient } from '@/lib/payload'
import { TOOL_CATEGORIES } from '@/lib/constants'

export const revalidate = 300

export const metadata = { alternates: { canonical: '/' } }

const isObj = <T,>(x: unknown): x is T => !!x && typeof x === 'object'

export default async function HomePage() {
  const home = await getHome()
  const payload = await getPayloadClient()

  const latest = await findArticles({ limit: 24, depth: 1 })
  const all = latest.docs

  const featured =
    (isObj<Article>(home.featured) ? home.featured : null) ?? all.find((a) => a.featured) ?? all[0] ?? null

  const manualHot = (home.hot ?? []).filter(isObj<Article>)
  const hotPool = manualHot.length ? manualHot : [...all.filter((a) => a.hot), ...all.filter((a) => !a.hot)]
  const hot = hotPool.filter((a) => a.id !== featured?.id).slice(0, 6)

  const manualGuides = (home.guides ?? []).filter(isObj<Article>)
  const guides = manualGuides.length ? manualGuides : all.filter((a) => a.section === 'guides').slice(0, 5)

  const manualBattles = (home.battles ?? []).filter(isObj<Comparison>)
  const battles = manualBattles.length ? manualBattles : (await findMany('comparisons', { limit: 4, sort: '-updatedAt', depth: 1 })).docs

  const hubs = (await payload.find({ collection: 'tags', where: { isHub: { equals: true } }, sort: 'order', limit: 10, depth: 0 })).docs as Tag[]
  const tools = (await findMany('tools', { limit: 8, sort: 'title' })).docs
  const prompts = (await findMany('prompts', { limit: 3, sort: '-updatedAt' })).docs

  const [big, ...rest] = hot
  const tall = rest.slice(0, 2)
  const compact = rest.slice(2, 5)

  return (
    <>
      {/* HERO — обложка комикс-журнала */}
      <section className="relative overflow-hidden border-b-[3px] border-line bg-yellow text-black">
        <div className="halftone-strong absolute inset-0 opacity-60" aria-hidden />
        <div className="rays absolute -right-1/4 -top-1/2 aspect-square w-[130%] animate-spin-slow opacity-70 md:-right-[10%] md:w-[75%]" aria-hidden />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-6 px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative z-[1]">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border-[3px] border-black bg-black px-4 py-1.5 font-display text-[0.68rem] font-black uppercase tracking-[0.16em] text-yellow">
                AI-медиа · выпуск №1
              </span>
              <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.14em]">Читай. Понимай. Создавай.</span>
            </div>
            <h1 className="font-display text-[clamp(2.4rem,1.4rem+5vw,5.4rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
              {(home.heroTitle || 'БУДУЩЕЕ УЖЕ ЗДЕСЬ. ЧИТАЙ!').split('. ').map((part, i, arr) => (
                <span key={i} className="block">
                  {i === arr.length - 1 ? (
                    <span className="relative mt-3 inline-block -rotate-2 bg-black px-3 pb-1 text-yellow shadow-[6px_6px_0_0_#FF3838]">{part}</span>
                  ) : (
                    part + '.'
                  )}
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-xl text-lg font-semibold md:text-xl">{home.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/guides" className="btn px-6 py-3.5 !bg-black !text-white !shadow-[3px_3px_0_0_#111]">
                Начать с гайдов <Icon name="arrow" className="size-4" />
              </Link>
              <Link href="/tools" className="btn btn-paper px-6 py-3.5 !bg-white !text-black">
                Каталог нейросетей
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px]">
            <div className="animate-float">
              <Mascot className="w-full drop-shadow-[8px_8px_0_rgba(17,17,17,0.9)]" />
            </div>
            <Bubble className="absolute left-0 top-[6%] -rotate-6 text-lg md:text-2xl">WOW!</Bubble>
            <Bubble tail="right" className="absolute right-0 top-[2%] rotate-6 text-lg md:text-2xl">
              AI!
            </Bubble>
            <Sticker color="red" rotate={-10} animated className="absolute -left-2 bottom-[30%] size-20 text-base md:size-24 md:text-lg">
              BOOM!
            </Sticker>
            <Sticker color="blue" rotate={8} animated className="absolute -right-2 bottom-[16%] size-24 text-[0.85rem] md:size-28 md:text-base">
              FUTURE!
            </Sticker>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-4 md:px-6">
        {/* Статья дня */}
        {featured && (
          <section aria-label="Главная статья дня" className="-mt-0 pt-10 md:pt-14">
            <ArticleCard a={featured} variant="hero" priority />
          </section>
        )}

        {/* Горячее сегодня */}
        {hot.length > 0 && (
          <section className="pt-16 md:pt-20" aria-labelledby="hot">
            <div id="hot">
              <SectionHeading kicker="🔥 Горячее" title="Горячее сегодня" href="/articles" color="red" />
            </div>
            <div className="grid gap-6 lg:grid-cols-12">
              {big && (
                <div className="lg:col-span-6">
                  <ArticleCard a={big} variant="big" />
                </div>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-6">
                {tall.map((a) => (
                  <ArticleCard key={a.id} a={a} variant="tall" />
                ))}
              </div>
              {compact.length > 0 && (
                <div className="grid gap-4 md:grid-cols-3 lg:col-span-12">
                  {compact.map((a) => (
                    <ArticleCard key={a.id} a={a} variant="compact" />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <AdSlot placement="home" className="mt-14" />

        {/* Разбираемся в AI */}
        {hubs.length > 0 && (
          <section className="pt-16 md:pt-20" aria-labelledby="hubs">
            <div id="hubs">
              <SectionHeading kicker="Темы" title="Разбираемся в AI" color="blue" />
            </div>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {hubs.map((t, i) => (
                <li key={t.id}>
                  <Link
                    href={`/tag/${t.slug}`}
                    className="panel panel-hover group flex h-full flex-col items-center gap-3 px-3 py-5 text-center"
                    style={{ rotate: `${i % 2 ? 1 : -1}deg` }}
                  >
                    <span className={`grid size-16 place-items-center rounded-full border-[3px] border-black transition group-hover:rotate-12 group-hover:scale-110 ${accentClass(t.color)}`}>
                      <Icon name={t.icon ?? 'spark'} className="size-8" />
                    </span>
                    <span className="font-display text-[0.86rem] font-black leading-tight">{t.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Гайды */}
        {guides.length > 0 && (
          <section className="pt-16 md:pt-20" aria-labelledby="guides">
            <div id="guides">
              <SectionHeading kicker="Учимся" title="Гайды" href="/guides" hrefLabel="Все гайды" />
            </div>
            <ol className={`grid gap-4 md:grid-cols-2 ${({ 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' } as Record<number, string>)[guides.length] ?? 'lg:grid-cols-4'}`}>
              {guides.map((g, i) => (
                <li key={g.id}>
                  <Link href={`/${g.section}/${g.slug}`} className="panel panel-hover group flex h-full flex-col gap-4 p-5">
                    <span className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-full border-[3px] border-line bg-yellow font-display text-lg font-black text-black transition group-hover:-rotate-12">
                        {i + 1}
                      </span>
                      <Icon name="arrow" className="size-5 transition group-hover:translate-x-1" />
                    </span>
                    <span className="font-display text-[1.02rem] font-extrabold leading-snug">{g.title}</span>
                    {g.readingTime ? <span className="mt-auto text-xs font-semibold text-muted">{g.readingTime} мин чтения</span> : null}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {/* Битва нейросетей */}
      {battles.length > 0 && (
        <section className="relative mt-20 overflow-hidden bg-black py-16 text-white md:py-20" aria-labelledby="battle">
          <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#fff_1.4px,transparent_1.8px)] [background-size:11px_11px]" aria-hidden />
          <div className="relative mx-auto max-w-[1320px] px-4 md:px-6 [--ink:#f4f1e8] [--line:#111]">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="caption mb-3 text-xs">Арена</span>
                <h2 id="battle" className="section-title">
                  Битва <span className="text-yellow">нейросетей</span>
                </h2>
                <p className="mt-3 max-w-xl text-white/75">Честные сравнения по проверяемым критериям — без выдуманных «тестов» и рейтингов с потолка.</p>
              </div>
              <Link href="/compare" className="btn btn-yellow text-xs">
                Все битвы →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {battles.map((c, i) => (
                <BattleCard key={c.id} c={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1320px] px-4 md:px-6">
        {/* Каталог AI-инструментов */}
        {tools.length > 0 && (
          <section className="pt-16 md:pt-20" aria-labelledby="tools">
            <div id="tools">
              <SectionHeading kicker="Каталог" title="AI-инструменты" href="/tools" hrefLabel="Весь каталог" color="orange" />
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {TOOL_CATEGORIES.map((c) => (
                <Link key={c.value} href={`/tools?category=${c.value}`} className="chip">
                  {c.label}
                </Link>
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map((t) => (
                <ToolCard key={t.id} t={t} />
              ))}
            </div>
          </section>
        )}

        {/* Промпты */}
        {prompts.length > 0 && (
          <section className="pt-16 md:pt-20" aria-labelledby="prompts">
            <div id="prompts">
              <SectionHeading kicker="Копируй и пользуйся" title="Промпты недели" href="/prompts" hrefLabel="Библиотека" color="blue" />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {prompts.map((p) => (
                <PromptCardSmall key={p.id} p={p} />
              ))}
            </div>
          </section>
        )}

        {/* Подписка + лидогенерация */}
        <section className="grid gap-6 pt-16 md:pt-20 lg:grid-cols-[1.4fr_1fr]">
          <div className="panel relative overflow-hidden bg-blue p-6 text-white md:p-10">
            <div className="halftone-strong absolute inset-0 opacity-30" aria-hidden />
            <div className="relative [--ink:#111] [--line:#111] [--panel:#fff] [--muted:#e8ecff]">
              <Sticker color="yellow" rotate={12} className="absolute -right-2 -top-4 size-20 text-sm md:right-0">
                NEW!
              </Sticker>
              <h2 className="section-title max-w-lg">Главное об AI — раз в неделю</h2>
              <p className="mb-6 mt-3 max-w-lg text-white/85">Короткая рассылка: что вышло, что из этого реально полезно и как попробовать за 10 минут.</p>
              <div className="max-w-xl">
                <SubscribeForm source="home" />
              </div>
            </div>
          </div>
          <Link href="/automation" className="panel panel-hover group relative flex flex-col justify-between gap-6 overflow-hidden p-6 md:p-8">
            <div>
              <span className="caption mb-4 text-xs">BONGO GROUP</span>
              <h2 className="font-display text-2xl font-black uppercase leading-tight">Внедрим AI в ваш бизнес</h2>
              <p className="mt-3 text-muted">Чат-боты, ассистенты, автоматизация заявок и документов. Оставьте задачу — команда BONGO GROUP предложит решение.</p>
            </div>
            <span className="btn btn-ink self-start">
              Оставить заявку <Icon name="arrow" className="size-4" />
            </span>
          </Link>
        </section>
      </div>
    </>
  )
}
