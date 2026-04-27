import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsService } from '@/services/comments.service'
import { queryKeys } from '@/lib/react-query'
import toast from 'react-hot-toast'

export function useComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.comments.byPost(postId),
    queryFn: () => commentsService.getComments(postId),
    enabled: !!postId,
  })
}

export function useSubmitComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: commentsService.submitComment,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.comments.byPost(variables.post_id) })
      toast.success('Comment submitted! It will appear after review.')
    },
    onError: () => toast.error('Failed to submit comment'),
  })
}

export function useApproveComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: commentsService.approveComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments'] })
      toast.success('Comment approved')
    },
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: commentsService.deleteComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments'] })
      toast.success('Comment deleted')
    },
  })
}
