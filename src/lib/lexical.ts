/* Утилиты для разбора Lexical JSON без зависимости от рендера. */

type Node = {
  type?: string
  tag?: string
  text?: string
  children?: Node[]
  fields?: Record<string, unknown>
}

export type Heading = { id: string; text: string; level: 2 | 3 }

const translit = (s: string) => {
  const m: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n',
    о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y',
    ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return s.toLowerCase().split('').map((c) => m[c] ?? c).join('')
}

export const headingId = (text: string) =>
  translit(text).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section'

export const nodeText = (node?: Node): string => {
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  let out = ''
  if (node.fields) {
    for (const v of Object.values(node.fields)) {
      if (typeof v === 'string' && v.length > 2 && !/^[a-z]+$/.test(v)) out += ' ' + v
      if (Array.isArray(v))
        for (const item of v)
          if (item && typeof item === 'object')
            for (const iv of Object.values(item)) if (typeof iv === 'string') out += ' ' + iv
    }
  }
  if (node.children) out += node.children.map(nodeText).join(node.type === 'root' ? '\n' : ' ')
  return out
}

export const lexicalToText = (data: unknown): string => {
  const root = (data as { root?: Node } | null)?.root
  return root ? nodeText(root).replace(/\s+/g, ' ').trim() : ''
}

/** Заголовки H2/H3 с уникальными id — для оглавления и якорей. */
export const extractHeadings = (data: unknown): Heading[] => {
  const root = (data as { root?: Node } | null)?.root
  const out: Heading[] = []
  const used = new Map<string, number>()
  for (const n of root?.children ?? []) {
    if (n.type === 'heading' && (n.tag === 'h2' || n.tag === 'h3')) {
      const text = nodeText(n).trim()
      let id = headingId(text)
      const c = used.get(id) ?? 0
      used.set(id, c + 1)
      if (c) id = `${id}-${c + 1}`
      out.push({ id, text, level: n.tag === 'h2' ? 2 : 3 })
    }
  }
  return out
}

export const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 180))
