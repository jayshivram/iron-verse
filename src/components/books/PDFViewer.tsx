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
import type { Book } from '@/types/database.types'

interface PDFViewerProps {
  book: Book
}

export function PDFViewer({ book }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [zoom, setZoom] = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Actual dimensions of the content area (measured live)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  // Actual PDF page dimensions in PDF units (captured on first page load)
  const [pageSize, setPageSize] = useState({ w: 595, h: 842 })
  const viewerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  // Lock body scroll and handle Escape key when CSS fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isFullscreen])

  // Escape key exits CSS fullscreen
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isFullscreen])


  const { user } = useAuth()
  const saveProgress = useSaveReadingProgress(book.id, numPages)
  const { data: savedProgress } = useReadingProgress(book.id)

  // Measure both width AND height of the content area so we can fit portrait
  // pages by height on landscape screens and by width on portrait screens.
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDims({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
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

  const zoomIn  = () => setZoom((z) => Math.min(3.0, +(z + 0.25).toFixed(2)))
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))
  const resetZoom = () => setZoom(1.0)

  // ── Page sizing ────────────────────────────────────────────────────────────
  // aspect = width / height of the actual PDF page (portrait books < 1)
  const aspect      = pageSize.w / pageSize.h
  const padding     = 24                                       // px each side
  const fitByWidth  = dims.w > 0 ? dims.w - padding * 2 : 0
  const fitByHeight = dims.h > 0 ? Math.floor((dims.h - 40) * aspect) : 0
  // Use whichever constraint is tighter so the page always fits on screen.
  // On a wide desktop: fitByHeight is smaller (portrait page, landscape screen).
  // On a narrow mobile: fitByWidth is smaller.
  const baseWidth  = fitByWidth > 0 && fitByHeight > 0
    ? Math.min(fitByWidth, fitByHeight)
    : Math.max(fitByWidth, fitByHeight)
  const pageWidth  = baseWidth > 0 ? Math.floor(baseWidth * zoom) : undefined
  // ──────────────────────────────────────────────────────────────────────────

  const percentage = numPages > 0 ? Math.round((pageNumber / numPages) * 100) : 0

  return (
    <div
      ref={viewerRef}
      className="flex flex-col h-full"
      style={isFullscreen ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#111',
      } : { background: '#111' }}
    >
      {/* Toolbar */}
      <div
        className="flex-none flex items-center justify-between px-3 py-2.5 border-b"
        style={{ background: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* Page navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
            className="w-8 h-8 flex items-center justify-center rounded
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1 text-sm font-sans">
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(e) => {
                const val = Math.max(1, Math.min(numPages, Number(e.target.value)))
                setPageNumber(val)
              }}
              className="w-10 text-center rounded text-sm py-0.5 focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
              }}
              aria-label="Current page"
            />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>/ {numPages}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
            className="w-8 h-8 flex items-center justify-center rounded
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={zoomOut}
            aria-label="Zoom out"
            className="w-8 h-8 flex items-center justify-center rounded transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <ZoomOut size={15} />
          </button>

          <button
            onClick={resetZoom}
            className="text-xs font-sans px-2 py-1 rounded transition-colors min-w-[3.5rem] text-center"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={zoomIn}
            aria-label="Zoom in"
            className="w-8 h-8 flex items-center justify-center rounded transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <ZoomIn size={15} />
          </button>

          <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.15)' }} />

          <a
            href={book.pdf_url}
            download={`${book.slug}.pdf`}
            aria-label="Download PDF"
            className="w-8 h-8 flex items-center justify-center rounded transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f59e0b' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            <Download size={15} />
          </a>

          <button
            onClick={() => setIsFullscreen((f) => !f)}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="w-8 h-8 flex items-center justify-center rounded transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex-none h-0.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${percentage}%`, background: '#f59e0b' }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Reading progress: ${percentage}%`}
        />
      </div>

      {/* PDF content — scrollable, swipeable */}
      <div
        ref={contentRef}
        className="flex-1 min-h-0 overflow-auto"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return
          const dx = e.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(dx) > 50) dx < 0 ? goToNextPage() : goToPrevPage()
          touchStartX.current = null
        }}
      >
        <Document
          file={book.pdf_url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full py-20">
              <LoadingSpinner size="lg" label="Loading PDF..." />
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
              <p className="font-sans text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Could not load the PDF. Try downloading it directly.
              </p>
              <a
                href={book.pdf_url}
                download
                className="px-4 py-2 rounded text-sm font-sans border transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
              >
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
              transition={{ duration: 0.15 }}
              className="py-4"
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer={false}
                className="shadow-2xl"
                onLoadSuccess={(page) => {
                  // Capture actual page dimensions so aspect ratio is exact
                  const [, , w, h] = page.view
                  if (w && h) setPageSize({ w, h })
                }}
              />
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      {/* Bottom navigation */}
      <div
        className="flex-none flex items-center justify-between px-4 py-2.5 border-t"
        style={{ background: '#1a1a1a', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded text-sm font-sans
                     border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          <ChevronLeft size={15} />
          Previous
        </button>

        <span className="text-xs font-sans" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {percentage}% complete
        </span>

        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="flex items-center gap-1.5 px-4 py-2 rounded text-sm font-sans
                     transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: '#f59e0b', color: '#111' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fbbf24' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#f59e0b' }}
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
