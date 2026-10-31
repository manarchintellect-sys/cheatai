export const SECTIONS = {
  news: { label: 'Новости AI', short: 'Новости', path: '/news', description: 'Что происходит в мире искусственного интеллекта и как к этому относиться без паники и хайпа.', color: 'red' },
  articles: { label: 'Нейросети', short: 'Нейросети', path: '/articles', description: 'Редакционные материалы о том, как устроены нейросети и что они умеют на самом деле.', color: 'blue' },
  guides: { label: 'Гайды', short: 'Гайды', path: '/guides', description: 'Пошаговые инструкции: от первого промпта до собственного AI-бота.', color: 'yellow' },
  business: { label: 'AI для бизнеса', short: 'Бизнес', path: '/business', description: 'Как внедрять искусственный интеллект в компанию: процессы, экономика, риски.', color: 'orange' },
} as const

export type SectionKey = keyof typeof SECTIONS

export const TOOL_CATEGORIES = [
  { label: 'Тексты и чат-боты', value: 'text' },
  { label: 'Изображения', value: 'image' },
  { label: 'Видео', value: 'video' },
  { label: 'Поиск и исследования', value: 'search' },
  { label: 'Автоматизация', value: 'automation' },
  { label: 'Код', value: 'code' },
] as const

export const TOOL_TASKS = [
  { label: 'Написать текст', value: 'writing' },
  { label: 'Ответить на вопрос', value: 'qa' },
  { label: 'Создать картинку', value: 'image-gen' },
  { label: 'Сделать видео', value: 'video-gen' },
  { label: 'Найти информацию', value: 'research' },
  { label: 'Написать код', value: 'coding' },
  { label: 'Автоматизировать процесс', value: 'workflow' },
  { label: 'Проанализировать документ', value: 'docs' },
] as const

export const TOOL_PRICING = [
  { label: 'Бесплатно', value: 'free' },
  { label: 'Есть бесплатный тариф', value: 'freemium' },
  { label: 'Только платно', value: 'paid' },
  { label: 'Open source', value: 'opensource' },
  { label: 'Уточняется', value: 'unknown' },
] as const

export const TOOL_PLATFORMS = [
  { label: 'Веб', value: 'web' },
  { label: 'iOS', value: 'ios' },
  { label: 'Android', value: 'android' },
  { label: 'Windows', value: 'windows' },
  { label: 'macOS', value: 'macos' },
  { label: 'API', value: 'api' },
  { label: 'Self-hosted', value: 'selfhosted' },
  { label: 'Telegram', value: 'telegram' },
] as const

export const PROMPT_CATEGORIES = [
  { label: 'Тексты', value: 'texts' },
  { label: 'Учёба', value: 'study' },
  { label: 'Работа и бизнес', value: 'business' },
  { label: 'Маркетинг', value: 'marketing' },
  { label: 'Изображения', value: 'images' },
  { label: 'Код', value: 'code' },
] as const

export const ACCENTS = [
  { label: 'Жёлтый', value: 'yellow' },
  { label: 'Красный', value: 'red' },
  { label: 'Синий', value: 'blue' },
  { label: 'Оранжевый', value: 'orange' },
  { label: 'Чёрный', value: 'black' },
] as const

export const ICONS = [
  'chat', 'spark', 'image', 'video', 'bolt', 'gear', 'brain', 'shield', 'search', 'code', 'book', 'rocket', 'news', 'chart', 'eye', 'star',
] as const

export const labelOf = (list: readonly { label: string; value: string }[], v?: string | null) =>
  list.find((x) => x.value === v)?.label ?? v ?? ''
