import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useAuth } from '@/hooks/useAuth'
import { BookCard } from '@/components/books/BookCard'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SITE_NAME } from '@/utils/constants'
import { BookOpen, Bookmark } from 'lucide-react'

export default function Bookmarks() {
  const { user } = useAuth()
  const { data: bookmarks, isLoading } = useBookmarks()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <Bookmark size={40} className="text-ink-700 mb-4" />
        <h1 className="font-serif text-2xl text-ink-100 mb-2">Your bookmarks</h1>
        <p className="text-ink-400 font-sans text-sm mb-6 max-w-xs">
          Sign in to save books and pick up where you left off.
        </p>
        <Link to="/login" className="btn-primary">Sign in</Link>
      </div>
    )
  }

  const books = bookmarks?.map((b) => b.book).filter(Boolean) || []

  return (
    <>
      <Helmet>
        <title>Bookmarks — {SITE_NAME}</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <Breadcrumbs items={[{ label: 'Bookmarks', href: '/bookmarks' }]} />

        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-ink-50 leading-none mt-6 mb-10">
          Your bookmarks
        </h1>

        {isLoading ? (
          <p className="text-ink-500 font-sans text-sm">Loading...</p>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen size={40} className="text-ink-700 mb-4" />
            <p className="font-serif text-xl text-ink-300 mb-2">No bookmarks yet</p>
            <p className="text-ink-500 font-sans text-sm mb-6">
              Bookmark a book from its page and it'll appear here.
            </p>
            <Link to="/books" className="btn-secondary">Browse books</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book, i) => book && (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
