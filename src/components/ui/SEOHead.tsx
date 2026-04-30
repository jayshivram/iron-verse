/**
 * SEOHead — drop-in replacement for bare <Helmet> across all pages.
 *
 * Outputs:
 *  - <title> + <meta description>
 *  - Canonical URL
 *  - Open Graph (og:*) — Facebook, WhatsApp, LinkedIn, Discord
 *  - Twitter / X Card
 *  - Optional JSON-LD structured data
 */
import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://iron-verse-poetry.vercel.app'
const SITE_NAME = 'Iron Verse'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/ui/og-cover.webp`

interface SEOHeadProps {
  /** Page <title> — will appear as "Title — Iron Verse" */
  title: string
  /** Keep as-is (no suffix appended) when true */
  titleExact?: boolean
  description: string
  /** Absolute URL for this page — used for canonical + og:url */
  path?: string
  /** Absolute URL for the OG share image (1200×630 recommended) */
  image?: string
  imageAlt?: string
  /** 'website' | 'article' | 'book' */
  type?: string
  /** Extra JSON-LD objects to inject */
  jsonLd?: object | object[]
  /** Published ISO date (for articles/books) */
  publishedAt?: string
  /** Modified ISO date */
  modifiedAt?: string
  /** Author name */
  author?: string
  /** Extra keywords */
  keywords?: string[]
  /** Set to false to stop indexing (e.g. admin pages) */
  noIndex?: boolean
}

export function SEOHead({
  title,
  titleExact = false,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  type = 'website',
  jsonLd,
  publishedAt,
  modifiedAt,
  author = 'Iron Heist',
  keywords = [],
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = titleExact ? title : `${title} — ${SITE_NAME}`
  const canonicalUrl = `${SITE_URL}${path}`
  const resolvedImageAlt = imageAlt || fullTitle

  const baseKeywords = [
    'Iron Heist', 'Iron Verse', 'poetry', 'free poetry', 'poetry books',
    ...keywords,
  ].join(', ')

  const jsonLdScripts = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : []

  return (
    <Helmet>
      {/* ── Title & Description ──────────────────────────────────────────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      {keywords.length > 0 && <meta name="keywords" content={baseKeywords} />}
      <meta
        name="robots"
        content={
          noIndex
            ? 'noindex, nofollow'
            : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        }
      />

      {/* ── Canonical ───────────────────────────────────────────────────── */}
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph ──────────────────────────────────────────────────── */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={resolvedImageAlt} />
      <meta property="og:locale" content="en_US" />
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
      {type === 'article' && <meta property="article:author" content={author} />}

      {/* ── Twitter / X Card ────────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={resolvedImageAlt} />

      {/* ── JSON-LD Structured Data ─────────────────────────────────────── */}
      {jsonLdScripts.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
