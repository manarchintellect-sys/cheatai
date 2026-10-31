'use client'
import { useActionState, useEffect, useState } from 'react'
import { sendMessage, subscribe, type FormState } from '@/app/(frontend)/actions'

function useTs() {
  const [ts, setTs] = useState('')
  useEffect(() => setTs(String(Date.now())), [])
  return ts
}

const Honeypot = () => (
  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
    <label>
      Сайт <input type="text" name="website" tabIndex={-1} autoComplete="off" />
    </label>
  </div>
)

const Status = ({ state }: { state: FormState }) =>
  state ? (
    <p role="status" className={`mt-3 rounded-xl border-2 border-line px-3 py-2 text-sm font-semibold ${state.ok ? 'bg-yellow text-black' : 'bg-red text-white'}`}>
      {state.message}
    </p>
  ) : null

const Consent = () => (
  <label className="flex items-start gap-2 text-xs leading-snug text-muted">
    <input type="checkbox" name="consent" required className="mt-0.5 size-4 accent-[#2563eb]" />
    <span>
      Согласен(на) с <a href="/privacy" className="underline">политикой конфиденциальности</a> и обработкой персональных данных
    </span>
  </label>
)

export function SubscribeForm({ source = 'site', compact = false }: { source?: string; compact?: boolean }) {
  const [state, action, pending] = useActionState(subscribe, null)
  const ts = useTs()
  return (
    <form action={action} className="relative">
      <Honeypot />
      <input type="hidden" name="ts" value={ts} />
      <input type="hidden" name="source" value={source} />
      <div className={`flex gap-2 ${compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'}`}>
        <label className="sr-only" htmlFor={`email-${source}`}>Электронная почта</label>
        <input
          id={`email-${source}`}
          type="email"
          name="email"
          required
          placeholder="you@mail.ru"
          className="min-w-0 flex-1 rounded-full border-[3px] border-line bg-panel px-5 py-3 text-ink outline-none placeholder:text-muted focus:border-blue"
        />
        <button className="btn btn-red" disabled={pending}>
          {pending ? 'Отправляем…' : 'Подписаться'}
        </button>
      </div>
      <div className="mt-3">
        <Consent />
      </div>
      <Status state={state} />
    </form>
  )
}

export function MessageForm({ topic = 'contact' }: { topic?: 'contact' | 'ads' | 'lead' }) {
  const [state, action, pending] = useActionState(sendMessage, null)
  const ts = useTs()
  const field = 'w-full rounded-2xl border-[3px] border-line bg-panel px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-blue'
  if (state?.ok) return <Status state={state} />
  return (
    <form action={action} className="panel relative grid gap-4 p-5 md:p-7">
      <Honeypot />
      <input type="hidden" name="ts" value={ts} />
      <input type="hidden" name="topic" value={topic} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-bold">
          Имя
          <input name="name" required minLength={2} className={field} autoComplete="name" />
        </label>
        <label className="grid gap-1.5 text-sm font-bold">
          Почта
          <input name="email" type="email" required className={field} autoComplete="email" />
        </label>
      </div>
      {topic !== 'contact' && (
        <label className="grid gap-1.5 text-sm font-bold">
          Компания
          <input name="company" className={field} autoComplete="organization" />
        </label>
      )}
      <label className="grid gap-1.5 text-sm font-bold">
        {topic === 'ads' ? 'Что хотите продвинуть?' : topic === 'lead' ? 'Какой процесс хотите автоматизировать?' : 'Сообщение'}
        <textarea name="message" required minLength={10} rows={5} className={field} />
      </label>
      <Consent />
      <div>
        <button className="btn btn-yellow" disabled={pending}>
          {pending ? 'Отправляем…' : 'Отправить'}
        </button>
      </div>
      <Status state={state} />
    </form>
  )
}
