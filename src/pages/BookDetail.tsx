import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBook } from '@/hooks/useBooks'
import { BookmarkButton } from '@/components/books/BookmarkButton'
import { DownloadButton } from '@/components/books/DownloadButton'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { formatCount } from '@/utils/formatters'
import { Eye, Download, BookOpen, Tag, Quote } from 'lucide-react'
import { booksService } from '@/services/books.service'
import { useEffect } from 'react'
import { BOOK_QUOTES } from '@/data/quotes.static'
import { SEOHead } from '@/components/ui/SEOHead'

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: book, isLoading, isError } = useBook(slug!)
  const bookQuotes = BOOK_QUOTES.filter((q) => q.bookSlug === slug)

  useEffect(() => {
    if (book) {
      booksService.incrementViewCount(book.id)
    }
  }, [book?.id])

  if (isLoading) return <PageLoader />
  if (isError || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="font-serif text-2xl text-ink-100 mb-3">Book not found</h1>
        <p className="text-ink-500 font-sans text-sm mb-6">That collection doesn't exist or was removed.</p>
        <Link to="/books" className="btn-secondary">Browse all books</Link>
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={`${book.title} — Free Poetry by Iron Heist`}
        titleExact
        description={book.description || `Read ${book.title} — a free poetry collection by Iron Heist. Available to read online and download as a PDF.`}
        path={`/books/${book.slug}`}
        image={book.cover_image_url || undefined}
        imageAlt={`${book.title} cover — poetry by Iron Heist`}
        type="book"
        publishedAt={book.published_year ? `${book.published_year}-01-01` : undefined}
        keywords={[book.title, ...(book.tags || []), 'poetry book', 'free PDF', 'Iron Heist']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: book.title,
          description: book.description,
          url: `https://iron-verse-poetry.vercel.app/books/${book.slug}`,
          image: book.cover_image_url,
          datePublished: book.published_year ? `${book.published_year}` : undefined,
          author: {
            '@type': 'Person',
            name: 'Iron Heist',
            url: 'https://iron-verse-poetry.vercel.app/about',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Iron Verse',
            url: 'https://iron-verse-poetry.vercel.app',
          },
          inLanguage: 'en',
          isAccessibleForFree: true,
          genre: 'Poetry',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Books', href: '/books' },
            { label: book.title, href: `/books/${book.slug}` },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 lg:gap-16">
          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:sticky md:top-28 self-start"
          >
            <img
              src={book.cover_image_url}
              alt={`${book.title} cover`}
              className="w-full max-w-[280px] mx-auto md:mx-0 rounded-xl shadow-amber-lg ring-1 ring-ink-700"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {book.is_featured && (
              <span className="inline-block text-xs uppercase tracking-widest text-amber-500 font-sans mb-4">
                Featured collection
              </span>
            )}

            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-ink-50 leading-none mb-3">
              {book.title}
            </h1>

            {book.subtitle && (
              <p className="font-serif text-xl text-ink-400 mb-6">{book.subtitle}</p>
            )}

            {book.published_year && (
              <p className="text-sm text-ink-500 font-sans mb-6">{book.published_year}</p>
            )}

            <p className="font-sans text-ink-300 text-base leading-relaxed mb-8 max-w-xl">
              {book.description}
            </p>

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <Tag size={13} className="text-ink-500" />
                {book.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mb-10 text-sm text-ink-500 font-sans">
              <span className="flex items-center gap-1.5">
                <Eye size={15} /> {formatCount(book.view_count)} reads
              </span>
              <span className="flex items-center gap-1.5">
                <Download size={15} /> {formatCount(book.download_count)} downloads
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link to={`/books/${book.slug}/read`} className="btn-primary flex items-center gap-2 text-base py-3 px-6">
                <BookOpen size={18} />
                Read online
              </Link>
              <DownloadButton book={book} />
              <BookmarkButton bookId={book.id} />
            </div>

            {/* Verse snippets */}
            {bookQuotes.length > 0 && (
              <div className="mt-14">
                <div className="flex items-center gap-2 mb-6">
                  <Quote size={14} className="text-amber-500" />
                  <span className="text-xs uppercase tracking-widest text-amber-500 font-sans">
                    From the pages
                  </span>
                </div>
                <div className="space-y-4">
                  {bookQuotes.map((q, i) => (
                    <motion.blockquote
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                      className="border-l-2 border-amber-500/40 pl-4 py-1"
                    >
                      <p className="font-serif italic text-ink-200 leading-relaxed mb-1">
                        "{q.text}"
                      </p>
                      <footer className="text-xs text-ink-500 font-sans">— {q.poem}</footer>
                    </motion.blockquote>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}
