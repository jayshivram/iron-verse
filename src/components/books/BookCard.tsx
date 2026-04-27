import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Eye } from 'lucide-react'
import { formatCount } from '@/utils/formatters'
import type { Book } from '@/types/database.types'

interface BookCardProps {
  book: Book
  index?: number
  view?: 'grid' | 'list'
}

export function BookCard({ book, index = 0, view = 'grid' }: BookCardProps) {
  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      >
        <Link
          to={`/books/${book.slug}`}
          className="flex gap-5 p-4 rounded-lg border border-ink-800
                     hover:border-ink-600 hover:bg-ink-900 transition-all duration-250 group"
        >
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-20 h-28 object-cover rounded-md shrink-0 ring-1 ring-ink-700"
            loading="lazy"
          />
          <div className="flex-1 min-w-0 py-1">
            <h3 className="font-serif text-lg font-medium text-ink-50 group-hover:text-amber-500 transition-colors leading-tight">
              {book.title}
            </h3>
            {book.subtitle && (
              <p className="text-sm text-ink-400 font-sans mt-0.5">{book.subtitle}</p>
            )}
            <p className="text-sm text-ink-400 font-sans mt-2 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-ink-500 font-sans">
              {book.published_year && <span>{book.published_year}</span>}
              <span className="flex items-center gap-1">
                <Eye size={12} /> {formatCount(book.view_count)}
              </span>
              <span className="flex items-center gap-1">
                <Download size={12} /> {formatCount(book.download_count)}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: 'easeOut' }}
      className="group"
    >
      <Link to={`/books/${book.slug}`} className="block">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-lg mb-4 ring-1 ring-ink-800
                        group-hover:ring-ink-600 transition-all duration-300">
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover transition-transform duration-500
                       group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-ink-950/70 flex items-end justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
            <span className="text-xs font-sans font-medium text-amber-500
                             border border-amber-500 rounded-full px-3 py-1">
              Read Free
            </span>
          </div>
          {book.is_featured && (
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider
                               bg-amber-500 text-ink-950 px-2 py-0.5 rounded">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="font-serif text-base font-medium text-ink-100
                       group-hover:text-amber-500 transition-colors duration-200 leading-snug">
          {book.title}
        </h3>
        {book.subtitle && (
          <p className="text-xs text-ink-500 font-sans mt-0.5">{book.subtitle}</p>
        )}
        <p className="text-sm text-ink-400 font-sans mt-1.5 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
        <div className="flex items-center gap-3 mt-2 text-xs text-ink-600 font-sans">
          {book.published_year && <span>{book.published_year}</span>}
          <span className="flex items-center gap-1">
            <Download size={11} />
            {formatCount(book.download_count)}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
