import { supabase } from './supabase'
import { getSessionId } from '@/utils/helpers'

export const analyticsService = {
  async getAdminStats() {
    const [books, posts, comments, subscribers, messages] = await Promise.all([
      supabase.from('books').select('id, view_count, download_count').eq('is_published', true),
      supabase.from('blog_posts').select('id, view_count, like_count').eq('is_published', true),
      supabase.from('comments').select('id, is_approved'),
      supabase.from('newsletter_subscribers').select('id, is_active').eq('is_active', true),
      supabase.from('contact_messages').select('id, is_read'),
    ])

    const totalBooks = books.data?.length || 0
    const totalPosts = posts.data?.length || 0
    const totalViews = (books.data || []).reduce((s, b) => s + (b.view_count || 0), 0) +
                      (posts.data || []).reduce((s, p) => s + (p.view_count || 0), 0)
    const totalDownloads = (books.data || []).reduce((s, b) => s + (b.download_count || 0), 0)
    const pendingComments = (comments.data || []).filter((c) => !c.is_approved).length
    const totalSubscribers = subscribers.data?.length || 0
    const unreadMessages = (messages.data || []).filter((m) => !m.is_read).length

    return {
      totalBooks,
      totalPosts,
      totalViews,
      totalDownloads,
      pendingComments,
      totalSubscribers,
      unreadMessages,
    }
  },

  async likePost(postId: string): Promise<boolean> {
    const sessionId = getSessionId()
    const { error } = await supabase.from('post_likes').insert({ post_id: postId, session_id: sessionId })
    if (error) return false
    // Increment like_count
    const { data } = await supabase.from('blog_posts').select('like_count').eq('id', postId).single()
    if (data) {
      await supabase.from('blog_posts').update({ like_count: (data.like_count || 0) + 1 }).eq('id', postId)
    }
    return true
  },

  async hasLikedPost(postId: string): Promise<boolean> {
    const sessionId = getSessionId()
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('session_id', sessionId)
      .single()
    return !!data
  },

  async unlikePost(postId: string): Promise<void> {
    const sessionId = getSessionId()
    await supabase.from('post_likes').delete().eq('post_id', postId).eq('session_id', sessionId)
    const { data } = await supabase.from('blog_posts').select('like_count').eq('id', postId).single()
    if (data && (data.like_count || 0) > 0) {
      await supabase.from('blog_posts').update({ like_count: data.like_count - 1 }).eq('id', postId)
    }
  },
}
