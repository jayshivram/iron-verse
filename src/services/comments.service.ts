import { supabase } from './supabase'
import type { Comment } from '@/types/database.types'

export const commentsService = {
  async getComments(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true })
    if (error) throw error

    const flat = (data as Comment[]) || []
    // Build nested tree
    const map: Record<string, Comment> = {}
    const roots: Comment[] = []
    for (const c of flat) {
      map[c.id] = { ...c, replies: [] }
    }
    for (const c of flat) {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies = [...(map[c.parent_id].replies || []), map[c.id]]
      } else {
        roots.push(map[c.id])
      }
    }
    return roots
  },

  async getAllComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*, post:blog_posts(title, slug)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async submitComment(comment: {
    post_id: string
    parent_id?: string | null
    author_name: string
    author_email?: string
    author_website?: string
    content: string
  }) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ ...comment, is_approved: false })
      .select()
      .single()
    if (error) throw error
    return data as Comment
  },

  async approveComment(id: string) {
    const { error } = await supabase.from('comments').update({ is_approved: true }).eq('id', id)
    if (error) throw error
  },

  async deleteComment(id: string) {
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) throw error
  },

  async markSpam(id: string) {
    const { error } = await supabase.from('comments').update({ is_spam: true, is_approved: false }).eq('id', id)
    if (error) throw error
  },
}
