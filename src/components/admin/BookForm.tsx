import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useCreateBook, useUpdateBook } from '@/hooks/useBooks'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { Book } from '@/types/database.types'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().max(200).optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  description: z.string().min(1, 'Description is required'),
  cover_image_url: z.string().url('Enter a valid URL'),
  pdf_url: z.string().url('Enter a valid URL'),
  published_year: z.coerce.number().int().min(2000).max(2100).optional().nullable(),
  is_featured: z.boolean().optional(),
  tags: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface BookFormProps {
  initialData?: Book
}

export function BookForm({ initialData }: BookFormProps) {
  const navigate = useNavigate()
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()

  const isEditing = !!initialData

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          subtitle: initialData.subtitle || '',
          slug: initialData.slug,
          description: initialData.description,
          cover_image_url: initialData.cover_image_url,
          pdf_url: initialData.pdf_url,
          published_year: initialData.published_year,
          is_featured: initialData.is_featured,
          tags: initialData.tags?.join(', ') || '',
        }
      : { is_featured: false },
  })

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    }
    try {
      if (isEditing) {
        await updateBook.mutateAsync({ id: initialData.id, updates: payload as any })
        toast.success('Book updated')
      } else {
        await createBook.mutateAsync(payload as any)
        toast.success('Book created')
      }
      navigate('/admin/books')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save book')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          {...register('title')}
          label="Title"
          placeholder="Garden of Grief"
          error={errors.title?.message}
        />
        <Input
          {...register('subtitle')}
          label="Subtitle (optional)"
          placeholder="Poems about..."
          error={errors.subtitle?.message}
        />
      </div>

      <Input
        {...register('slug')}
        label="Slug"
        placeholder="garden-of-grief"
        error={errors.slug?.message}
        helpText="URL-friendly identifier — used in /books/:slug"
      />

      <Textarea
        {...register('description')}
        label="Description"
        rows={4}
        placeholder="A short, honest description..."
        error={errors.description?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          {...register('cover_image_url')}
          label="Cover image URL"
          placeholder="/images/books/garden-of-grief.webp"
          error={errors.cover_image_url?.message}
        />
        <Input
          {...register('pdf_url')}
          label="PDF URL"
          placeholder="/pdfs/GARDEN_OF_GRIEF.pdf"
          error={errors.pdf_url?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          {...register('published_year')}
          label="Published year (optional)"
          type="number"
          placeholder="2024"
          error={errors.published_year?.message}
        />
        <Input
          {...register('tags')}
          label="Tags (comma-separated)"
          placeholder="grief, love, loss"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('is_featured')} className="w-4 h-4 accent-amber" />
        <span className="text-sm font-sans text-ink-200">Featured on homepage</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Create book'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate('/admin/books')}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
