type Variant = 'red' | 'yellow' | 'inverse'

/** Текстовый логотип CHEATAI. — тяжёлый гротеск, акцент на «AI». */
export function Logo({ variant = 'red', className = '', slogan = false }: { variant?: Variant; className?: string; slogan?: boolean }) {
  const ai = variant === 'red' ? 'text-red' : 'text-yellow'
  const base = variant === 'inverse' ? 'text-white' : 'text-ink'
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className={`font-display font-black tracking-[-0.04em] ${base}`} style={{ fontStretch: '100%' }}>
        CHEAT
        <span
          className={`${ai} relative`}
          style={variant === 'yellow' ? { WebkitTextStroke: '0.035em var(--ink)', paintOrder: 'stroke fill' } : undefined}
        >
          AI
        </span>
        <span className={variant === 'inverse' ? 'text-yellow' : 'text-ink'}>.</span>
      </span>
      {slogan && (
        <span className="mt-1.5 font-display text-[0.28em] font-bold tracking-[0.14em] opacity-80">ЧИТАЙ. ПОНИМАЙ. СОЗДАВАЙ.</span>
      )}
    </span>
  )
}
