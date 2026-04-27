import { useQuery } from '@tanstack/react-query'
import { searchService } from '@/services/search.service'
import { queryKeys } from '@/lib/react-query'
import { useDebouncedValue } from './useDebounce'

export function useSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, 400)

  return useQuery({
    queryKey: queryKeys.search.query(debouncedQuery),
    queryFn: () => searchService.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    placeholderData: (prev) => prev,
  })
}
