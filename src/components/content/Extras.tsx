type Faq = { question: string; answer: string; id?: string | null }
type Source = { title: string; url: string; id?: string | null }

export function FaqBlock({ items }: { items?: Faq[] | null }) {
  if (!items?.length) return null
  return (
    <section className="mt-14" aria-labelledby="faq">
      <h2 id="faq" className="section-title mb-6">
        Вопросы и ответы
      </h2>
      <div className="grid gap-3">
        {items.map((f, i) => (
          <details key={f.id ?? i} className="panel group overflow-hidden [&[open]]:shadow-[5px_5px_0_0_#2563eb]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-display text-[1rem] font-extrabold md:p-5 [&::-webkit-details-marker]:hidden">
              {f.question}
              <span className="grid size-9 shrink-0 place-items-center rounded-full border-[3px] border-line bg-yellow text-xl text-black transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="border-t-2 border-dashed border-line px-4 py-4 md:px-5">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function SourcesBlock({ items }: { items?: Source[] | null }) {
  if (!items?.length) return null
  return (
    <section className="mt-12" aria-labelledby="sources">
      <h2 id="sources" className="mb-4 font-display text-lg font-black uppercase">
        Источники
      </h2>
      <ol className="grid gap-2 text-[0.95rem]">
        {items.map((s, i) => (
          <li key={s.id ?? i} className="flex gap-3">
            <span className="font-display font-black text-muted">[{i + 1}]</span>
            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="break-words underline decoration-blue decoration-2 underline-offset-4 hover:bg-yellow hover:text-black">
              {s.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
