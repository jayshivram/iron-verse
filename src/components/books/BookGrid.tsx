import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { BookCard } from './BookCard'
import { BookCardSkeleton } from '@/components/ui/SkeletonLoader'
import { Pagination } from '@/components/ui/Pagination'
import { useBooks } from '@/hooks/useBooks'
import { useDebouncedValue } from '@/hooks/useDebounce'
import { LayoutGrid, List, Search, BookOpen } from 'lucide-react'
import type { BooksFilter } from '@/types/api.types'
import { BOOKS_PER_PAGE } from '@/utils/constants'
import { cn } from '@/utils/cn'

export function BookGrid() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<BooksFilter['sortBy']>('created_at')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const debouncedSearch = useDebouncedValue(search, 350)

  const { data, isLoading } = useBooks({
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder: 'desc',
    page,
    pageSize: BOOKS_PER_PAGE,
  })

  const books = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search poetry collections..."
            leftIcon={<Search size={16} />}
            aria-label="Search books"
          />
        </div>
        <div className="flex items-center gap-2 self-start">
          <Select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as BooksFilter['sortBy']); setPage(1) }}
            options={[
              { value: 'created_at', label: 'Newest' },
              { value: 'view_count', label: 'Most read' },
              { value: 'download_count', label: 'Most downloaded' },
              { value: 'title', label: 'A to Z' },
            ]}
            className="w-40"
            aria-label="Sort by"
          />

          {/* View toggle */}
          <div className="flex rounded-md border border-ink-700 overflow-hidden">
            <button
              onClick={() => setView('grid')}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              className={cn(
                'w-9 h-9 flex items-center justify-center transition-colors',
                view === 'grid' ? 'bg-amber-500 text-ink-950' : 'text-ink-400 hover:text-ink-100',
              )}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              aria-label="List view"
              aria-pressed={view === 'list'}
              className={cn(
                'w-9 h-9 flex items-center justify-center transition-colors',
                view === 'list' ? 'bg-amber-500 text-ink-950' : 'text-ink-400 hover:text-ink-100',
              )}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className={cn(
          view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
            : 'space-y-3',
        )}>
          {Array.from({ length: 9 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen size={40} className="text-ink-700 mb-4" />
          <p className="font-serif text-xl text-ink-300">No books found</p>
          <p className="text-sm text-ink-500 font-sans mt-2 max-w-xs">
            {search ? `Nothing matched "${search}". Try a different search.` : 'No books available right now.'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="btn-secondary mt-4 text-sm">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
              : 'space-y-2',
          )}
        >
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} view={view} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-10"
        />
      )}
    </div>
  )
}
