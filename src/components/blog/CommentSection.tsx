import { useComments, useSubmitComment } from '@/hooks/useComments'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MessageSquare } from 'lucide-react'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: comments = [], isLoading } = useComments(postId)
  const submitMutation = useSubmitComment()

  return (
    <section aria-labelledby="comments-heading" className="mt-12 pt-8 border-t border-ink-800">
      <h2 id="comments-heading" className="font-serif text-2xl font-semibold text-ink-50 mb-8 flex items-center gap-3">
        <MessageSquare size={22} className="text-amber-500" />
        {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Leave a Comment'}
      </h2>

      {isLoading ? (
        <div className="py-10 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {comments.length > 0 && (
            <div className="mb-10">
              <CommentList comments={comments} postId={postId} />
            </div>
          )}

          <div>
            <h3 className="font-serif text-lg text-ink-100 mb-5">
              {comments.length > 0 ? 'Add yours' : 'Be the first to comment'}
            </h3>
            <CommentForm
              postId={postId}
              onSubmit={async (data) => { await submitMutation.mutateAsync(data) }}
              isSubmitting={submitMutation.isPending}
            />
          </div>
        </>
      )}
    </section>
  )
}
