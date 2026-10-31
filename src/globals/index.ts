import type { GlobalConfig } from 'payload'
import { anyone, isEditorOrAdmin } from '../access'

const revalidate = async () => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {}
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  admin: { group: 'Администрирование' },
  access: { read: anyone, update: isEditorOrAdmin },
  hooks: { afterChange: [revalidate] },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'CHEATAI' },
    { name: 'slogan', type: 'text', defaultValue: 'ЧИТАЙ. ПОНИМАЙ. СОЗДАВАЙ.' },
    { name: 'description', type: 'textarea', defaultValue: 'Искусственный интеллект простым языком: нейросети, инструменты, промпты и гайды.' },
    { name: 'contactEmail', type: 'email', defaultValue: 'hello@cheatai.ru' },
    { name: 'adsEmail', type: 'email', defaultValue: 'ads@cheatai.ru' },
    {
      name: 'socials',
      type: 'array',
      label: 'Соцсети',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'organization',
      type: 'group',
      label: 'Издатель (Schema.org Organization)',
      fields: [
        { name: 'name', type: 'text', defaultValue: 'BONGO GROUP' },
        { name: 'url', type: 'text' },
        { name: 'legalName', type: 'text', label: 'Юридическое лицо' },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: 'Аналитика',
      fields: [
        { name: 'yandexMetrikaId', type: 'text', label: 'ID счётчика Яндекс Метрики' },
        { name: 'yandexVerification', type: 'text', label: 'yandex-verification' },
        { name: 'googleVerification', type: 'text', label: 'google-site-verification' },
      ],
    },
  ],
}

export const HomePage: GlobalConfig = {
  slug: 'home',
  label: 'Главная страница',
  admin: { group: 'Контент' },
  access: { read: anyone, update: isEditorOrAdmin },
  hooks: { afterChange: [revalidate] },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'БУДУЩЕЕ УЖЕ ЗДЕСЬ. ЧИТАЙ!' },
    { name: 'heroSubtitle', type: 'textarea', defaultValue: 'Нейросети, технологии и искусственный интеллект без сложных слов.' },
    {
      name: 'featured',
      type: 'relationship',
      relationTo: 'articles',
      label: 'Главная статья дня (иначе — последняя с флажком «Главная статья дня»)',
    },
    {
      name: 'hot',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      maxRows: 6,
      label: '«Горячее сегодня» (6 шт.; иначе — по флажку «В блок Горячее»)',
    },
    {
      name: 'guides',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      maxRows: 5,
      label: 'Подборка «Гайды»',
    },
    {
      name: 'battles',
      type: 'relationship',
      relationTo: 'comparisons',
      hasMany: true,
      maxRows: 4,
      label: '«Битва нейросетей»',
    },
  ],
}
