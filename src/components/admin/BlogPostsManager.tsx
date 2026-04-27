import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllBlogPosts, useDeletePost } from '@/hooks/useBlogPosts'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatDate, formatCount } from '@/utils/formatters'
import { Plus, Pencil, Trash2, Eye, Globe, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/utils/cn'

export function BlogPostsManager() {
  const { data: posts, isLoading } = useAllBlogPosts()
  const deleteMutation = useDeletePost()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget)
      toast.success('Post deleted')
    } catch {
      toast.error('Could not delete post')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink-50">Blog posts</h1>
        <Link to="/admin/blog/new">
          <Button leftIcon={<Plus size={15} />}>New post</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-ink-800">
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4">Title</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden md:table-cell">Category</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden lg:table-cell">Published</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden lg:table-cell">Views</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3">Status</th>
                <th className="text-right text-xs uppercase tracking-wider text-ink-500 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900">
              {posts?.map((post) => (
                <tr key={post.id} className="hover:bg-ink-900/50 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="text-ink-100 font-medium line-clamp-1">{post.title}</p>
                    <p className="text-ink-500 text-xs">{post.slug}</p>
                  </td>
                  <td className="py-4 pr-4 text-ink-400 hidden md:table-cell">
                    {post.category ?? '—'}
                  </td>
                  <td className="py-4 pr-4 text-ink-400 hidden lg:table-cell">
                    {post.published_at ? formatDate(post.published_at, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td className="py-4 pr-4 text-ink-400 hidden lg:table-cell">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {formatCount(post.view_count)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full',
                      post.is_published
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-ink-800 text-ink-400',
                    )}>
                      {post.is_published ? <><Globe size={10} /> Published</> : <><EyeOff size={10} /> Draft</>}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/blog/${post.id}/edit`}>
                        <Button variant="ghost" size="sm" leftIcon={<Pencil size={13} />}>Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 size={13} />}
                        onClick={() => setDeleteTarget(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete post">
        <p className="text-ink-300 font-sans text-sm mb-6">
          This will permanently delete the post and all its comments. This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" isLoading={deleteMutation.isPending} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
