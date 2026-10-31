'use client'
import { useState } from 'react'
import { Icon } from '../ui/Icon'

export function CopyButton({ text, label = 'Копировать', className = '' }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <button type="button" onClick={copy} className={`btn ${done ? 'btn-yellow' : 'btn-paper'} px-3 py-1.5 text-[0.7rem] ${className}`} aria-live="polite">
      <Icon name={done ? 'check' : 'copy'} className="size-4" />
      {done ? 'Скопировано!' : label}
    </button>
  )
}
