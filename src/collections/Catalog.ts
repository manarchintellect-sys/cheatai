import type { CollectionConfig } from 'payload'
import { isEditorOrAdmin, isStaff, publishedOrStaff } from '../access'
import { contentEditor } from '../blocks/editor'
import { slugField } from '../fields/slug'
import { isDemoField, seoExtraFields } from '../fields/seo'
import { prepareContent, revalidateSite } from '../hooks/content'
import { ACCENTS, PROMPT_CATEGORIES, TOOL_CATEGORIES, TOOL_PLATFORMS, TOOL_PRICING, TOOL_TASKS } from '../lib/constants'
import { faqField, sourcesField } from './Articles'

const common = {
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isEditorOrAdmin },
  versions: { maxPerDoc: 20, drafts: { autosave: { interval: 2000 }, schedulePublish: true } },
  hooks: { beforeChange: [prepareContent], afterChange: [revalidateSite] },
}

export const Tools: CollectionConfig = {
  slug: 'tools',
  labels: { singular: 'AI-инструмент', plural: 'Каталог AI-инструментов' },
  admin: {
    useAsTitle: 'title',
    group: 'Каталог',
    defaultColumns: ['title', 'category', 'pricing', '_status', 'isDemo'],
    preview: (doc) => (doc?.slug ? `/preview?path=${encodeURIComponent(`/tools/${doc.slug}`)}` : null),
  },
  ...common,
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Название' },
    { name: 'excerpt', type: 'textarea', required: true, label: 'Коротко: что это и кому полезно', maxLength: 260 },
    {
      type: 'row',
      fields: [
        { name: 'developer', type: 'text', label: 'Разработчик' },
        { name: 'website', type: 'text', label: 'Официальный сайт' },
      ],
    },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Логотип / иллюстрация' },
    { name: 'monogram', type: 'text', label: 'Монограмма (если нет логотипа)', maxLength: 3 },
    { name: 'color', type: 'select', defaultValue: 'yellow', options: [...ACCENTS], label: 'Цвет карточки' },
    { name: 'content', type: 'richText', editor: contentEditor, label: 'Подробное описание' },
    {
      name: 'useCases',
      type: 'array',
      label: 'Для каких задач подходит',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'limitations',
      type: 'array',
      label: 'О чём помнить',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    faqField,
    sourcesField,
    slugField(),
    { name: 'category', type: 'select', required: true, options: [...TOOL_CATEGORIES], label: 'Категория', admin: { position: 'sidebar' } },
    { name: 'tasks', type: 'select', hasMany: true, options: [...TOOL_TASKS], label: 'Задачи', admin: { position: 'sidebar' } },
    {
      name: 'pricing',
      type: 'select',
      defaultValue: 'unknown',
      options: [...TOOL_PRICING],
      label: 'Модель оплаты',
      admin: { position: 'sidebar', description: 'Конкретные цены не публикуем — они часто меняются.' },
    },
    { name: 'platforms', type: 'select', hasMany: true, options: [...TOOL_PLATFORMS], label: 'Платформы', admin: { position: 'sidebar' } },
    {
      name: 'partner',
      type: 'group',
      label: 'Партнёрство',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'url', type: 'text', label: 'Партнёрская ссылка (rel="sponsored")' },
        { name: 'promoted', type: 'checkbox', label: 'Продвигаемый инструмент (маркируется «Реклама»)' },
        { name: 'advertiser', type: 'text', label: 'Рекламодатель' },
        { name: 'erid', type: 'text', label: 'erid' },
      ],
    },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true, label: 'Теги', admin: { position: 'sidebar' } },
    isDemoField,
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'readingTime', type: 'number', admin: { hidden: true } },
    { name: 'searchText', type: 'textarea', admin: { hidden: true } },
    ...seoExtraFields,
  ],
}

export const Comparisons: CollectionConfig = {
  slug: 'comparisons',
  labels: { singular: 'Сравнение', plural: 'Битва нейросетей' },
  admin: {
    useAsTitle: 'title',
    group: 'Каталог',
    defaultColumns: ['title', 'toolA', 'toolB', '_status'],
    preview: (doc) => (doc?.slug ? `/preview?path=${encodeURIComponent(`/compare/${doc.slug}`)}` : null),
  },
  ...common,
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Заголовок (H1)' },
    { name: 'excerpt', type: 'textarea', required: true, label: 'Лид', maxLength: 320 },
    {
      type: 'row',
      fields: [
        { name: 'toolA', type: 'relationship', relationTo: 'tools', required: true, label: 'Боец A' },
        { name: 'toolB', type: 'relationship', relationTo: 'tools', required: true, label: 'Боец B' },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: 'Обложка' },
    {
      name: 'criteria',
      type: 'array',
      label: 'Таблица сравнения',
      labels: { singular: 'Критерий', plural: 'Критерии' },
      admin: { description: 'Только проверяемые факты. Не публикуйте «результаты тестов», которых не было.' },
      fields: [
        { name: 'criterion', type: 'text', required: true, label: 'Критерий' },
        { name: 'a', type: 'textarea', required: true, label: 'Боец A' },
        { name: 'b', type: 'textarea', required: true, label: 'Боец B' },
      ],
    },
    { name: 'content', type: 'richText', editor: contentEditor, label: 'Разбор' },
    { name: 'verdict', type: 'textarea', label: 'Вывод: кому что выбрать' },
    faqField,
    sourcesField,
    slugField(),
    isDemoField,
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'readingTime', type: 'number', admin: { hidden: true } },
    { name: 'searchText', type: 'textarea', admin: { hidden: true } },
    ...seoExtraFields,
  ],
}

export const Prompts: CollectionConfig = {
  slug: 'prompts',
  labels: { singular: 'Промпт', plural: 'Библиотека промптов' },
  admin: {
    useAsTitle: 'title',
    group: 'Каталог',
    defaultColumns: ['title', 'category', '_status'],
    preview: (doc) => (doc?.slug ? `/preview?path=${encodeURIComponent(`/prompts/${doc.slug}`)}` : null),
  },
  ...common,
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Название' },
    { name: 'excerpt', type: 'textarea', required: true, label: 'Для чего этот промпт', maxLength: 260 },
    { name: 'prompt', type: 'textarea', required: true, label: 'Текст промпта', admin: { rows: 12 } },
    {
      name: 'variables',
      type: 'array',
      label: 'Что подставить',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Переменная, например [ТЕМА]' },
        { name: 'hint', type: 'text', label: 'Подсказка' },
      ],
    },
    { name: 'content', type: 'richText', editor: contentEditor, label: 'Как пользоваться' },
    slugField(),
    { name: 'category', type: 'select', required: true, options: [...PROMPT_CATEGORIES], label: 'Категория', admin: { position: 'sidebar' } },
    { name: 'tools', type: 'relationship', relationTo: 'tools', hasMany: true, label: 'Где работает', admin: { position: 'sidebar' } },
    isDemoField,
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'readingTime', type: 'number', admin: { hidden: true } },
    { name: 'searchText', type: 'textarea', admin: { hidden: true } },
    ...seoExtraFields,
  ],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Страница', plural: 'Страницы' },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    preview: (doc) => (doc?.slug ? `/preview?path=${encodeURIComponent(`/${doc.slug}`)}` : null),
  },
  ...common,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'excerpt', type: 'textarea', label: 'Подзаголовок' },
    { name: 'content', type: 'richText', editor: contentEditor },
    slugField(),
    {
      name: 'form',
      type: 'select',
      label: 'Форма на странице',
      defaultValue: 'none',
      options: [
        { label: 'Нет', value: 'none' },
        { label: 'Обратная связь', value: 'contact' },
        { label: 'Заявка на рекламу', value: 'ads' },
        { label: 'Заявка на автоматизацию (лид BONGO GROUP)', value: 'lead' },
      ],
      admin: { position: 'sidebar' },
    },
    isDemoField,
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'readingTime', type: 'number', admin: { hidden: true } },
    { name: 'searchText', type: 'textarea', admin: { hidden: true } },
    ...seoExtraFields,
  ],
}
