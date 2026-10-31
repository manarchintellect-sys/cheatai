import Image from 'next/image'
import { getActiveAd, imgUrl } from '@/lib/payload'

/**
 * Рекламное место. Показывается только если в CMS есть активный слот.
 * Маркировка по 38-ФЗ: пометка «Реклама», рекламодатель, erid в ссылке и подписи.
 */
export async function AdSlot({ placement, className = '' }: { placement: string; className?: string }) {
  const ad = await getActiveAd(placement)
  if (!ad) return null
  const external = ad.kind === 'external'
  let href = ad.url
  if (ad.erid) {
    try {
      const u = new URL(ad.url)
      u.searchParams.set('erid', ad.erid)
      href = u.toString()
    } catch {}
  }
  const img = imgUrl(ad.image, 'card')
  return (
    <aside aria-label="Реклама" className={`panel relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b-2 border-line px-4 py-1.5 text-[0.7rem] text-muted">
        <span className="font-bold uppercase tracking-wider">Реклама</span>
        {(ad.advertiser || ad.erid) && (
          <span className="truncate">
            {ad.advertiser}
            {ad.erid ? ` · erid: ${ad.erid}` : ''}
          </span>
        )}
      </div>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'sponsored noopener noreferrer' : undefined}
        className="group flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
      >
        {img && <Image src={img} alt="" width={240} height={126} className="rounded-xl border-2 border-line object-cover" />}
        <span className="flex-1">
          <span className="block font-display text-lg font-black">{ad.title}</span>
          {ad.text && <span className="mt-1 block text-muted">{ad.text}</span>}
        </span>
        <span className="btn btn-yellow self-start">{ad.cta || 'Подробнее'}</span>
      </a>
    </aside>
  )
}
