'use client'
import { useState } from 'react'

type Row = { criterion: string; a: string; b: string; id?: string | null }

/** Интерактивная таблица: можно подсветить одного «бойца», на мобильных — карточки по критериям. */
export function CompareTable({ a, b, rows }: { a: string; b: string; rows: Row[] }) {
  const [focus, setFocus] = useState<'a' | 'b' | null>(null)
  const dim = (side: 'a' | 'b') => (focus && focus !== side ? 'opacity-35' : '')
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Подсветка">
        <span className="font-display text-xs font-black uppercase">Фокус:</span>
        <button className={`btn px-4 py-2 text-xs ${focus === null ? 'btn-ink' : 'btn-paper'}`} onClick={() => setFocus(null)} aria-pressed={focus === null}>
          Оба
        </button>
        <button className={`btn px-4 py-2 text-xs ${focus === 'a' ? 'btn-yellow' : 'btn-paper'}`} onClick={() => setFocus('a')} aria-pressed={focus === 'a'}>
          {a}
        </button>
        <button className={`btn px-4 py-2 text-xs ${focus === 'b' ? 'btn-blue' : 'btn-paper'}`} onClick={() => setFocus('b')} aria-pressed={focus === 'b'}>
          {b}
        </button>
      </div>

      <div className="panel hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-[0.97rem]">
          <thead>
            <tr className="bg-black text-white">
              <th scope="col" className="w-[22%] px-5 py-4 text-left font-display text-xs font-black uppercase">Критерий</th>
              <th scope="col" className={`px-5 py-4 text-left font-display text-base font-black text-yellow transition ${dim('a')}`}>{a}</th>
              <th scope="col" className={`px-5 py-4 text-left font-display text-base font-black text-[#8fb0ff] transition ${dim('b')}`}>{b}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id ?? i} className="border-t-2 border-line align-top transition hover:bg-yellow/20">
                <th scope="row" className="px-5 py-4 text-left font-bold">{r.criterion}</th>
                <td className={`px-5 py-4 transition ${dim('a')}`}>{r.a}</td>
                <td className={`px-5 py-4 transition ${dim('b')}`}>{r.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {rows.map((r, i) => (
          <div key={r.id ?? i} className="panel overflow-hidden">
            <p className="border-b-2 border-line bg-black px-4 py-2 font-display text-xs font-black uppercase text-white">{r.criterion}</p>
            <div className={`border-b-2 border-dashed border-line px-4 py-3 transition ${dim('a')}`}>
              <b className="mr-1 rounded-full bg-yellow px-2 text-black">{a}</b> {r.a}
            </div>
            <div className={`px-4 py-3 transition ${dim('b')}`}>
              <b className="mr-1 rounded-full bg-blue px-2 text-white">{b}</b> {r.b}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
