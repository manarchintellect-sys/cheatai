import type { Field } from 'payload'

/** Дополнительные SEO-поля поверх плагина @payloadcms/plugin-seo (meta.title/description/image). */
export const seoExtraFields: Field[] = [
  {
    name: 'canonical',
    type: 'text',
    label: 'Canonical URL',
    admin: {
      position: 'sidebar',
      description: 'Оставьте пустым — будет использован адрес самой страницы.',
    },
  },
  {
    name: 'noindex',
    type: 'checkbox',
    label: 'Закрыть от индексации (noindex)',
    defaultValue: false,
    admin: { position: 'sidebar' },
  },
]

export const isDemoField: Field = {
  name: 'isDemo',
  type: 'checkbox',
  label: 'Демо-материал (требует редакционной проверки)',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'Снимите флажок после фактической проверки текста редакцией.',
  },
}
