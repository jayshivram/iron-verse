import { useQuery } from '@tanstack/react-query'
import { commentsService } from '@/services/comments.service'
import { queryKeys } from '@/lib/react-query'
import { useApproveComment, useDeleteComment } from '@/hooks/useComments'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { timeAgo } from '@/utils/formatters'
import { Check, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/utils/cn'

export function CommentsManager() {
  const { data: comments, isLoading } = useQuery({
    queryKey: queryKeys.admin.comments as unknown as readonly unknown[],
    queryFn: commentsService.getAllComments,
  })

  const approveMutation = useApproveComment()
  const deleteMutation = useDeleteComment()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink-50">Comments</h1>
        {comments && (
          <span className="text-sm text-ink-500 font-sans">
            {comments.filter((c) => c.status === 'pending').length} pending
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="space-y-3">
          {comments?.map((comment) => (
            <div
              key={comment.id}
              className={cn(
                'rounded-xl border p-5',
                comment.status === 'pending' ? 'border-amber-500/30 bg-amber-500/5' : 'border-ink-800 bg-ink-900',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-sans font-medium text-ink-100">
                      {comment.author_name}
                    </span>
                    {comment.author_email && (
                      <span className="text-xs text-ink-500 font-sans">{comment.author_email}</span>
                    )}
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-sans ml-auto',
                      comment.status === 'approved' && 'bg-green-500/10 text-green-400',
                      comment.status === 'pending' && 'bg-amber-500/10 text-amber-500',
                      comment.status === 'spam' && 'bg-red-500/10 text-red-400',
                    )}>
                      {comment.status}
                    </span>
                    <time className="text-xs text-ink-600 font-sans">{timeAgo(comment.created_at)}</time>
                  </div>
                  <p className="text-sm text-ink-300 font-sans leading-relaxed line-clamp-3">
                    {comment.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {comment.status !== 'approved' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Check size={13} />}
                      isLoading={approveMutation.isPending}
                      onClick={async () => {
                        try {
                          await approveMutation.mutateAsync(comment.id)
                          toast.success('Comment approved')
                        } catch {
                          toast.error('Failed to approve')
                        }
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={13} />}
                    onClick={async () => {
                      try {
                        await deleteMutation.mutateAsync(comment.id)
                        toast.success('Comment deleted')
                      } catch {
                        toast.error('Failed to delete')
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {comments?.length === 0 && (
            <div className="text-center py-16 text-ink-500 font-sans text-sm">
              No comments yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
