/** Оригинальный маскот CHEATAI — робот «Чит», читающий журнал. Чистый SVG, без растровой графики. */
export function Mascot({ className = '' }: { className?: string }) {
  const ink = '#111111'
  return (
    <svg viewBox="0 0 420 460" className={className} role="img" aria-label="Робот Чит — маскот CHEATAI — читает журнал">
      <defs>
        <pattern id="m-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.7" fill={ink} opacity=".28" />
        </pattern>
        <clipPath id="m-head">
          <rect x="102" y="70" width="216" height="168" rx="48" />
        </clipPath>
        <clipPath id="m-body">
          <path d="M128 262h164c18 0 30 12 30 30v110H98V292c0-18 12-30 30-30z" />
        </clipPath>
      </defs>

      {/* тень на «полу» */}
      <ellipse cx="210" cy="438" rx="150" ry="14" fill={ink} opacity=".18" />

      {/* антенна */}
      <path d="M210 70V34" stroke={ink} strokeWidth="8" strokeLinecap="round" />
      <circle cx="210" cy="26" r="15" fill="#FF3838" stroke={ink} strokeWidth="6" />
      <circle cx="205" cy="21" r="4" fill="#fff" />
      <path d="M246 20l12-12M252 34l18-2M170 20l-12-12M166 34l-18-2" stroke={ink} strokeWidth="5" strokeLinecap="round" />

      {/* уши */}
      <rect x="78" y="128" width="30" height="58" rx="12" fill="#FF3838" stroke={ink} strokeWidth="6" />
      <rect x="312" y="128" width="30" height="58" rx="12" fill="#FF3838" stroke={ink} strokeWidth="6" />

      {/* голова */}
      <rect x="102" y="70" width="216" height="168" rx="48" fill="#fff" />
      <g clipPath="url(#m-head)">
        <rect x="102" y="185" width="216" height="60" fill="url(#m-dots)" />
        <path d="M128 92c20-12 60-14 84-12" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      </g>
      <rect x="102" y="70" width="216" height="168" rx="48" fill="none" stroke={ink} strokeWidth="7" />

      {/* экран-визор */}
      <rect x="126" y="100" width="168" height="104" rx="30" fill={ink} />
      <path d="M140 116c10-6 22-8 34-8" stroke="#fff" strokeOpacity=".35" strokeWidth="6" strokeLinecap="round" />
      {/* глаза */}
      <g>
        <ellipse cx="176" cy="148" rx="17" ry="21" fill="#FFDE00" />
        <ellipse cx="244" cy="148" rx="17" ry="21" fill="#FFDE00" />
        <circle cx="182" cy="140" r="6" fill="#fff" />
        <circle cx="250" cy="140" r="6" fill="#fff" />
      </g>
      {/* брови-«молнии» */}
      <path d="M154 118l20 6 18-8" stroke="#FFDE00" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M228 116l18 8 20-6" stroke="#FFDE00" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* улыбка */}
      <path d="M184 180c14 12 38 12 52 0" stroke="#FFDE00" strokeWidth="7" strokeLinecap="round" fill="none" />

      {/* шея */}
      <rect x="182" y="236" width="56" height="30" rx="8" fill="#FF793F" stroke={ink} strokeWidth="6" />

      {/* корпус */}
      <path d="M128 262h164c18 0 30 12 30 30v110H98V292c0-18 12-30 30-30z" fill="#2563EB" />
      <g clipPath="url(#m-body)">
        <rect x="250" y="262" width="80" height="150" fill="url(#m-dots)" />
      </g>
      <path d="M128 262h164c18 0 30 12 30 30v110H98V292c0-18 12-30 30-30z" fill="none" stroke={ink} strokeWidth="7" strokeLinejoin="round" />

      {/* руки */}
      <path d="M104 300c-34 14-46 52-30 84" stroke={ink} strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M104 300c-34 14-46 52-30 84" stroke="#fff" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M316 300c34 14 46 52 30 84" stroke={ink} strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M316 300c34 14 46 52 30 84" stroke="#fff" strokeWidth="13" strokeLinecap="round" fill="none" />

      {/* журнал CHEATAI в руках */}
      <g transform="rotate(-4 210 370)">
        <path d="M70 320l140 18v96L70 418z" fill="#FFDE00" stroke={ink} strokeWidth="7" strokeLinejoin="round" />
        <path d="M350 320l-140 18v96l140-16z" fill="#fff" stroke={ink} strokeWidth="7" strokeLinejoin="round" />
        <path d="M70 320l140 18v96L70 418z" fill="url(#m-dots)" opacity=".7" />
        <text x="140" y="378" textAnchor="middle" fontFamily="'Unbounded Variable', 'Arial Black', sans-serif" fontWeight="900" fontSize="27" fill={ink} transform="rotate(7 140 378)">
          AI!
        </text>
        <path d="M232 360l96-11M232 378l96-11M232 396l70-8" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        <path d="M232 414l40-5" stroke="#FF3838" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* кулаки */}
      <circle cx="74" cy="384" r="20" fill="#fff" stroke={ink} strokeWidth="7" />
      <circle cx="346" cy="384" r="20" fill="#fff" stroke={ink} strokeWidth="7" />
    </svg>
  )
}
