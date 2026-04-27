import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildPageList(page, totalPages)

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="w-9 h-9 flex items-center justify-center rounded-md
                   border border-ink-700 text-ink-400 hover:border-amber-500
                   hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === null ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-ink-500">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-md border text-sm font-sans',
              'transition-colors duration-150',
              p === page
                ? 'border-amber-500 bg-amber-500 text-ink-950 font-semibold'
                : 'border-ink-700 text-ink-300 hover:border-ink-500 hover:text-ink-100',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center rounded-md
                   border border-ink-700 text-ink-400 hover:border-amber-500
                   hover:text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}

function buildPageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, null, total]
  if (current >= total - 3) return [1, null, total - 4, total - 3, total - 2, total - 1, total]
  return [1, null, current - 1, current, current + 1, null, total]
}
