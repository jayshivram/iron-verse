import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useIsBookmarked, useToggleBookmark } from '@/hooks/useBookmarks'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface BookmarkButtonProps {
  bookId: string
  className?: string
}

export function BookmarkButton({ bookId, className }: BookmarkButtonProps) {
  const { user } = useAuth()
  const { data: isBookmarked, isLoading } = useIsBookmarked(bookId)
  const { add, remove } = useToggleBookmark(bookId)

  if (!user) {
    return (
      <Link
        to="/login"
        className={cn('btn-ghost flex items-center gap-2 text-sm', className)}
        title="Sign in to bookmark"
      >
        <Bookmark size={16} />
        Bookmark
      </Link>
    )
  }

  const isPending = add.isPending || remove.isPending

  return (
    <button
      onClick={() => {
        if (isBookmarked) {
          remove.mutate()
        } else {
          add.mutate()
        }
      }}
      disabled={isLoading || isPending}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={!!isBookmarked}
      className={cn(
        'btn-ghost flex items-center gap-2 text-sm transition-colors',
        isBookmarked && 'text-amber-500 hover:text-amber-400',
        className,
      )}
    >
      {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  )
}
