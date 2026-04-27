import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useCreatePost, useUpdatePost } from '@/hooks/useBlogPosts'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { BlogPost } from '@/types/database.types'
import { BLOG_CATEGORIES } from '@/utils/constants'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, Undo, Redo,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(250),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  featured_image_url: z.string().url('Valid URL required').optional().or(z.literal('')),
  is_published: z.boolean(),
  content: z.string().min(1, 'Content is required'),
})
type FormData = z.infer<typeof schema>

interface BlogPostFormProps {
  initialData?: BlogPost
}

function TipTapToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null

  const tools = [
    { icon: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
    { icon: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
    { icon: <Heading2 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'H2' },
    { icon: <Heading3 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), label: 'H3' },
    { icon: <List size={14} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet list' },
    { icon: <ListOrdered size={14} />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), label: 'Ordered list' },
    { icon: <Quote size={14} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), label: 'Blockquote' },
    { icon: <Minus size={14} />, action: () => editor.chain().focus().setHorizontalRule().run(), active: false, label: 'Divider' },
  ]

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-ink-700 bg-ink-900 rounded-t-md">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          aria-label={tool.label}
          onClick={tool.action}
          className={cn(
            'w-7 h-7 flex items-center justify-center rounded text-ink-400 hover:text-ink-100 hover:bg-ink-700 transition-colors',
            tool.active && 'bg-amber-500/20 text-amber-500',
          )}
        >
          {tool.icon}
        </button>
      ))}
      <div className="w-px h-5 bg-ink-700 mx-1 self-center" />
      <button
        type="button"
        aria-label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        className="w-7 h-7 flex items-center justify-center rounded text-ink-400 hover:text-ink-100 hover:bg-ink-700 transition-colors"
      >
        <Undo size={14} />
      </button>
      <button
        type="button"
        aria-label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        className="w-7 h-7 flex items-center justify-center rounded text-ink-400 hover:text-ink-100 hover:bg-ink-700 transition-colors"
      >
        <Redo size={14} />
      </button>
    </div>
  )
}

export function BlogPostForm({ initialData }: BlogPostFormProps) {
  const navigate = useNavigate()
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()
  const isEditing = !!initialData

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          excerpt: initialData.excerpt || '',
          category: initialData.category || '',
          tags: initialData.tags?.join(', ') || '',
          featured_image_url: initialData.featured_image_url || '',
          is_published: initialData.is_published,
          content: initialData.content,
        }
      : { is_published: false, content: '' },
  })

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: initialData?.content || '',
    onUpdate: ({ editor }) => setValue('content', editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[300px] focus:outline-none p-4',
      },
    },
  })

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      featured_image_url: data.featured_image_url || null,
      excerpt: data.excerpt || null,
      category: data.category || null,
    }
    try {
      if (isEditing) {
        await updatePost.mutateAsync({ id: initialData.id, updates: payload as any })
        toast.success('Post updated')
      } else {
        await createPost.mutateAsync(payload as any)
        toast.success('Post created')
      }
      navigate('/admin/blog')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save post')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl" noValidate>
      <Input {...register('title')} label="Title" error={errors.title?.message} />
      <Input
        {...register('slug')}
        label="Slug"
        placeholder="my-post-slug"
        error={errors.slug?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Select
          {...register('category')}
          label="Category"
          options={[{ value: '', label: 'Uncategorized' }, ...BLOG_CATEGORIES.map((c) => ({ value: c, label: c }))]}
        />
        <Input {...register('tags')} label="Tags (comma-separated)" placeholder="poetry, process" />
      </div>

      <Textarea
        {...register('excerpt')}
        label="Excerpt (optional)"
        rows={2}
        placeholder="A short summary shown in listings..."
        error={errors.excerpt?.message}
      />

      <Input
        {...register('featured_image_url')}
        label="Featured image URL (optional)"
        error={errors.featured_image_url?.message}
      />

      {/* TipTap editor */}
      <div>
        <label className="label mb-1.5">Content</label>
        <div className="border border-ink-700 rounded-md overflow-hidden bg-ink-900">
          <TipTapToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        {errors.content && <p className="field-error mt-1">{errors.content.message}</p>}
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" {...register('is_published')} className="w-4 h-4 accent-amber" />
        <span className="text-sm font-sans text-ink-200">Published (visible to public)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Create post'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate('/admin/blog')}>Cancel</Button>
      </div>
    </form>
  )
}
