import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { headingId, nodeText } from '@/lib/lexical'
import { CopyButton } from './CopyButton'
import { CompareTabs } from './CompareTabs'
import type { CalloutBlock, CodeBlock, CompareTabsBlock, PromptBlock } from '@/payload-types'

const CALLOUT: Record<string, { label: string; cls: string; badge: string }> = {
  important: { label: 'ВАЖНО!', cls: 'bg-yellow text-black', badge: 'bg-black text-yellow' },
  lifehack: { label: 'ЛАЙФХАК!', cls: 'bg-blue text-white', badge: 'bg-yellow text-black' },
  conclusion: { label: 'ВЫВОД', cls: 'bg-black text-white dark:bg-[#262626]', badge: 'bg-yellow text-black' },
  wow: { label: 'WOW-ФАКТ', cls: 'bg-panel text-ink border-l-[14px] !border-l-red', badge: 'bg-red text-white' },
  warning: { label: 'ОСТОРОЖНО', cls: 'bg-orange text-black', badge: 'bg-black text-white' },
}

export function Callout({ variant, title, text }: { variant: string; title?: string | null; text: string }) {
  const c = CALLOUT[variant] ?? CALLOUT.important
  return (
    <aside className={`not-prose relative my-8 rounded-[18px] border-[3px] border-black p-5 pt-7 shadow-[5px_5px_0_0_var(--ink)] md:p-6 md:pt-8 ${c.cls}`}>
      <span className={`absolute -top-4 left-5 rotate-[-3deg] rounded-full border-[3px] border-black px-3 py-1 font-display text-xs font-black tracking-wide ${c.badge}`}>
        {c.label}
      </span>
      {title && <p className="mb-1 font-display text-lg font-extrabold">{title}</p>}
      <p className="whitespace-pre-line text-[1.02rem] leading-relaxed">{text}</p>
    </aside>
  )
}

export function PromptCard({ title, prompt, note }: { title?: string | null; prompt: string; note?: string | null }) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-[18px] border-[3px] border-line bg-panel shadow-[5px_5px_0_0_var(--ink)]">
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-line bg-yellow px-4 py-2 text-black">
        <span className="font-display text-xs font-black uppercase tracking-wider">✎ {title || 'Промпт'}</span>
        <CopyButton text={prompt} />
      </div>
      <pre className="halftone whitespace-pre-wrap break-words p-4 font-mono text-[0.92rem] leading-relaxed md:p-5">{prompt}</pre>
      {note && <p className="border-t-2 border-dashed border-line px-4 py-2 text-sm text-muted">{note}</p>}
    </div>
  )
}

export function CodeCard({ code, language, filename }: { code: string; language?: string | null; filename?: string | null }) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-[18px] border-[3px] border-line shadow-[5px_5px_0_0_var(--ink)]">
      <div className="flex items-center justify-between gap-3 bg-black px-4 py-2 text-white">
        <span className="flex items-center gap-2 font-mono text-xs">
          <span className="flex gap-1.5" aria-hidden>
            <i className="size-3 rounded-full bg-red" />
            <i className="size-3 rounded-full bg-yellow" />
            <i className="size-3 rounded-full bg-blue" />
          </span>
          {filename || language}
        </span>
        <CopyButton text={code} label="Код" className="!border-white !shadow-none" />
      </div>
      <pre className="overflow-x-auto bg-[#161616] p-4 font-mono text-[0.88rem] leading-relaxed text-[#f4f1e8]">
        <code>{code}</code>
      </pre>
    </div>
  )
}

const internalHref = (doc: unknown, relationTo?: string) => {
  const d = (doc as { value?: Record<string, unknown> })?.value
  if (!d || typeof d !== 'object') return '#'
  if (relationTo === 'tools') return `/tools/${d.slug}`
  if (relationTo === 'comparisons') return `/compare/${d.slug}`
  if (relationTo === 'prompts') return `/prompts/${d.slug}`
  if (relationTo === 'pages') return `/${d.slug}`
  return `/${d.section ?? 'articles'}/${d.slug}`
}

export function RichText({ data, className = '' }: { data: unknown; className?: string }) {
  if (!data || !(data as { root?: unknown }).root) return null
  const used = new Map<string, number>()

  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const Tag = (['h2', 'h3', 'h4'].includes(node.tag) ? node.tag : 'h2') as 'h2'
      let id = headingId(nodeText(node as never).trim())
      const c = used.get(id) ?? 0
      used.set(id, c + 1)
      if (c) id = `${id}-${c + 1}`
      return (
        <Tag id={id} className="group">
          {nodesToJSX({ nodes: node.children })}
          <a href={`#${id}`} className="ml-2 align-middle text-base no-underline opacity-0 transition group-hover:opacity-50" aria-label="Ссылка на раздел">
            #
          </a>
        </Tag>
      )
    },
    link: ({ node, nodesToJSX }) => {
      const f = node.fields as { url?: string; newTab?: boolean; linkType?: string; doc?: unknown }
      const href = f.linkType === 'internal' ? internalHref(f.doc, (f.doc as { relationTo?: string })?.relationTo) : f.url ?? '#'
      const external = /^https?:\/\//.test(href)
      return (
        <a href={href} target={f.newTab || external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
          {nodesToJSX({ nodes: node.children })}
        </a>
      )
    },
    table: (args) => (
      <div className="not-prose my-8 overflow-x-auto rounded-[18px] border-[3px] border-line shadow-[5px_5px_0_0_var(--ink)]">
        <div className="prose-comic min-w-[520px]">{defaultConverters.table && typeof defaultConverters.table === 'function' ? defaultConverters.table(args) : null}</div>
      </div>
    ),
    blocks: {
      callout: ({ node }: { node: { fields: CalloutBlock } }) => (
        <Callout variant={node.fields.variant} title={node.fields.title} text={node.fields.text} />
      ),
      code: ({ node }: { node: { fields: CodeBlock } }) => (
        <CodeCard code={node.fields.code} language={node.fields.language} filename={node.fields.filename} />
      ),
      prompt: ({ node }: { node: { fields: PromptBlock } }) => (
        <PromptCard title={node.fields.title} prompt={node.fields.prompt} note={node.fields.note} />
      ),
      compareTabs: ({ node }: { node: { fields: CompareTabsBlock } }) => (
        <CompareTabs title={node.fields.title} items={node.fields.items ?? []} />
      ),
    },
  })

  return (
    <LexicalRichText
      data={data as SerializedEditorState}
      converters={converters}
      disableContainer
      disableIndent
      className={className}
    />
  )
}

export function RichTextBody({ data }: { data: unknown }) {
  return (
    <div className="prose-comic">
      <RichText data={data} />
    </div>
  )
}
