/**
 * Демо-наполнение CHEATAI.
 * Запуск: npm run seed (или автоматически при первом старте, если SEED_IF_EMPTY=true)
 * Все материалы создаются ЧЕРНОВИКАМИ с флажком «Демо» — до редакционной проверки.
 */
import crypto from 'node:crypto'
import type { Payload } from 'payload'
import { coverPng } from './covers'
import { articles1 } from './data/articles-1'
import { articles2 } from './data/articles-2'
import { articles3 } from './data/articles-3'
import { comparisons, prompts, toolDoc, tools } from './data/catalog'
import { pages } from './data/pages'
import { doc } from './lexical'

const ctx = { skipRevalidate: true }

const CATEGORIES = [
  { title: 'Языковые модели', slug: 'llm', color: 'blue', icon: 'brain', description: 'Как устроены и как работают ChatGPT, Claude, GigaChat и другие большие языковые модели.' },
  { title: 'Генерация изображений', slug: 'images', color: 'red', icon: 'image', description: 'Нейросети, которые рисуют: принципы работы, запросы, права на изображения.' },
  { title: 'Генерация видео', slug: 'video', color: 'black', icon: 'video', description: 'Видео по тексту и картинке: возможности, ограничения и сценарии применения.' },
  { title: 'Автоматизация', slug: 'automation', color: 'orange', icon: 'gear', description: 'AI-боты, ассистенты и автоматизация бизнес-процессов.' },
  { title: 'Промпт-инжиниринг', slug: 'prompting', color: 'yellow', icon: 'chat', description: 'Как формулировать запросы к нейросетям, чтобы получать предсказуемый результат.' },
  { title: 'Безопасность и этика', slug: 'safety', color: 'red', icon: 'shield', description: 'Персональные данные, риски и ответственное использование искусственного интеллекта.' },
] as const

const TAGS = [
  { title: 'ChatGPT', slug: 'chatgpt', icon: 'chat', color: 'black', isHub: true, order: 1, description: 'Всё о ChatGPT: как пользоваться, промпты, сравнения с другими ассистентами.' },
  { title: 'Claude', slug: 'claude', icon: 'spark', color: 'orange', isHub: true, order: 2, description: 'Материалы об ассистенте Claude от Anthropic: возможности, сценарии, сравнения.' },
  { title: 'Gemini', slug: 'gemini', icon: 'star', color: 'blue', isHub: true, order: 3, description: 'Ассистент и модели Google Gemini: что умеют и кому подходят.' },
  { title: 'DeepSeek', slug: 'deepseek', icon: 'search', color: 'blue', isHub: true, order: 4, description: 'Модели DeepSeek: чат, API и открытые веса.' },
  { title: 'Генерация изображений', slug: 'generatsiya-izobrazheniy', icon: 'image', color: 'red', isHub: true, order: 5, description: 'Midjourney, FLUX, Stable Diffusion и другие генераторы картинок.' },
  { title: 'Генерация видео', slug: 'generatsiya-video', icon: 'video', color: 'yellow', isHub: true, order: 6, description: 'Нейросети для создания и редактирования видео.' },
  { title: 'AI-автоматизация', slug: 'ai-avtomatizatsiya', icon: 'gear', color: 'orange', isHub: true, order: 7, description: 'Боты, ассистенты и автоматизация процессов с помощью AI.' },
  { title: 'GigaChat', slug: 'gigachat', icon: 'chat', color: 'black', isHub: false, order: 8 },
  { title: 'YandexGPT', slug: 'yandexgpt', icon: 'chat', color: 'red', isHub: false, order: 9 },
  { title: 'Новичкам', slug: 'novichkam', icon: 'rocket', color: 'yellow', isHub: false, order: 10, description: 'С чего начать знакомство с нейросетями.' },
  { title: 'Промпты', slug: 'prompty', icon: 'chat', color: 'blue', isHub: false, order: 11 },
  { title: 'Безопасность', slug: 'bezopasnost', icon: 'shield', color: 'red', isHub: false, order: 12 },
] as const

export async function seed(payload: Payload) {
  const log = (m: string) => payload.logger.info(`[seed] ${m}`)

  // 1. Очистка демо-коллекций (идемпотентный сид)
  for (const c of ['articles', 'comparisons', 'prompts', 'tools', 'pages', 'tags', 'categories', 'authors', 'media'] as const) {
    await payload.delete({ collection: c, where: { id: { exists: true } }, overrideAccess: true, context: ctx })
  }
  log('коллекции очищены')

  // 2. Администратор
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@cheatai.ru'
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (!existing.docs.length) {
    const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password, name: 'Администратор', role: 'admin' }, overrideAccess: true })
    log(`создан администратор ${email} / пароль: ${password}  ← смените после входа`)
  }

  // 3. Таксономия и авторы
  const cat: Record<string, number> = {}
  for (const [i, c] of CATEGORIES.entries()) {
    const d = await payload.create({ collection: 'categories', data: { ...c, order: i }, context: ctx })
    cat[c.slug] = d.id
  }
  const tag: Record<string, number> = {}
  for (const t of TAGS) {
    const d = await payload.create({ collection: 'tags', data: { ...t }, context: ctx })
    tag[t.slug] = d.id
  }
  const author = await payload.create({
    collection: 'authors',
    data: {
      name: 'Редакция CHEATAI',
      slug: 'redaktsiya',
      position: 'Редакция',
      bio: 'Пишем об искусственном интеллекте простым языком. Проверяем факты и указываем источники.',
    },
    context: ctx,
  })
  log('категории, теги и автор созданы')

  // 4. Инструменты
  const tool: Record<string, number> = {}
  for (const t of tools) {
    const d = await payload.create({
      collection: 'tools',
      draft: true,
      context: ctx,
      data: {
        _status: 'draft',
        isDemo: true,
        title: t.title,
        slug: t.slug,
        monogram: t.monogram,
        color: t.color,
        developer: t.developer,
        website: t.website,
        category: t.category as never,
        tasks: t.tasks as never,
        pricing: t.pricing as never,
        platforms: t.platforms as never,
        tags: (t.tags ?? []).map((s) => tag[s]).filter(Boolean),
        excerpt: t.excerpt,
        content: toolDoc(t) as never,
        useCases: t.useCases.map((text) => ({ text })),
        limitations: t.limitations.map((text) => ({ text })),
        sources: [{ title: `Официальный сайт ${t.title}`, url: t.website }],
      },
    })
    tool[t.slug] = d.id
  }
  log(`инструментов: ${tools.length}`)

  // 5. Обложки + статьи
  const all = [...articles1, ...articles2, ...articles3]
  const ids: number[] = []
  let featuredId: number | null = null
  for (const [i, a] of all.entries()) {
    const png = await coverPng(a.cover, i)
    const media = await payload.create({
      collection: 'media',
      context: ctx,
      data: { alt: `Иллюстрация к материалу «${a.title}»`, credit: 'Иллюстрация: CHEATAI' },
      file: { data: png, mimetype: 'image/png', name: `${a.slug}.png`, size: png.length },
    })
    const d = await payload.create({
      collection: 'articles',
      draft: true,
      context: ctx,
      data: {
        _status: 'draft',
        isDemo: true,
        title: a.title,
        slug: a.slug,
        section: a.section,
        excerpt: a.excerpt,
        cover: media.id,
        content: a.content as never,
        category: cat[a.category],
        tags: a.tags.map((s) => tag[s]).filter(Boolean),
        authors: [author.id],
        featured: !!a.featured,
        hot: !!a.hot,
        faq: a.faq ?? [],
        sources: a.sources ?? [],
        tools: (a.tools ?? []).map((s) => tool[s]).filter(Boolean),
      },
    })
    ids.push(d.id)
    if (a.featured) featuredId = d.id
  }
  log(`статей: ${all.length}`)

  // 6. Сравнения
  const compIds: number[] = []
  const compCovers = [
    { bg: '#FFDE00', icon: 'chat', accent: '#2563EB' },
    { bg: '#FF3838', icon: 'image', accent: '#FFDE00' },
    { bg: '#2563EB', icon: 'spark', accent: '#FF793F' },
    { bg: '#111111', icon: 'chart', accent: '#FFDE00' },
  ]
  for (const [i, c] of comparisons.entries()) {
    const png = await coverPng(compCovers[i], i + 1)
    const media = await payload.create({
      collection: 'media',
      context: ctx,
      data: { alt: c.title, credit: 'Иллюстрация: CHEATAI' },
      file: { data: png, mimetype: 'image/png', name: `${c.slug}.png`, size: png.length },
    })
    const d = await payload.create({
      collection: 'comparisons',
      draft: true,
      context: ctx,
      data: {
        _status: 'draft',
        isDemo: true,
        title: c.title,
        slug: c.slug,
        excerpt: c.excerpt,
        toolA: tool[c.a],
        toolB: tool[c.b],
        cover: media.id,
        criteria: c.criteria,
        content: doc(c.body) as never,
        verdict: c.verdict,
        faq: c.faq ?? [],
      },
    })
    compIds.push(d.id)
  }
  log(`сравнений: ${comparisons.length}`)

  // 7. Промпты
  for (const p of prompts) {
    await payload.create({
      collection: 'prompts',
      draft: true,
      context: ctx,
      data: {
        _status: 'draft',
        isDemo: true,
        title: p.title,
        slug: p.slug,
        category: p.category as never,
        excerpt: p.excerpt,
        prompt: p.prompt,
        variables: p.variables,
        tools: p.tools.map((s) => tool[s]).filter(Boolean),
        content: doc(`## Как пользоваться\n\n${p.howto}`) as never,
      },
    })
  }
  log(`промптов: ${prompts.length}`)

  // 8. Страницы
  for (const p of pages) {
    await payload.create({
      collection: 'pages',
      draft: true,
      context: ctx,
      data: { _status: 'draft', isDemo: true, title: p.title, slug: p.slug, excerpt: p.excerpt, form: p.form as never, content: p.content as never },
    })
  }
  log(`страниц: ${pages.length}`)

  // 9. Глобальные настройки
  await payload.updateGlobal({
    slug: 'home',
    context: ctx,
    data: {
      heroTitle: 'БУДУЩЕЕ УЖЕ ЗДЕСЬ. ЧИТАЙ!',
      heroSubtitle: 'Нейросети, технологии и искусственный интеллект без сложных слов.',
      featured: featuredId,
      battles: compIds,
    },
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    context: ctx,
    data: {
      siteName: 'CHEATAI',
      slogan: 'ЧИТАЙ. ПОНИМАЙ. СОЗДАВАЙ.',
      description: 'Искусственный интеллект простым языком: нейросети, инструменты, промпты и гайды.',
      organization: { name: 'BONGO GROUP' },
    },
  })
  log('готово ✓')
}

