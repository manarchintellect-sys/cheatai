import type { CollectionConfig } from 'payload'
import { anyone, isStaff, isEditorOrAdmin } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Файл', plural: 'Медиа-библиотека' },
  admin: { group: 'Контент' },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isEditorOrAdmin },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Alt-текст (для SEO и доступности)' },
    { name: 'credit', type: 'text', label: 'Источник / автор изображения' },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 480, height: 252, position: 'centre', formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 800, height: 420, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'og', width: 1200, height: 630, position: 'centre', formatOptions: { format: 'jpeg', options: { quality: 85 } } },
    ],
  },
}
