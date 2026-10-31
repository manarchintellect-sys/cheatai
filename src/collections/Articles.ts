import type { CollectionConfig, Field } from 'payload'
import { isEditorOrAdmin, isStaff, publishedOrStaff } from '../access'
import { contentEditor } from '../blocks/editor'
import { slugField } from '../fields/slug'
import { isDemoField, seoExtraFields } from '../fields/seo'
import { prepareContent, revalidateSite } from '../hooks/content'
import { SECTIONS } from '../lib/constants'

export const faqField: Field = {
  name: 'faq',
  type: 'array',
  label: 'FAQ (попадает в разметку FAQPage)',
  labels: { singular: 'Вопрос', plural: 'Вопросы' },
  fields: [
    { name: 'question', type: 'text', required: true, label: 'Вопрос' },
    { name: 'answer', type: 'textarea', required: true, label: 'Ответ' },
  ],
}

export const sourcesField: Field = {
  name: 'sources',
  type: 'array',
  label: 'Источники',
  labels: { singular: 'Источник', plural: 'Источники' },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Название' },
    { name: 'url', type: 'text', required: true, label: 'Ссылка' },
  ],
}

const previewUrl = (section: string, slug: string) =>
  `/preview?path=${encodeURIComponent(`/${section}/${slug}`)}`

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'Статья', plural: 'Статьи' },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'section', 'category', '_status', 'isDemo', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
    preview: (doc) => (doc?.slug ? previewUrl(String(doc.section ?? 'articles'), String(doc.slug)) : null),
  },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isEditorOrAdmin,
  },
  versions: {
    maxPerDoc: 30,
    drafts: { autosave: { interval: 2000 }, schedulePublish: true },
  },
  hooks: {
    beforeChange: [prepareContent],
    afterChange: [revalidateSite],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Материал',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Заголовок (H1)' },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              label: 'Краткое описание (лид)',
              maxLength: 320,
            },
            { name: 'cover', type: 'upload', relationTo: 'media', label: 'Обложка' },
            { name: 'content', type: 'richText', editor: contentEditor, label: 'Текст статьи' },
          ],
        },
        {
          label: 'FAQ и источники',
          fields: [faqField, sourcesField],
        },
        {
          label: 'Связи',
          fields: [
            {
              name: 'related',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
              label: 'Похожие материалы (вручную, иначе подберутся автоматически)',
              maxRows: 6,
            },
            { name: 'tools', type: 'relationship', relationTo: 'tools', hasMany: true, label: 'Упомянутые инструменты' },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'section',
      type: 'select',
      required: true,
      defaultValue: 'articles',
      label: 'Раздел (определяет URL)',
      options: Object.entries(SECTIONS).map(([value, s]) => ({ label: s.label, value })),
      admin: { position: 'sidebar' },
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Категория', admin: { position: 'sidebar' } },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true, label: 'Теги', admin: { position: 'sidebar' } },
    { name: 'authors', type: 'relationship', relationTo: 'authors', hasMany: true, label: 'Авторы', admin: { position: 'sidebar' } },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Главная статья дня',
      defaultValue: false,
      access: { update: ({ req }) => ['admin', 'editor'].includes((req.user as { role?: string })?.role ?? '') },
      admin: { position: 'sidebar' },
    },
    {
      name: 'hot',
      type: 'checkbox',
      label: 'В блок «Горячее»',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'sponsored',
      type: 'group',
      label: 'Спонсорский материал',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Партнёрский / рекламный материал', defaultValue: false },
        { name: 'advertiser', type: 'text', label: 'Рекламодатель (название, ИНН)' },
        { name: 'erid', type: 'text', label: 'Токен erid (ОРД)' },
      ],
    },
    isDemoField,
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Ставится автоматически при фактической публикации.',
      },
    },
    { name: 'readingTime', type: 'number', label: 'Время чтения, мин', admin: { position: 'sidebar', readOnly: true } },
    { name: 'searchText', type: 'textarea', admin: { hidden: true } },
    ...seoExtraFields,
  ],
}
