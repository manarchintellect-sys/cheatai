import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { ru } from '@payloadcms/translations/languages/ru'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { sql } from '@payloadcms/db-postgres'

import { contentEditor } from './blocks/editor'
import { Articles } from './collections/Articles'
import { Comparisons, Pages, Prompts, Tools } from './collections/Catalog'
import { Media } from './collections/Media'
import { AdSlots, Messages, Redirects, Subscribers } from './collections/Service'
import { Authors, Categories, Tags } from './collections/Taxonomy'
import { Users } from './collections/Users'
import { HomePage, SiteSettings } from './globals'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const sectionOf = (doc: Record<string, unknown>, collection?: string) => {
  if (collection === 'tools') return 'tools'
  if (collection === 'comparisons') return 'compare'
  if (collection === 'prompts') return 'prompts'
  if (collection === 'pages') return ''
  return String(doc.section ?? 'articles')
}

export default buildConfig({
  serverURL: SITE,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — CHEATAI CMS' },
    importMap: { baseDir: path.resolve(dirname) },
    dateFormat: 'dd.MM.yyyy HH:mm',
  },
  i18n: { supportedLanguages: { ru, en }, fallbackLanguage: 'ru' },
  collections: [
    Articles,
    Comparisons,
    Tools,
    Prompts,
    Pages,
    Media,
    Categories,
    Tags,
    Authors,
    AdSlots,
    Subscribers,
    Messages,
    Redirects,
    Users,
  ],
  globals: [HomePage, SiteSettings],
  editor: contentEditor,
  secret: process.env.PAYLOAD_SECRET || '',
  csrf: [SITE],
  cors: [SITE],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      // На Railway во время сборки приватная сеть недоступна — используем публичный адрес БД
      connectionString:
        (process.env.NEXT_PHASE === 'phase-production-build' && process.env.DATABASE_PUBLIC_URL) || process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
    // в dev схема синхронизируется автоматически; PAYLOAD_DB_PUSH=false — работать только через миграции
    push: process.env.PAYLOAD_DB_PUSH !== 'false',
  }),
  sharp,
  jobs: {
    // запускает отложенную публикацию (schedulePublish) раз в минуту на долгоживущем сервере
    autoRun: [{ cron: '* * * * *', queue: 'default', limit: 20 }],
    shouldAutoRun: async () => process.env.DISABLE_JOBS !== 'true',
  },
  async onInit(payload) {
    try {
      await payload.db.drizzle.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`)
    } catch (e) {
      payload.logger.warn('pg_trgm недоступен — поиск будет без исправления опечаток')
    }
    // Первый запуск на пустой базе: демо-контент (только в рантайме, не во время сборки)
    if (process.env.SEED_IF_EMPTY === 'true' && process.env.NEXT_PHASE !== 'phase-production-build') {
      const { totalDocs } = await payload.count({ collection: 'categories' })
      if (totalDocs === 0) {
        const { seed } = await import('./seed/index')
        await seed(payload)
      }
    }
  },
  plugins: [
    seoPlugin({
      collections: ['articles', 'comparisons', 'tools', 'prompts', 'pages'],
      uploadsCollection: 'media',
      tabbedUI: false,
      generateTitle: ({ doc }) => `${(doc as { title?: string }).title ?? ''} — CHEATAI`,
      generateDescription: ({ doc }) => String((doc as { excerpt?: string }).excerpt ?? '').slice(0, 160),
      generateURL: ({ doc, collectionSlug }) => {
        const d = doc as Record<string, unknown>
        const sec = sectionOf(d, collectionSlug)
        return `${SITE}/${sec ? sec + '/' : ''}${d.slug ?? ''}`
      },
    }),
  ],
})
