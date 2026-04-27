import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookmarksService } from '@/services/bookmarks.service'
import { queryKeys } from '@/lib/react-query'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useBookmarks() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.bookmarks.byUser(user?.id ?? ''),
    queryFn: () => bookmarksService.getUserBookmarks(user!.id),
    enabled: !!user,
  })
}

export function useIsBookmarked(bookId: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.bookmarks.check(user?.id ?? '', bookId),
    queryFn: () => bookmarksService.isBookmarked(user!.id, bookId),
    enabled: !!user && !!bookId,
  })
}

export function useToggleBookmark(bookId: string) {
  const { user } = useAuth()
  const qc = useQueryClient()

  const add = useMutation({
    mutationFn: () => bookmarksService.addBookmark(user!.id, bookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.byUser(user?.id ?? '') })
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.check(user?.id ?? '', bookId) })
      toast.success('Bookmarked')
    },
  })

  const remove = useMutation({
    mutationFn: () => bookmarksService.removeBookmark(user!.id, bookId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.byUser(user?.id ?? '') })
      qc.invalidateQueries({ queryKey: queryKeys.bookmarks.check(user?.id ?? '', bookId) })
      toast.success('Bookmark removed')
    },
  })

  return { add, remove }
}
