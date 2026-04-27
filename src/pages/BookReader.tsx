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

      {/*
        Full-viewport reading surface — always dark, fills 100dvh.
        PDFViewer uses h-full + flex-col to fill the remaining space.
        No max-width, no padding: the PDF itself handles sizing internally.
      */}
      <div
        className="flex flex-col overflow-hidden"
        style={{ height: '100dvh', background: '#111' }}
      >
        {/* Top bar */}
        <div
          className="flex-none flex items-center gap-3 px-4 py-3 border-b"
          style={{ background: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <Link
            to={`/books/${book.slug}`}
            className="flex items-center gap-2 text-sm transition-colors font-sans"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <ArrowLeft size={15} />
            {book.title}
          </Link>
        </div>

        {/* Viewer fills every remaining pixel */}
        <div className="flex-1 min-h-0">
          <PDFViewer book={book} />
        </div>
      </div>
    </>
  )
}
