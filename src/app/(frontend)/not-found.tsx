import Link from 'next/link'
import { Mascot } from '@/components/brand/Mascot'
import { Bubble } from '@/components/ui/Comic'

export const metadata = { title: 'Страница не найдена', robots: { index: false } }

export default function NotFound() {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-line bg-yellow text-black">
      <div className="halftone-strong absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-[1100px] items-center gap-8 px-4 py-14 md:grid-cols-[1fr_340px] md:px-6 md:py-20">
        <div>
          <p className="font-display text-[clamp(5rem,4rem+8vw,10rem)] font-black leading-none tracking-tighter">404</p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase">Ой! Страница сбежала из комикса</h1>
          <p className="mt-4 max-w-md text-lg">Возможно, адрес изменился или материал ещё не опубликован. Попробуйте поиск или начните с главной.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-ink">
              На главную
            </Link>
            <Link href="/search" className="btn btn-paper !bg-white !text-black">
              Поиск
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-64 md:w-full">
          <Mascot className="w-full rotate-6" />
          <Bubble className="absolute -left-4 top-4 -rotate-6 text-xl">ХМ?!</Bubble>
        </div>
      </div>
    </section>
  )
}
