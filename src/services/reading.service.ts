import { supabase } from './supabase'
import type { ReadingProgress } from '@/types/database.types'

export const readingService = {
  async getProgress(userId: string, bookId: string): Promise<ReadingProgress | null> {
    const { data } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single()
    return data as ReadingProgress | null
  },

  async getAllProgress(userId: string): Promise<ReadingProgress[]> {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*, book:books(id, title, slug, cover_image_url)')
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false })
    if (error) return []
    return (data as ReadingProgress[]) || []
  },

  async saveProgress(userId: string, bookId: string, currentPage: number, totalPages: number) {
    const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0
    const { error } = await supabase.from('reading_progress').upsert(
      {
        user_id: userId,
        book_id: bookId,
        current_page: currentPage,
        percentage,
        last_read_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,book_id' },
    )
    if (error) throw error
  },
}
