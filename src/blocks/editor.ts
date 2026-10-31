import type { Block } from 'payload'
import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: { singular: 'Комикс-плашка', plural: 'Комикс-плашки' },
  interfaceName: 'CalloutBlock',
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'important',
      options: [
        { label: 'ВАЖНО! (жёлтая)', value: 'important' },
        { label: 'ЛАЙФХАК! (синяя)', value: 'lifehack' },
        { label: 'ВЫВОД (чёрная)', value: 'conclusion' },
        { label: 'WOW-ФАКТ (красная)', value: 'wow' },
        { label: 'Предупреждение', value: 'warning' },
      ],
    },
    { name: 'title', type: 'text', label: 'Заголовок (необязательно)' },
    { name: 'text', type: 'textarea', required: true, label: 'Текст' },
  ],
}

export const CodeBlock: Block = {
  slug: 'code',
  labels: { singular: 'Код', plural: 'Код' },
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'text',
      options: ['text', 'bash', 'python', 'javascript', 'typescript', 'json', 'html', 'css', 'sql', 'yaml'].map(
        (v) => ({ label: v, value: v }),
      ),
    },
    { name: 'filename', type: 'text', label: 'Имя файла (необязательно)' },
    { name: 'code', type: 'code', required: true },
  ],
}

export const PromptBlock: Block = {
  slug: 'prompt',
  labels: { singular: 'Промпт', plural: 'Промпты' },
  interfaceName: 'PromptBlock',
  fields: [
    { name: 'title', type: 'text', label: 'Подпись', defaultValue: 'Промпт' },
    { name: 'prompt', type: 'textarea', required: true, label: 'Текст промпта' },
    { name: 'note', type: 'text', label: 'Пояснение под промптом' },
  ],
}

export const CompareTabsBlock: Block = {
  slug: 'compareTabs',
  labels: { singular: 'Интерактивное сравнение', plural: 'Интерактивные сравнения' },
  interfaceName: 'CompareTabsBlock',
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок' },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      labels: { singular: 'Вариант', plural: 'Варианты' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'summary', type: 'textarea', required: true, label: 'Описание' },
        {
          name: 'points',
          type: 'array',
          label: 'Пункты',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
  ],
}

export const contentEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((f) => f.key !== 'heading'),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    FixedToolbarFeature(),
    EXPERIMENTAL_TableFeature(),
    BlocksFeature({ blocks: [CalloutBlock, CodeBlock, PromptBlock, CompareTabsBlock] }),
  ],
})
