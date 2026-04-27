import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Send } from 'lucide-react'

const commentSchema = z.object({
  author_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  author_email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  author_website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  content: z.string().min(5, 'Comment must be at least 5 characters').max(1000),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  postId: string
  parentId?: string
  onSubmit: (data: {
    post_id: string
    parent_id?: string | null
    author_name: string
    author_email?: string
    author_website?: string
    content: string
  }) => Promise<void>
  isSubmitting: boolean
  onCancel?: () => void
}

export function CommentForm({ postId, parentId, onSubmit, isSubmitting, onCancel }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const handleFormSubmit = async (data: CommentFormData) => {
    await onSubmit({
      post_id: postId,
      parent_id: parentId || null,
      author_name: data.author_name,
      author_email: data.author_email || undefined,
      author_website: data.author_website || undefined,
      content: data.content,
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          {...register('author_name')}
          label="Name"
          placeholder="Your name"
          error={errors.author_name?.message}
          autoComplete="name"
        />
        <Input
          {...register('author_email')}
          label="Email (optional, not published)"
          placeholder="your@email.com"
          type="email"
          error={errors.author_email?.message}
          autoComplete="email"
        />
      </div>

      <Input
        {...register('author_website')}
        label="Website (optional)"
        placeholder="https://yourwebsite.com"
        type="url"
        error={errors.author_website?.message}
        autoComplete="url"
      />

      <Textarea
        {...register('content')}
        label="Comment"
        placeholder="What are your thoughts?"
        rows={4}
        error={errors.content?.message}
      />

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Send size={14} />}
        >
          Submit comment
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      <p className="text-xs text-ink-500 font-sans">
        Comments appear after review. Usually within 24 hours.
      </p>
    </form>
  )
}
