import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { booksService } from '@/services/books.service'
import { queryKeys } from '@/lib/react-query'
import type { BooksFilter } from '@/types/api.types'
import toast from 'react-hot-toast'

export function useBooks(filters: BooksFilter = {}) {
  return useQuery({
    queryKey: queryKeys.books.list(filters),
    queryFn: () => booksService.getBooks(filters),
  })
}

export function useFeaturedBooks() {
  return useQuery({
    queryKey: queryKeys.books.featured(),
    queryFn: () => booksService.getFeaturedBooks(),
  })
}

export function useBook(slug: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(slug),
    queryFn: () => booksService.getBookBySlug(slug),
    enabled: !!slug,
  })
}

export function useAllBooks() {
  return useQuery({
    queryKey: queryKeys.books.all,
    queryFn: () => booksService.getAllBooks(),
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => booksService.deleteBook(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.books.all })
      toast.success('Book deleted')
    },
    onError: () => toast.error('Failed to delete book'),
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: booksService.createBook,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.books.all })
      toast.success('Book created')
    },
    onError: () => toast.error('Failed to create book'),
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof booksService.updateBook>[1] }) =>
      booksService.updateBook(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.books.all })
      toast.success('Book updated')
    },
    onError: () => toast.error('Failed to update book'),
  })
}
