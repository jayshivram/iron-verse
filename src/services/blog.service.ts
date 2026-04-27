import { supabase } from './supabase'
import type { BlogPost } from '@/types/database.types'
import type { BlogFilter, PaginatedResponse } from '@/types/api.types'
import { POSTS_PER_PAGE } from '@/utils/constants'
import { isSupabaseConfigured } from '@/data/books.static'

export const blogService = {
  async getPosts(filters: BlogFilter = {}): Promise<PaginatedResponse<BlogPost>> {
    if (!isSupabaseConfigured()) {
      return { data: [], count: 0, page: 1, pageSize: POSTS_PER_PAGE, totalPages: 0 }
    }
    const {
      search,
      tags,
      category,
      sortBy = 'published_at',
      sortOrder = 'desc',
      page = 1,
      pageSize = POSTS_PER_PAGE,
    } = filters

    let query = supabase
      .from('blog_posts')
      .select('*, author:profiles(id, full_name, avatar_url)', { count: 'exact' })
      .eq('is_published', true)

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }
    if (category) {
      query = query.eq('category', category)
    }

    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1)

    const { data, error, count } = await query
    if (error) throw error

    return {
      data: (data as BlogPost[]) || [],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  },

  async getRecentPosts(limit = 5): Promise<BlogPost[]> {
    if (!isSupabaseConfigured()) return []
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, published_at, reading_time_minutes')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) return []
    return (data as BlogPost[]) || []
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, author:profiles(id, full_name, avatar_url, bio)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (error) return null
    return data as BlogPost
  },

  async getRelatedPosts(postId: string, tags: string[], limit = 3): Promise<BlogPost[]> {
    if (!tags.length) {
      const { data } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image_url, published_at, reading_time_minutes')
        .eq('is_published', true)
        .neq('id', postId)
        .order('published_at', { ascending: false })
        .limit(limit)
      return (data as BlogPost[]) || []
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, published_at, reading_time_minutes')
      .eq('is_published', true)
      .neq('id', postId)
      .overlaps('tags', tags)
      .limit(limit)
    if (error) return []
    return (data as BlogPost[]) || []
  },

  async getAllTags(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('is_published', true)
    if (error) return []
    const allTags = (data || []).flatMap((p) => (p.tags as string[]) || [])
    return [...new Set(allTags)].sort()
  },

  async getCategories(): Promise<{ name: string; count: number }[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('is_published', true)
      .not('category', 'is', null)
    if (error) return []
    const counts: Record<string, number> = {}
    for (const post of data || []) {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  },

  async getAllPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as BlogPost[]) || []
  },

  async incrementViewCount(postId: string) {
    const { data } = await supabase.from('blog_posts').select('view_count').eq('id', postId).single()
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', postId)
    }
  },

  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count' | 'author'>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({ ...post, view_count: 0, like_count: 0 })
      .select()
      .single()
    if (error) throw error
    return data as BlogPost
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as BlogPost
  },

  async deletePost(id: string) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) throw error
  },
}
