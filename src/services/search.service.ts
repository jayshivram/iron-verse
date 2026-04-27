import { supabase } from './supabase'
import type { SearchResult } from '@/types/api.types'

export const searchService = {
  async search(query: string): Promise<SearchResult> {
    if (!query.trim()) return { books: [], posts: [] }

    const [booksResult, postsResult] = await Promise.all([
      supabase.rpc('search_books', { search_query: query }),
      supabase.rpc('search_blog_posts', { search_query: query }),
    ])

    return {
      books: booksResult.data || [],
      posts: postsResult.data || [],
    }
  },
}
