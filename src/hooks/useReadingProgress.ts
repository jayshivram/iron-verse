import { useQuery, useMutation } from '@tanstack/react-query'
import { readingService } from '@/services/reading.service'
import { queryKeys } from '@/lib/react-query'
import { useAuth } from './useAuth'
import { useCallback, useRef } from 'react'
import { READING_SAVE_INTERVAL } from '@/utils/constants'

export function useReadingProgress(bookId: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.reading.progress(user?.id ?? '', bookId),
    queryFn: () => readingService.getProgress(user!.id, bookId),
    enabled: !!user && !!bookId,
  })
}

export function useSaveReadingProgress(bookId: string, totalPages: number) {
  const { user } = useAuth()
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useMutation({
    mutationFn: (currentPage: number) => {
      if (!user) return Promise.resolve()
      return readingService.saveProgress(user.id, bookId, currentPage, totalPages)
    },
  })

  const throttledSave = useCallback(
    (page: number) => {
      if (!user) return
      if (throttleRef.current) clearTimeout(throttleRef.current)
      throttleRef.current = setTimeout(() => {
        save.mutate(page)
      }, READING_SAVE_INTERVAL)
    },
    [user, save],
  )

  return throttledSave
}
