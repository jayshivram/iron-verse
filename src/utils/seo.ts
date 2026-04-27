import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from './constants'

export interface SeoMeta {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  publishedAt?: string
  modifiedAt?: string
}

export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE_NAME
  return `${pageTitle} | ${SITE_NAME}`
}

export function buildMeta(meta: SeoMeta): SeoMeta & { fullTitle: string } {
  return {
    ...meta,
    fullTitle: buildTitle(meta.title),
    description: meta.description || SITE_DESCRIPTION,
    image: meta.image ? `${SITE_URL}${meta.image}` : `${SITE_URL}/images/ui/og-default.jpg`,
    type: meta.type || 'website',
  }
}

export function buildCanonical(path: string): string {
  return `${SITE_URL}${path}`
}

export function buildBookJsonLd(book: {
  title: string
  description: string
  cover_image_url: string
  published_year: number | null
  slug: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description,
    image: `${SITE_URL}${book.cover_image_url}`,
    url: `${SITE_URL}/books/${book.slug}`,
    ...(book.published_year ? { datePublished: String(book.published_year) } : {}),
  }
}

export function buildBlogJsonLd(post: {
  title: string
  excerpt: string | null
  featured_image_url: string | null
  published_at: string | null
  slug: string
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || SITE_DESCRIPTION,
    image: post.featured_image_url ? `${SITE_URL}${post.featured_image_url}` : undefined,
    datePublished: post.published_at,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: 'The Poet',
    },
  }
}
