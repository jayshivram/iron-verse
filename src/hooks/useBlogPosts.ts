import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '@/services/blog.service'
import { queryKeys } from '@/lib/react-query'
import type { BlogFilter } from '@/types/api.types'
import toast from 'react-hot-toast'

export function useBlogPosts(filters: BlogFilter = {}) {
  return useQuery({
    queryKey: queryKeys.blog.list(filters),
    queryFn: () => blogService.getPosts(filters),
  })
}

export function useRecentPosts(limit = 5) {
  return useQuery({
    queryKey: [...queryKeys.blog.recent(), limit],
    queryFn: () => blogService.getRecentPosts(limit),
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: queryKeys.blog.detail(slug),
    queryFn: () => blogService.getPostBySlug(slug),
    enabled: !!slug,
  })
}

export function useAllBlogPosts() {
  return useQuery({
    queryKey: queryKeys.blog.all,
    queryFn: () => blogService.getAllPosts(),
  })
}

export function useBlogTags() {
  return useQuery({
    queryKey: queryKeys.blog.tags(),
    queryFn: () => blogService.getAllTags(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useDeletePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blogService.deletePost(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blog.all })
      toast.success('Post deleted')
    },
    onError: () => toast.error('Failed to delete post'),
  })
}

export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: blogService.createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blog.all })
      toast.success('Post created')
    },
    onError: () => toast.error('Failed to create post'),
  })
}

export function useUpdatePost() {  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof blogService.updatePost>[1] }) =>
      blogService.updatePost(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.blog.all })
      qc.invalidateQueries({ queryKey: ['blog', 'detail'] })
      toast.success('Post saved')
    },
    onError: () => toast.error('Failed to save post'),
  })
}

export function useRelatedPosts(postId: string, tags: string[], limit = 3) {
  return useQuery({
    queryKey: ['blog', 'related', postId],
    queryFn: () => blogService.getRelatedPosts(postId, tags, limit),
    enabled: !!postId,
  })
}
