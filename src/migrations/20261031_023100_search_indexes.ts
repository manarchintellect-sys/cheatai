import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Индексы для быстрого поиска с исправлением опечаток (pg_trgm). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`)
  for (const t of ['articles', 'tools', 'prompts', 'comparisons']) {
    await db.execute(sql.raw(`CREATE INDEX IF NOT EXISTS "${t}_title_trgm" ON "${t}" USING gin (lower(title) gin_trgm_ops)`))
    await db.execute(sql.raw(`CREATE INDEX IF NOT EXISTS "${t}_search_trgm" ON "${t}" USING gin (search_text gin_trgm_ops)`))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const t of ['articles', 'tools', 'prompts', 'comparisons']) {
    await db.execute(sql.raw(`DROP INDEX IF EXISTS "${t}_title_trgm"; DROP INDEX IF EXISTS "${t}_search_trgm"`))
  }
}
