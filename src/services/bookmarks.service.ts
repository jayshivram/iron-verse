import { supabase } from './supabase'
import type { Bookmark } from '@/types/database.types'

export const bookmarksService = {
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*, book:books(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Bookmark[]) || []
  },

  async isBookmarked(userId: string, bookId: string): Promise<boolean> {
    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single()
    return !!data
  },

  async addBookmark(userId: string, bookId: string, notes?: string): Promise<Bookmark> {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert({ user_id: userId, book_id: bookId, notes: notes || null })
      .select()
      .single()
    if (error) throw error
    return data as Bookmark
  },

  async removeBookmark(userId: string, bookId: string) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId)
    if (error) throw error
  },
}
