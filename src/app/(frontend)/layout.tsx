import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import '@fontsource/jetbrains-mono/latin-500.css'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { DEMO_MODE, SITE_URL, getSettings } from '@/lib/payload'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFDE00' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => null)
  const description = s?.description || 'Искусственный интеллект простым языком: нейросети, инструменты, промпты и гайды.'
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: 'CHEATAI — искусственный интеллект простым языком', template: '%s — CHEATAI' },
    description,
    applicationName: 'CHEATAI',
    openGraph: {
      type: 'website',
      siteName: 'CHEATAI',
      locale: 'ru_RU',
      url: SITE_URL,
      title: 'CHEATAI — ЧИТАЙ БУДУЩЕЕ',
      description,
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'CHEATAI' }],
    },
    twitter: { card: 'summary_large_image', title: 'CHEATAI — ЧИТАЙ БУДУЩЕЕ', description, images: ['/og-default.png'] },
    robots: DEMO_MODE ? { index: false, follow: false } : { index: true, follow: true, 'max-image-preview': 'large' },
    verification: {
      google: s?.analytics?.googleVerification || undefined,
      yandex: s?.analytics?.yandexVerification || undefined,
    },
    formatDetection: { telephone: false },
  }
}

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings().catch(() => null)
  const metrika = s?.analytics?.yandexMetrikaId
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href="/fonts/unbounded-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/golos-text-cyrillic-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="CHEATAI" href="/rss.xml" />
      </head>
      <body className="min-h-dvh">
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `${SITE_URL}/#org`,
              name: 'CHEATAI',
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              parentOrganization: { '@type': 'Organization', name: s?.organization?.name || 'BONGO GROUP', url: s?.organization?.url || undefined },
              sameAs: (s?.socials ?? []).map((x) => x.url),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              name: 'CHEATAI',
              alternateName: 'ЧИТАЙ',
              url: SITE_URL,
              inLanguage: 'ru-RU',
              publisher: { '@id': `${SITE_URL}/#org` },
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
                'query-input': 'required name=search_term_string',
              },
            },
          ]}
        />
        <Header demo={DEMO_MODE} />
        <main id="main">{children}</main>
        <Footer socials={s?.socials ?? []} />
        {metrika && !DEMO_MODE && (
          <Script id="ym" strategy="lazyOnload">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${Number(metrika)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
          </Script>
        )}
      </body>
    </html>
  )
}
