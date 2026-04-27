export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SearchResult {
  books: BookSearchResult[]
  posts: PostSearchResult[]
}

export interface BookSearchResult {
  id: string
  title: string
  slug: string
  subtitle?: string | null
  description: string
  cover_image_url: string
  relevance: number
}

export interface PostSearchResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  published_at: string | null
  relevance: number
}

export type SortOrder = 'asc' | 'desc'

export interface BooksFilter {
  search?: string
  featured?: boolean
  year?: number
  sortBy?: 'created_at' | 'view_count' | 'download_count' | 'title'
  sortOrder?: SortOrder
  page?: number
  pageSize?: number
}

export interface BlogFilter {
  search?: string
  tags?: string[]
  category?: string
  sortBy?: 'published_at' | 'view_count' | 'like_count'
  sortOrder?: SortOrder
  page?: number
  pageSize?: number
}
