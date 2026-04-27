import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFeaturedBooks } from '@/hooks/useBooks'
import { BookCard } from '@/components/books/BookCard'
import { BookCardSkeleton } from '@/components/ui/SkeletonLoader'
import { ArrowRight } from 'lucide-react'

export function FeaturedBooks() {
  const { data: books, isLoading } = useFeaturedBooks()

  return (
    <section className="py-24 px-6" aria-labelledby="featured-books-heading">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-500 font-sans mb-3">
              Collections
            </p>
            <h2
              id="featured-books-heading"
              className="font-display text-[clamp(2rem,5vw,3.5rem)] text-ink-50 leading-none"
            >
              Where to start
            </h2>
          </div>
          <Link
            to="/books"
            className="hidden sm:flex items-center gap-2 text-sm font-sans text-ink-400
                       hover:text-amber-500 transition-colors"
          >
            All {books?.length ? `${books.length} collections` : 'collections'}
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <BookCardSkeleton key={i} />)
            : books?.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))
          }
        </div>

        <Link
          to="/books"
          className="sm:hidden mt-8 flex items-center justify-center gap-2 text-sm font-sans
                     text-ink-400 hover:text-amber-500 transition-colors"
        >
          View all collections <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}
