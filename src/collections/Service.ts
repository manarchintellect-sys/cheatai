import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isEditorOrAdmin, nobody } from '../access'
import { revalidateSite } from '../hooks/content'

export const AdSlots: CollectionConfig = {
  slug: 'ad-slots',
  labels: { singular: 'Рекламное место', plural: 'Реклама' },
  admin: {
    useAsTitle: 'name',
    group: 'Монетизация',
    defaultColumns: ['name', 'placement', 'kind', 'active'],
    description:
      'Реклама в РФ маркируется: пометка «Реклама», рекламодатель и токен erid из ОРД. Без erid внешняя реклама не показывается.',
  },
  access: { read: anyone, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Название (для редакции)' },
    {
      name: 'placement',
      type: 'select',
      required: true,
      label: 'Место',
      options: [
        { label: 'Главная — после «Горячее»', value: 'home' },
        { label: 'Статья — внутри текста', value: 'article-inline' },
        { label: 'Статья — боковая колонка', value: 'article-sidebar' },
        { label: 'Каталог — над списком', value: 'catalog' },
      ],
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'house',
      label: 'Тип',
      options: [
        { label: 'Собственная реклама BONGO GROUP', value: 'house' },
        { label: 'Внешний рекламодатель', value: 'external' },
        { label: 'Лид-форма услуг автоматизации', value: 'lead' },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: false, label: 'Активно' },
    { name: 'title', type: 'text', required: true, label: 'Заголовок' },
    { name: 'text', type: 'textarea', label: 'Текст' },
    { name: 'cta', type: 'text', label: 'Текст кнопки', defaultValue: 'Подробнее' },
    { name: 'url', type: 'text', required: true, label: 'Ссылка' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'advertiser',
      type: 'text',
      label: 'Рекламодатель (название, ИНН)',
      admin: { description: 'Обязательно для внешней рекламы.' },
    },
    { name: 'erid', type: 'text', label: 'Токен erid' },
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', label: 'Начало показа' },
        { name: 'endsAt', type: 'date', label: 'Окончание показа' },
      ],
    },
  ],
}

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Подписчик', plural: 'Подписчики' },
  admin: { useAsTitle: 'email', group: 'Аудитория', defaultColumns: ['email', 'source', 'createdAt'] },
  access: { read: isEditorOrAdmin, create: nobody, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'source', type: 'text', label: 'Откуда подписался' },
    { name: 'consent', type: 'checkbox', label: 'Согласие на обработку ПД', defaultValue: false },
  ],
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Обращение', plural: 'Обращения' },
  admin: { useAsTitle: 'email', group: 'Аудитория', defaultColumns: ['topic', 'name', 'email', 'handled', 'createdAt'] },
  access: { read: isEditorOrAdmin, create: nobody, update: isEditorOrAdmin, delete: isAdmin },
  fields: [
    {
      name: 'topic',
      type: 'select',
      options: [
        { label: 'Обратная связь', value: 'contact' },
        { label: 'Реклама', value: 'ads' },
        { label: 'Автоматизация бизнеса (лид)', value: 'lead' },
      ],
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'handled', type: 'checkbox', defaultValue: false, label: 'Обработано' },
  ],
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Редирект', plural: 'Редиректы (301)' },
  admin: { useAsTitle: 'from', group: 'Администрирование', defaultColumns: ['from', 'to'] },
  access: { read: anyone, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Старый путь',
      admin: { description: 'Например /guides/old-slug' },
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? '/' + value.replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, '') : value)] },
    },
    { name: 'to', type: 'text', required: true, label: 'Новый путь или URL' },
  ],
}
