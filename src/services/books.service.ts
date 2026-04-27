import { supabase } from './supabase'
import type { Book } from '@/types/database.types'
import type { BooksFilter, PaginatedResponse } from '@/types/api.types'
import { BOOKS_PER_PAGE } from '@/utils/constants'
import {
  isSupabaseConfigured,
  getStaticBooks,
  getStaticFeaturedBooks,
  getStaticBookBySlug,
  STATIC_BOOKS,
} from '@/data/books.static'

// ─── helpers for in-memory static filtering ───────────────────────────────────

function filterAndPageStatic(
  books: Book[],
  filters: BooksFilter,
): PaginatedResponse<Book> {
  const {
    search,
    featured,
    year,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = BOOKS_PER_PAGE,
  } = filters

  let result = books.filter((b) => b.is_published)

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q),
    )
  }
  if (featured !== undefined) result = result.filter((b) => b.is_featured === featured)
  if (year) result = result.filter((b) => b.published_year === year)

  result.sort((a, b) => {
    const valA = a[sortBy as keyof Book] ?? ''
    const valB = b[sortBy as keyof Book] ?? ''
    const cmp = String(valA).localeCompare(String(valB))
    return sortOrder === 'asc' ? cmp : -cmp
  })

  const count = result.length
  const slice = result.slice((page - 1) * pageSize, page * pageSize)

  return {
    data: slice,
    count,
    page,
    pageSize,
    totalPages: Math.ceil(count / pageSize),
  }
}

// ─── service ──────────────────────────────────────────────────────────────────

export const booksService = {
  async getBooks(filters: BooksFilter = {}): Promise<PaginatedResponse<Book>> {
    if (!isSupabaseConfigured()) {
      return filterAndPageStatic(getStaticBooks(), filters)
    }

    const {
      search,
      featured,
      year,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      pageSize = BOOKS_PER_PAGE,
    } = filters

    let query = supabase
      .from('books')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (featured !== undefined) {
      query = query.eq('is_featured', featured)
    }
    if (year) {
      query = query.eq('published_year', year)
    }

    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1)

    const { data, error, count } = await query
    if (error || !data?.length) {
      // Supabase configured but table empty — still show static data
      return filterAndPageStatic(getStaticBooks(), filters)
    }

    return {
      data: (data as Book[]) || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  },

  async getFeaturedBooks(): Promise<Book[]> {
    if (!isSupabaseConfigured()) return getStaticFeaturedBooks()

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6)
    if (error || !data?.length) return getStaticFeaturedBooks()
    return (data as Book[]) || []
  },

  async getBookBySlug(slug: string): Promise<Book | null> {
    if (!isSupabaseConfigured()) return getStaticBookBySlug(slug)

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (error || !data) return getStaticBookBySlug(slug)
    return data as Book
  },

  async getAllBooks(): Promise<Book[]> {
    if (!isSupabaseConfigured()) return STATIC_BOOKS

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data?.length) return STATIC_BOOKS
    return (data as Book[]) || []
  },

  async incrementViewCount(bookId: string) {
    await supabase.rpc('increment', { table_name: 'books', row_id: bookId, column_name: 'view_count' })
    // Fallback direct increment
    const { data } = await supabase.from('books').select('view_count').eq('id', bookId).single()
    if (data) {
      await supabase
        .from('books')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', bookId)
    }
  },

  async incrementDownloadCount(bookId: string) {
    const { data } = await supabase.from('books').select('download_count').eq('id', bookId).single()
    if (data) {
      await supabase
        .from('books')
        .update({ download_count: (data.download_count || 0) + 1 })
        .eq('id', bookId)
    }
  },

  async createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'download_count'>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .insert({ ...book, view_count: 0, download_count: 0 })
      .select()
      .single()
    if (error) throw error
    return data as Book
  },

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Book
  },

  async deleteBook(id: string) {
    const { error } = await supabase.from('books').delete().eq('id', id)
    if (error) throw error
  },
}
