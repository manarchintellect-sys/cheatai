import sharp from 'sharp'
import type { CoverSpec } from './data/types'

/* Оригинальные комикс-обложки 1200×630: полутона, лучи, «взрыв» и пиктограмма темы. Без текста. */
const ICON: Record<string, string> = {
  rocket: '<path d="M12 2c4 3 6 7 5 12l-3 3h-4l-3-3c-1-5 1-9 5-12z"/><circle cx="12" cy="9" r="2"/><path d="M7 14l-3 3 2 3 3-2M17 14l3 3-2 3-3-2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9h8M8 12h5"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  brain: '<path d="M9 4a3 3 0 00-3 3 3 3 0 00-2 5 3 3 0 002 5 3 3 0 003 3h1V4H9zM15 4a3 3 0 013 3 3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-3 3h-1V4h1z"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  video: '<rect x="2.5" y="5" width="14" height="14" rx="2"/><path d="M16.5 10l5-3v10l-5-3z"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  news: '<rect x="3" y="4" width="15" height="16" rx="2"/><path d="M18 8h3v10a2 2 0 01-2 2M7 8h7M7 12h7M7 16h4"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  spark: '<path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2z"/>',
}

const burst = (cx: number, cy: number, r1: number, r2: number, n: number, rot = 0) => {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? r2 : r1
    const a = (Math.PI * i) / n + rot
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const rays = (cx: number, cy: number, n: number) => {
  let out = ''
  for (let i = 0; i < n; i++) {
    const a1 = (2 * Math.PI * i) / n
    const a2 = a1 + Math.PI / n / 1.4
    const R = 1400
    out += `<polygon points="${cx},${cy} ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)} ${cx + R * Math.cos(a2)},${cy + R * Math.sin(a2)}"/>`
  }
  return out
}

const left = (v: number, spec: CoverSpec) => {
  const ink = '#111111'
  if (v === 1)
    return `<g stroke="${ink}" stroke-width="9" stroke-linejoin="round">
      <ellipse cx="270" cy="230" rx="215" ry="140" fill="#ffffff"/>
      <path d="M170 350 L140 450 L250 365 Z" fill="#ffffff"/>
    </g>
    <path d="M176 352 L246 362" stroke="#ffffff" stroke-width="12"/>
    <g stroke="${ink}" stroke-width="16" stroke-linecap="round"><path d="M150 190 L390 190"/><path d="M150 240 L350 240"/><path d="M150 290 L280 290"/></g>
    <g stroke="${ink}" stroke-width="9" stroke-linejoin="round"><path d="M70 480 L430 470 L440 580 L60 590 Z" fill="${spec.accent}"/></g>`
  if (v === 2)
    return `<g stroke="${ink}" stroke-width="9" stroke-linejoin="round">
      <path d="M60 70 L220 60 L230 570 L70 580 Z" fill="${spec.accent}"/>
      <path d="M260 60 L470 75 L455 330 L250 320 Z" fill="#ffffff"/>
      <path d="M255 360 L455 370 L465 570 L265 560 Z" fill="#ffffff"/>
    </g>
    <path d="M60 70 L220 60 L230 570 L70 580 Z" fill="url(#d2)"/>
    <g stroke="${ink}" stroke-width="14" stroke-linecap="round"><path d="M300 130 L420 138"/><path d="M300 180 L400 186"/><path d="M300 230 L370 234"/></g>
    <circle cx="360" cy="465" r="55" fill="#FFDE00" stroke="${ink}" stroke-width="9"/>`
  return `<g stroke="${ink}" stroke-width="9" stroke-linejoin="round">
    <path d="M70 90 L470 60 L450 300 L60 320 Z" fill="#ffffff"/>
    <path d="M60 360 L440 340 L460 560 L80 575 Z" fill="${spec.accent}"/>
  </g>
  <path d="M60 360 L440 340 L460 560 L80 575 Z" fill="url(#d2)"/>
  <g stroke="${ink}" stroke-width="16" stroke-linecap="round">
    <path d="M120 140 L400 122"/><path d="M118 190 L360 176"/><path d="M116 240 L300 230"/>
  </g>`
}

export function coverSvg(spec: CoverSpec, seed = 0) {
  const dark = spec.bg === '#111111'
  const ink = '#111111'
  const cx = 800 + (seed % 3) * 30
  const cy = 315
  const dot = dark ? 'rgba(255,255,255,0.16)' : 'rgba(17,17,17,0.2)'
  const ray = dark ? 'rgba(255,255,255,0.07)' : 'rgba(17,17,17,0.08)'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="d" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill="${dot}"/></pattern>
    <pattern id="d2" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2" fill="rgba(17,17,17,0.35)"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="${spec.bg}"/>
  <g fill="${ray}">${rays(cx, cy, 22)}</g>
  <rect width="1200" height="630" fill="url(#d)"/>
${left(seed % 3, spec)}
  <!-- «взрыв» с пиктограммой -->
  <polygon points="${burst(cx + 12, cy + 14, 270, 200, 14, 0.12)}" fill="${ink}"/>
  <polygon points="${burst(cx, cy, 270, 200, 14, 0.12)}" fill="${spec.accent === ink ? '#FFDE00' : spec.accent}" stroke="${ink}" stroke-width="10" stroke-linejoin="round"/>
  <circle cx="${cx + 10}" cy="${cy + 10}" r="150" fill="${ink}"/>
  <circle cx="${cx}" cy="${cy}" r="150" fill="#ffffff" stroke="${ink}" stroke-width="10"/>
  <g transform="translate(${cx - 102} ${cy - 102}) scale(8.5)" fill="none" stroke="${ink}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${ICON[spec.icon] ?? ICON.spark}</g>
  <!-- звёзды -->
  <polygon points="${burst(1100, 90, 40, 16, 5, -Math.PI / 2)}" fill="#ffffff" stroke="${ink}" stroke-width="7" stroke-linejoin="round"/>
  <polygon points="${burst(560, 560, 30, 12, 5, -Math.PI / 2)}" fill="#FFDE00" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>
  <rect x="5" y="5" width="1190" height="620" fill="none" stroke="${ink}" stroke-width="10"/>
</svg>`
}

export const coverPng = (spec: CoverSpec, seed = 0) => sharp(Buffer.from(coverSvg(spec, seed))).png().toBuffer()
