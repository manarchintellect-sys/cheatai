import type { CollectionConfig } from 'payload'
import { anyone, isEditorOrAdmin } from '../access'
import { slugField } from '../fields/slug'
import { ACCENTS, ICONS } from '../lib/constants'
import { revalidateSite } from '../hooks/content'

const iconField = {
  name: 'icon',
  type: 'select' as const,
  label: 'Пиктограмма',
  defaultValue: 'spark',
  options: ICONS.map((i) => ({ label: i, value: i })),
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Категория', plural: 'Категории' },
  admin: { useAsTitle: 'title', group: 'Структура', defaultColumns: ['title', 'slug', 'color'] },
  access: { read: anyone, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Название' },
    slugField(),
    { name: 'description', type: 'textarea', label: 'Описание (показывается на странице категории)' },
    { name: 'color', type: 'select', defaultValue: 'yellow', options: [...ACCENTS], label: 'Цвет рубрики' },
    iconField,
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Тег', plural: 'Теги' },
  admin: { useAsTitle: 'title', group: 'Структура', defaultColumns: ['title', 'slug', 'isHub'] },
  access: { read: anyone, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Название' },
    slugField(),
    { name: 'description', type: 'textarea', label: 'Вводный текст страницы тега' },
    iconField,
    { name: 'color', type: 'select', defaultValue: 'yellow', options: [...ACCENTS], label: 'Цвет' },
    {
      name: 'isHub',
      type: 'checkbox',
      label: 'Показывать в блоке «Разбираемся в AI»',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Автор', plural: 'Авторы' },
  admin: { useAsTitle: 'name', group: 'Структура' },
  access: { read: anyone, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Имя' },
    slugField('name'),
    { name: 'position', type: 'text', label: 'Должность / роль в редакции' },
    { name: 'bio', type: 'textarea', label: 'Коротко об авторе' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    {
      name: 'links',
      type: 'array',
      label: 'Ссылки',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
