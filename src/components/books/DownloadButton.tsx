import { Download } from 'lucide-react'
import { booksService } from '@/services/books.service'
import type { Book } from '@/types/database.types'
import { cn } from '@/utils/cn'

interface DownloadButtonProps {
  book: Book
  className?: string
  size?: 'sm' | 'md'
}

export function DownloadButton({ book, className, size = 'md' }: DownloadButtonProps) {
  const handleDownload = async () => {
    // Track the download
    await booksService.incrementDownloadCount(book.id)
  }

  return (
    <a
      href={book.pdf_url}
      download={`${book.slug}.pdf`}
      onClick={handleDownload}
      className={cn(
        'btn-secondary flex items-center gap-2',
        size === 'sm' && 'text-xs py-1.5 px-3',
        size === 'md' && 'text-sm py-2.5 px-5',
        className,
      )}
      aria-label={`Download ${book.title} as PDF`}
    >
      <Download size={size === 'sm' ? 14 : 16} />
      Download PDF
    </a>
  )
}
