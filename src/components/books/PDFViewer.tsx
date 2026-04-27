import { useState, useCallback, useRef, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download,
  Maximize2, Minimize2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { useSaveReadingProgress, useReadingProgress } from '@/hooks/useReadingProgress'
import { cn } from '@/utils/cn'
import type { Book } from '@/types/database.types'

interface PDFViewerProps {
  book: Book
}

export function PDFViewer({ book }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [contentWidth, setContentWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const { user } = useAuth()
  const saveProgress = useSaveReadingProgress(book.id, numPages)
  const { data: savedProgress } = useReadingProgress(book.id)

  // Measure content area width for responsive page sizing
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setContentWidth(w)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Restore reading position
  useEffect(() => {
    if (savedProgress && savedProgress.current_page > 0) {
      setPageNumber(savedProgress.current_page)
    }
  }, [savedProgress])

  // Save progress when page changes
  useEffect(() => {
    if (numPages > 0 && user) {
      saveProgress(pageNumber)
    }
  }, [pageNumber, numPages, user, saveProgress])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToPrevPage()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToNextPage()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }, [])

  const goToPrevPage = () => setPageNumber((p) => Math.max(1, p - 1))
  const goToNextPage = () => setPageNumber((p) => Math.min(numPages, p + 1))

  const zoomIn = () => setScale((s) => Math.min(2.5, s + 0.25))
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.25))
  const resetZoom = () => setScale(1.0)

  const percentage = numPages > 0 ? Math.round((pageNumber / numPages) * 100) : 0

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col bg-ink-950',
        isFullscreen ? 'fixed inset-0 z-50' : 'rounded-xl border border-ink-800 overflow-hidden',
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-ink-900 border-b border-ink-800">
        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
            className="w-8 h-8 flex items-center justify-center rounded text-ink-400
                       hover:text-ink-100 hover:bg-ink-800 disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 text-sm font-sans">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => {
                const val = Math.max(1, Math.min(numPages, Number(e.target.value)))
                setPageNumber(val)
              }}
              className="w-12 text-center bg-ink-800 border border-ink-700 rounded
                         text-ink-100 text-sm py-1 focus:outline-none focus:border-amber-500"
              aria-label="Current page"
            />
            <span className="text-ink-500">/ {numPages}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
            className="w-8 h-8 flex items-center justify-center rounded text-ink-400
                       hover:text-ink-100 hover:bg-ink-800 disabled:opacity-30
                       disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            aria-label="Zoom out"
            className="w-8 h-8 flex items-center justify-center rounded text-ink-400
                       hover:text-ink-100 hover:bg-ink-800 transition-colors"
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={resetZoom}
            className="text-xs font-sans text-ink-400 hover:text-ink-100 px-2 py-1
                       hover:bg-ink-800 rounded transition-colors min-w-[3.5rem] text-center"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={zoomIn}
            aria-label="Zoom in"
            className="w-8 h-8 flex items-center justify-center rounded text-ink-400
                       hover:text-ink-100 hover:bg-ink-800 transition-colors"
          >
            <ZoomIn size={15} />
          </button>

          <div className="w-px h-5 bg-ink-700 mx-1" />

          <a
            href={book.pdf_url}
            download={`${book.slug}.pdf`}
            aria-label="Download PDF"
            className="w-8 h-8 flex items-center justify-center rounded text-ink-400
                       hover:text-amber-500 hover:bg-ink-800 transition-colors"
          >
            <Download size={15} />
          </a>

          <button
            onClick={() => setIsFullscreen((f) => !f)}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="w-8 h-8 flex items-center justify-center rounded text-ink-400
                       hover:text-ink-100 hover:bg-ink-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-ink-800">
        <div
          className="h-full bg-amber-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Reading progress: ${percentage}%`}
        />
      </div>

      {/* PDF content */}
      <div ref={contentRef} className="flex-1 overflow-auto">
        <Document
          file={book.pdf_url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" label="Loading PDF..." />
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <p className="text-ink-400 font-sans text-sm mb-4">
                Could not load the PDF. Try downloading it directly.
              </p>
              <a href={book.pdf_url} download className="btn-secondary text-sm">
                Download PDF
              </a>
            </div>
          }
          className="flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pageNumber}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Page
                pageNumber={pageNumber}
                width={contentWidth > 0 ? Math.floor((contentWidth - 32) * scale) : undefined}
                scale={contentWidth > 0 ? undefined : scale}
                renderTextLayer
                renderAnnotationLayer={false}
                className="my-6 shadow-ink rounded"
              />
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-ink-900 border-t border-ink-800">
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="btn-secondary text-sm py-2 px-4 disabled:opacity-30"
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        <span className="text-xs text-ink-500 font-sans">
          {percentage}% complete
        </span>

        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="btn-primary text-sm py-2 px-4 disabled:opacity-30"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
