import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

export const queryKeys = {
  books: {
    all: ['books'] as const,
    list: (filters?: object) => ['books', 'list', filters] as const,
    detail: (slug: string) => ['books', 'detail', slug] as const,
    featured: () => ['books', 'featured'] as const,
  },
  blog: {
    all: ['blog'] as const,
    list: (filters?: object) => ['blog', 'list', filters] as const,
    detail: (slug: string) => ['blog', 'detail', slug] as const,
    recent: () => ['blog', 'recent'] as const,
    tags: () => ['blog', 'tags'] as const,
  },
  comments: {
    byPost: (postId: string) => ['comments', postId] as const,
  },
  bookmarks: {
    all: ['bookmarks'] as const,
    byUser: (userId: string) => ['bookmarks', userId] as const,
    check: (userId: string, bookId: string) => ['bookmarks', userId, bookId] as const,
  },
  reading: {
    byUser: (userId: string) => ['reading', userId] as const,
    progress: (userId: string, bookId: string) => ['reading', userId, bookId] as const,
  },
  profile: {
    byId: (id: string) => ['profile', id] as const,
  },
  admin: {
    stats: ['admin', 'stats'] as const,
    subscribers: ['admin', 'subscribers'] as const,
    messages: ['admin', 'messages'] as const,
    comments: ['admin', 'comments'] as const,
  },
  search: {
    query: (q: string) => ['search', q] as const,
  },
}
