import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { timeAgo } from '@/utils/formatters'
import { getInitials } from '@/utils/helpers'
import type { Comment } from '@/types/database.types'
import { useSubmitComment } from '@/hooks/useComments'
import { CommentForm } from './CommentForm'
import { Reply } from 'lucide-react'

interface CommentListProps {
  comments: Comment[]
  postId: string
  depth?: number
}

interface CommentItemProps {
  comment: Comment
  postId: string
  depth: number
}

function CommentItem({ comment, postId, depth }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const submitMutation = useSubmitComment()

  return (
    <div className={depth > 0 ? 'ml-8 pl-4 border-l border-ink-800' : ''}>
      <div className="flex gap-3 py-4">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-ink-800 border border-ink-700 flex items-center
                        justify-center text-xs font-sans font-semibold text-amber-500 shrink-0">
          {getInitials(comment.author_name)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-sans font-medium text-ink-100">
              {comment.author_name}
            </span>
            {comment.author_website && (
              <a
                href={comment.author_website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-xs text-amber-500 hover:underline"
              >
                {new URL(comment.author_website).hostname}
              </a>
            )}
            <time className="text-xs text-ink-500 font-sans ml-auto">
              {timeAgo(comment.created_at)}
            </time>
          </div>

          {/* Content */}
          <p className="text-sm text-ink-300 font-sans mt-1.5 leading-relaxed whitespace-pre-line">
            {comment.content}
          </p>

          {/* Reply button */}
          {depth < 2 && (
            <button
              onClick={() => setIsReplying((r) => !r)}
              className="flex items-center gap-1.5 mt-2 text-xs text-ink-500 hover:text-amber-500 transition-colors font-sans"
            >
              <Reply size={13} />
              Reply
            </button>
          )}

          {/* Reply form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSubmit={async (data) => {
                    await submitMutation.mutateAsync(data)
                    setIsReplying(false)
                  }}
                  isSubmitting={submitMutation.isPending}
                  onCancel={() => setIsReplying(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <CommentList comments={comment.replies} postId={postId} depth={depth + 1} />
      )}
    </div>
  )
}

export function CommentList({ comments, postId, depth = 0 }: CommentListProps) {
  return (
    <div className="divide-y divide-ink-900">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} depth={depth} />
      ))}
    </div>
  )
}
