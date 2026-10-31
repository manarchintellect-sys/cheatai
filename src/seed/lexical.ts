/* Мини-конструктор Lexical JSON для сид-контента: markdown-подобный синтаксис + блоки. */
import crypto from 'node:crypto'

type N = Record<string, unknown>
const id = () => crypto.randomBytes(12).toString('hex')

const text = (t: string, format = 0): N => ({ type: 'text', text: t, format, detail: 0, mode: 'normal', style: '', version: 1 })

/** Инлайн: **жирный**, *курсив*, `код`, [ссылка](/path) */
export function inline(src: string): N[] {
  const out: N[] = []
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(text(src.slice(last, m.index)))
    if (m[1]) out.push(text(m[1], 1))
    else if (m[2]) out.push(text(m[2], 2))
    else if (m[3]) out.push(text(m[3], 16))
    else if (m[4])
      out.push({
        type: 'link',
        version: 3,
        direction: 'ltr',
        format: '',
        indent: 0,
        fields: { url: m[5], newTab: /^https?:/.test(m[5]), linkType: 'custom' },
        id: id(),
        children: [text(m[4])],
      })
    last = re.lastIndex
  }
  if (last < src.length) out.push(text(src.slice(last)))
  return out
}

const el = (type: string, children: N[], extra: N = {}): N => ({ type, version: 1, direction: 'ltr', format: '', indent: 0, children, ...extra })
const para = (s: string) => el('paragraph', inline(s), { textFormat: 0, textStyle: '' })

const list = (items: string[], ordered: boolean) =>
  el(
    'list',
    items.map((it, i) => el('listitem', inline(it), { value: i + 1 })),
    { listType: ordered ? 'number' : 'bullet', tag: ordered ? 'ol' : 'ul', start: 1 },
  )

const table = (rows: string[][]) =>
  ({
    type: 'table',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: rows.map((r, ri) => ({
      type: 'tablerow',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children: r.map((c) => ({
        type: 'tablecell',
        version: 1,
        direction: 'ltr',
        format: '',
        indent: 0,
        colSpan: 1,
        rowSpan: 1,
        backgroundColor: null,
        headerState: ri === 0 ? 1 : 0,
        children: [para(c)],
      })),
    })),
  }) as N

export const block = (blockType: string, fields: N): N => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: id(), blockName: '', blockType, ...fields },
})

export const callout = (variant: 'important' | 'lifehack' | 'conclusion' | 'wow' | 'warning', textValue: string, title?: string) =>
  block('callout', { variant, text: textValue, title: title ?? null })
export const prompt = (promptText: string, title = 'Промпт', note?: string) => block('prompt', { title, prompt: promptText, note: note ?? null })
export const code = (codeText: string, language = 'text', filename?: string) => block('code', { code: codeText, language, filename: filename ?? null })
export const tabs = (title: string, items: { name: string; summary: string; points?: string[] }[]) =>
  block('compareTabs', { title, items: items.map((i) => ({ id: id(), name: i.name, summary: i.summary, points: (i.points ?? []).map((p) => ({ id: id(), text: p })) })) })

/** Markdown-подобный текст → узлы Lexical. Пустая строка разделяет абзацы. */
export function md(src: string): N[] {
  const lines = src.replace(/\r/g, '').split('\n')
  const out: N[] = []
  let buf: string[] = []
  let ul: string[] = []
  let ol: string[] = []
  let tbl: string[][] = []
  const flush = () => {
    if (buf.length) out.push(para(buf.join(' ')))
    if (ul.length) out.push(list(ul, false))
    if (ol.length) out.push(list(ol, true))
    if (tbl.length) out.push(table(tbl))
    buf = []
    ul = []
    ol = []
    tbl = []
  }
  for (const raw of lines) {
    const l = raw.trim()
    if (!l) {
      flush()
      continue
    }
    let m: RegExpMatchArray | null
    if ((m = l.match(/^(#{2,4}) (.+)$/))) {
      flush()
      out.push(el('heading', inline(m[2]), { tag: `h${m[1].length}` }))
    } else if ((m = l.match(/^- (.+)$/))) {
      if (buf.length || ol.length || tbl.length) flush()
      ul.push(m[1])
    } else if ((m = l.match(/^\d+\. (.+)$/))) {
      if (buf.length || ul.length || tbl.length) flush()
      ol.push(m[1])
    } else if (l.startsWith('|')) {
      if (buf.length || ul.length || ol.length) flush()
      const cells = l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      if (!cells.every((c) => /^-+$/.test(c))) tbl.push(cells)
    } else if ((m = l.match(/^> (.+)$/))) {
      flush()
      out.push(el('quote', inline(m[1])))
    } else {
      if (ul.length || ol.length || tbl.length) flush()
      buf.push(l)
    }
  }
  flush()
  return out
}

/** Документ из частей: строки — markdown, объекты — готовые блоки. */
export function doc(...parts: (string | N | N[])[]) {
  const children: N[] = []
  for (const p of parts) {
    if (typeof p === 'string') children.push(...md(p))
    else if (Array.isArray(p)) children.push(...p)
    else children.push(p)
  }
  return { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children } }
}
