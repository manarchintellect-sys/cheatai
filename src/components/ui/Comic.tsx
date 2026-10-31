import type { ReactNode } from 'react'

const accentBg: Record<string, string> = {
  yellow: 'bg-yellow text-black',
  red: 'bg-red text-white',
  blue: 'bg-blue text-white',
  orange: 'bg-orange text-black',
  black: 'bg-black text-white dark:bg-white dark:text-black',
}
export const accentClass = (c?: string | null) => accentBg[c ?? 'yellow'] ?? accentBg.yellow

/** Стикер-звёздочка: NEW!, WOW!, HOT!, AI! */
export function Sticker({
  children,
  color = 'yellow',
  rotate = -8,
  className = '',
  animated = false,
}: {
  children: ReactNode
  color?: 'yellow' | 'red' | 'blue' | 'orange'
  rotate?: number
  className?: string
  animated?: boolean
}) {
  const fill = { yellow: '#FFDE00', red: '#FF3838', blue: '#2563EB', orange: '#FF793F' }[color]
  const txt = color === 'yellow' || color === 'orange' ? '#111' : '#fff'
  return (
    <span
      className={`pointer-events-none inline-grid place-items-center ${/\babsolute\b/.test(className) ? '' : 'relative'} ${animated ? 'animate-pop' : ''} ${className}`}
      style={{ ['--r' as string]: `${rotate}deg`, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        <polygon
          points="50,2 61,26 88,14 77,40 98,50 77,60 88,86 61,74 50,98 39,74 12,86 23,60 2,50 23,40 12,14 39,26"
          fill={fill}
          stroke="#111"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative font-display text-[0.8em] font-black leading-none" style={{ color: txt }}>
        {children}
      </span>
    </span>
  )
}

/** Комиксное облачко с хвостиком. */
export function Bubble({
  children,
  tail = 'left',
  className = '',
}: {
  children: ReactNode
  tail?: 'left' | 'right' | 'none'
  className?: string
}) {
  return (
    <span
      className={`${/\babsolute\b/.test(className) ? '' : 'relative'} inline-block rounded-[999px] border-[3px] border-black bg-white px-4 py-2 font-display font-black text-black shadow-[3px_3px_0_0_#111] ${className}`}
    >
      {children}
      {tail !== 'none' && (
        <span
          className={`absolute -bottom-[13px] h-4 w-5 border-b-[3px] border-black bg-white ${
            tail === 'left' ? 'left-6 skew-x-[35deg] border-l-[3px]' : 'right-6 -skew-x-[35deg] border-r-[3px]'
          }`}
        />
      )}
    </span>
  )
}

export function SectionHeading({
  kicker,
  title,
  href,
  hrefLabel = 'Все материалы',
  color = 'yellow',
}: {
  kicker?: string
  title: string
  href?: string
  hrefLabel?: string
  color?: string
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
      <div>
        {kicker && <span className={`caption mb-3 text-xs ${color !== 'yellow' ? accentClass(color) : ''}`}>{kicker}</span>}
        <h2 className="section-title">{title}</h2>
      </div>
      {href && (
        <a href={href} className="btn btn-paper text-xs">
          {hrefLabel} <span aria-hidden>→</span>
        </a>
      )}
    </div>
  )
}

/** Диагональный разделитель блоков. */
export function DiagonalDivider({ color = 'var(--ink)', flip = false }: { color?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="block h-6 w-full md:h-10" aria-hidden="true" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M0 40L1440 0V40z" fill={color} />
    </svg>
  )
}
