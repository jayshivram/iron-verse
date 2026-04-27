import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PDFViewer } from '@/components/books/PDFViewer'
import { useBook } from '@/hooks/useBooks'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { ArrowLeft } from 'lucide-react'
import { SITE_NAME } from '@/utils/constants'

export default function BookReader() {
  const { slug } = useParams<{ slug: string }>()
  const { data: book, isLoading } = useBook(slug!)

  if (isLoading) return <PageLoader />
  if (!book) return <Navigate to="/books" replace />

  return (
    <>
      <Helmet>
        <title>Reading: {book.title} — {SITE_NAME}</title>
      </Helmet>

      {/* Force dark palette for the entire reader regardless of site theme */}
      <div className="dark bg-ink-950 min-h-screen">
        {/* Minimal top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-4 px-4 py-3 bg-ink-950/70 backdrop-blur-md backdrop-saturate-150 border-b border-ink-800/60">
          <Link
            to={`/books/${book.slug}`}
            className="flex items-center gap-2 text-sm text-ink-400 hover:text-ink-100 transition-colors font-sans"
          >
            <ArrowLeft size={15} />
            {book.title}
          </Link>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <PDFViewer book={book} />
        </div>
      </div>
    </>
  )
}
