import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAllBooks, useDeleteBook } from '@/hooks/useBooks'
import { formatCount } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plus, Pencil, Trash2, Eye, Download, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export function BooksManager() {
  const { data: books, isLoading } = useAllBooks()
  const deleteMutation = useDeleteBook()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget)
      toast.success('Book deleted')
    } catch {
      toast.error('Could not delete book')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink-50">Books</h1>
        <Link to="/admin/books/new">
          <Button leftIcon={<Plus size={15} />}>Add book</Button>
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
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden md:table-cell">Year</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden lg:table-cell">Views</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden lg:table-cell">Downloads</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3">Featured</th>
                <th className="text-right text-xs uppercase tracking-wider text-ink-500 pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900">
              {books?.map((book) => (
                <tr key={book.id} className="hover:bg-ink-900/50 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.cover_image_url}
                        alt=""
                        className="w-8 h-12 object-cover rounded ring-1 ring-ink-700 shrink-0"
                      />
                      <div>
                        <p className="text-ink-100 font-medium">{book.title}</p>
                        {book.subtitle && <p className="text-ink-500 text-xs">{book.subtitle}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-ink-400 hidden md:table-cell">
                    {book.published_year ?? '—'}
                  </td>
                  <td className="py-4 pr-4 text-ink-400 hidden lg:table-cell">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {formatCount(book.view_count)}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-ink-400 hidden lg:table-cell">
                    <span className="flex items-center gap-1">
                      <Download size={12} /> {formatCount(book.download_count)}
                    </span>
                  </td>
                  <td className="py-4">
                    {book.is_featured && (
                      <Star size={14} className="text-amber-500" />
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/books/${book.id}/edit`}>
                        <Button variant="ghost" size="sm" leftIcon={<Pencil size={13} />}>Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 size={13} />}
                        onClick={() => setDeleteTarget(book.id)}
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

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete book"
      >
        <p className="text-ink-300 font-sans text-sm mb-6">
          This will permanently delete the book and its reading progress data. This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" isLoading={deleteMutation.isPending} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
