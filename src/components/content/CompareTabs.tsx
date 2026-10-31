'use client'
import { useId, useState } from 'react'

type Item = { name: string; summary: string; points?: { text: string }[] | null }

export function CompareTabs({ title, items }: { title?: string | null; items: Item[] }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const colors = ['bg-yellow text-black', 'bg-blue text-white', 'bg-red text-white', 'bg-orange text-black', 'bg-black text-white']
  return (
    <div className="panel not-prose my-8 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b-[3px] border-line p-3">
        {title && <span className="mr-2 font-display text-sm font-black uppercase">{title}</span>}
        <div role="tablist" className="flex flex-wrap gap-2">
          {items.map((it, i) => (
            <button
              key={i}
              role="tab"
              id={`${id}-t${i}`}
              aria-controls={`${id}-p${i}`}
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={`btn px-4 py-2 text-xs ${active === i ? colors[i % colors.length] : 'btn-paper'}`}
            >
              {it.name}
            </button>
          ))}
        </div>
      </div>
      {items.map((it, i) => (
        <div key={i} role="tabpanel" id={`${id}-p${i}`} aria-labelledby={`${id}-t${i}`} hidden={active !== i} className="halftone p-5 md:p-6">
          <p className="text-lg font-semibold">{it.summary}</p>
          {!!it.points?.length && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {it.points.map((p, j) => (
                <li key={j} className="flex gap-2 rounded-xl border-2 border-line bg-panel px-3 py-2 text-[0.95rem]">
                  <span aria-hidden className="font-black">✦</span>
                  {p.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
