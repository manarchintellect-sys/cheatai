export type CoverSpec = { bg: string; icon: string; accent: string }

export type SeedArticle = {
  title: string
  slug: string
  section: 'news' | 'articles' | 'guides' | 'business'
  category: string
  tags: string[]
  excerpt: string
  content: unknown
  cover: CoverSpec
  featured?: boolean
  hot?: boolean
  faq?: { question: string; answer: string }[]
  sources?: { title: string; url: string }[]
  tools?: string[]
}
