import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toPng } from 'html-to-image'
import {
  X,
  Download,
  Image as ImageIcon,
  Check,
  Palette,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { cn } from '@/utils/cn'

/* ─── Types ─────────────────────────────────────────────── */

export interface QuoteCardPayload {
  quote: string
  source: string          // poem name or blog post title
  author?: string         // defaults to "Iron Heist"
  bookTitle?: string
}

interface QuoteCardGeneratorProps {
  isOpen: boolean
  onClose: () => void
  initial: QuoteCardPayload
}

/* ─── Card Styles (themes) ───────────────────────────────── */

interface CardStyle {
  id: string
  label: string
  /** Inline styles applied to the 1080×1080 card element */
  card: React.CSSProperties
  quoteColor: string
  sourceColor: string
  authorColor: string
  brandColor: string
  dividerColor: string
  /** Tailwind accent class for the style selector pill */
  accent: string
}

const CARD_STYLES: CardStyle[] = [
  {
    id: 'midnight',
    label: 'Midnight',
    card: {
      background: 'linear-gradient(145deg, #0a0a0f 0%, #12100e 55%, #1a1208 100%)',
    },
    quoteColor: '#f5f0e8',
    sourceColor: '#c9a84c',
    authorColor: '#7a6840',
    brandColor: '#3d3020',
    dividerColor: 'rgba(201,168,76,0.25)',
    accent: 'bg-yellow-900 border-yellow-700 text-yellow-400',
  },
  {
    id: 'parchment',
    label: 'Parchment',
    card: {
      background: 'linear-gradient(145deg, #faf5e4 0%, #f2e8cc 60%, #e8d9b0 100%)',
    },
    quoteColor: '#1a1208',
    sourceColor: '#7a5c1e',
    authorColor: '#a07a30',
    brandColor: '#c9b07a',
    dividerColor: 'rgba(122,92,30,0.3)',
    accent: 'bg-amber-100 border-amber-300 text-amber-800',
  },
  {
    id: 'noir',
    label: 'Noir',
    card: {
      background: 'linear-gradient(160deg, #0d0d0d 0%, #111111 50%, #1a1a1a 100%)',
    },
    quoteColor: '#e8e8e8',
    sourceColor: '#888888',
    authorColor: '#555555',
    brandColor: '#2a2a2a',
    dividerColor: 'rgba(255,255,255,0.08)',
    accent: 'bg-neutral-800 border-neutral-600 text-neutral-300',
  },
  {
    id: 'dusk',
    label: 'Dusk',
    card: {
      background: 'linear-gradient(145deg, #0f0a1e 0%, #1a1035 55%, #2a1428 100%)',
    },
    quoteColor: '#ede4f7',
    sourceColor: '#b07ed4',
    authorColor: '#6b4d8a',
    brandColor: '#2a1a3a',
    dividerColor: 'rgba(176,126,212,0.25)',
    accent: 'bg-purple-950 border-purple-700 text-purple-300',
  },
  {
    id: 'ember',
    label: 'Ember',
    card: {
      background: 'linear-gradient(145deg, #0e0805 0%, #1a0f08 55%, #2a1505 100%)',
    },
    quoteColor: '#faf0e0',
    sourceColor: '#e07030',
    authorColor: '#804020',
    brandColor: '#2a1a08',
    dividerColor: 'rgba(224,112,48,0.25)',
    accent: 'bg-orange-950 border-orange-700 text-orange-400',
  },
]

/* ─── Decorative SVG ornament ───────────────────────────── */

function OrnamentQuote({ color }: { color: string }) {
  return (
    <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 36V22.8C0 16.68 1.6 11.76 4.8 8.04C8 4.28 12.6 1.56 18.6 0L21 5.16C17.72 6.28 15.12 8 13.2 10.32C11.28 12.64 10.32 15.6 10.32 19.2H18.6V36H0ZM26.4 36V22.8C26.4 16.68 28 11.76 31.2 8.04C34.4 4.28 39 1.56 45 0L47.4 5.16C44.12 6.28 41.52 8 39.6 10.32C37.68 12.64 36.72 15.6 36.72 19.2H45V36H26.4Z"
        fill={color}
      />
    </svg>
  )
}

/* ─── The 1080×1080 card that will be screenshot'd ─────── */

interface QuoteCardProps {
  style: CardStyle
  quote: string
  source: string
  author: string
}

function QuoteCard({ style, quote, source, author }: QuoteCardProps) {
  return (
    <div
      style={{
        width: 1080,
        height: 1080,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '96px',
        position: 'relative',
        overflow: 'hidden',
        ...style.card,
      }}
    >
      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 40, left: 40, opacity: 0.15 }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill={style.quoteColor}>
          <path d="M0 60 L0 0 L60 0" stroke={style.quoteColor} strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 40, right: 40, opacity: 0.15, transform: 'rotate(90deg)' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill={style.quoteColor}>
          <path d="M0 60 L0 0 L60 0" stroke={style.quoteColor} strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 40, left: 40, opacity: 0.15, transform: 'rotate(270deg)' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill={style.quoteColor}>
          <path d="M0 60 L0 0 L60 0" stroke={style.quoteColor} strokeWidth="1.5" fill="none"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 40, right: 40, opacity: 0.15, transform: 'rotate(180deg)' }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill={style.quoteColor}>
          <path d="M0 60 L0 0 L60 0" stroke={style.quoteColor} strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      {/* Subtle vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 820,
        zIndex: 1,
        gap: 0,
      }}>
        {/* Opening ornament */}
        <div style={{ marginBottom: 48, opacity: 0.6 }}>
          <OrnamentQuote color={style.sourceColor} />
        </div>

        {/* Quote text */}
        <p style={{
          fontSize: quote.length > 160 ? 36 : quote.length > 80 ? 44 : 54,
          lineHeight: 1.55,
          color: style.quoteColor,
          fontStyle: 'italic',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          marginBottom: 56,
        }}>
          {quote}
        </p>

        {/* Divider */}
        <div style={{
          width: 72,
          height: 1,
          background: style.dividerColor,
          marginBottom: 36,
        }} />

        {/* Source / poem name */}
        <p style={{
          fontSize: 24,
          color: style.sourceColor,
          fontStyle: 'normal',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily: "'Georgia', serif",
          marginBottom: 14,
        }}>
          {source}
        </p>

        {/* Author */}
        <p style={{
          fontSize: 20,
          color: style.authorColor,
          letterSpacing: '0.08em',
          fontFamily: "'Georgia', serif",
        }}>
          — {author}
        </p>
      </div>

      {/* Brand watermark */}
      <div style={{
        position: 'absolute',
        bottom: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 28,
          height: 1,
          background: style.brandColor,
        }} />
        <p style={{
          fontSize: 14,
          color: style.brandColor,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontFamily: "'Georgia', serif",
        }}>
          Iron Verse
        </p>
        <div style={{
          width: 28,
          height: 1,
          background: style.brandColor,
        }} />
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */

export function QuoteCardGenerator({ isOpen, onClose, initial }: QuoteCardGeneratorProps) {
  const [quote, setQuote] = useState(initial.quote)
  const [source, setSource] = useState(initial.source)
  const [author, setAuthor] = useState(initial.author ?? 'Iron Heist')
  const [styleIdx, setStyleIdx] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const style = CARD_STYLES[styleIdx]

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = `iron-verse-quote-${style.id}.png`
      link.href = dataUrl
      link.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2500)
    } catch (err) {
      console.error('Quote card export failed:', err)
    } finally {
      setDownloading(false)
    }
  }, [downloading, style.id])

  const prevStyle = () => setStyleIdx((i) => (i - 1 + CARD_STYLES.length) % CARD_STYLES.length)
  const nextStyle = () => setStyleIdx((i) => (i + 1) % CARD_STYLES.length)

  // Sync initial values when modal opens with new data
  useState(() => {
    setQuote(initial.quote)
    setSource(initial.source)
    setAuthor(initial.author ?? 'Iron Heist')
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="qcg-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            key="qcg-panel"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-4xl max-h-[92vh] flex flex-col
                         bg-ink-900 border border-ink-700 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-900/40 flex items-center justify-center">
                    <ImageIcon size={15} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="font-sans text-sm font-semibold text-ink-100">Share Quote</h2>
                    <p className="font-sans text-xs text-ink-500">Generate a beautiful image for Instagram & Pinterest</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-ink-400
                             hover:text-ink-100 hover:bg-ink-800 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] divide-y lg:divide-y-0 lg:divide-x divide-ink-800">

                  {/* ── Live Preview ── */}
                  <div className="flex flex-col items-center justify-center p-6 bg-ink-950/40 gap-4">
                    <div className="w-full max-w-[400px] aspect-square relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-ink-700">
                      {/* Scale the 1080×1080 card down to fill the preview */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          style={{
                            transform: 'scale(var(--card-scale, 0.37))',
                            transformOrigin: 'center center',
                          }}
                          className="[--card-scale:0.37]"
                        >
                          <QuoteCard
                            style={style}
                            quote={quote || 'Your verse will appear here…'}
                            source={source || 'Poem Title'}
                            author={author || 'Iron Heist'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Style Picker */}
                    <div className="flex items-center gap-3 w-full max-w-[400px]">
                      <button
                        onClick={prevStyle}
                        aria-label="Previous style"
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-ink-700
                                   text-ink-400 hover:text-ink-100 hover:border-ink-500 transition-colors flex-shrink-0"
                      >
                        <ChevronLeft size={14} />
                      </button>

                      <div className="flex-1 flex items-center justify-center gap-2">
                        {CARD_STYLES.map((s, i) => (
                          <button
                            key={s.id}
                            onClick={() => setStyleIdx(i)}
                            aria-label={`Style: ${s.label}`}
                            title={s.label}
                            className={cn(
                              'w-6 h-6 rounded-full border-2 transition-all duration-200',
                              i === styleIdx
                                ? 'scale-125 border-amber-400'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            )}
                            style={{ background: getStyleSwatch(s) }}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextStyle}
                        aria-label="Next style"
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-ink-700
                                   text-ink-400 hover:text-ink-100 hover:border-ink-500 transition-colors flex-shrink-0"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Palette size={11} className="text-ink-600" />
                      <span className="text-xs text-ink-500 font-sans">{style.label} theme</span>
                    </div>
                  </div>

                  {/* ── Controls ── */}
                  <div className="flex flex-col p-6 gap-5">
                    <div>
                      <label className="label">Quote text</label>
                      <textarea
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        rows={5}
                        maxLength={280}
                        placeholder="Paste or type a poem snippet…"
                        className="textarea"
                      />
                      <p className="text-xs text-ink-600 font-sans mt-1.5 text-right">
                        {quote.length}/280
                      </p>
                    </div>

                    <div>
                      <label className="label">Poem / Source</label>
                      <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g. Next to the Ocean"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Author</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Iron Heist"
                        className="input"
                      />
                    </div>

                    {/* Tips */}
                    <div className="rounded-lg bg-amber-950/20 border border-amber-900/30 p-4 flex gap-3">
                      <div className="w-4 h-4 rounded-full bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-400 text-[10px] font-bold">i</span>
                      </div>
                      <p className="font-sans text-xs text-ink-400 leading-relaxed">
                        The image exports at <strong className="text-ink-200">1080 × 1080 px</strong> — perfect for Instagram Stories, Pinterest pins, and story posts.
                      </p>
                    </div>

                    {/* Download button */}
                    <motion.button
                      onClick={handleDownload}
                      disabled={downloading || !quote.trim()}
                      whileTap={{ scale: 0.97 }}
                      className="btn-primary w-full py-3 text-base justify-center mt-auto"
                    >
                      {downloading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : downloaded ? (
                        <Check size={16} />
                      ) : (
                        <Download size={16} />
                      )}
                      {downloading ? 'Generating…' : downloaded ? 'Downloaded!' : 'Download PNG'}
                    </motion.button>

                    <p className="text-center text-xs text-ink-600 font-sans">
                      Your quote card is free to share anywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Off-screen render target at full 1080×1080 */}
          <div
            style={{
              position: 'fixed',
              top: '-9999px',
              left: '-9999px',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          >
            <div ref={cardRef}>
              <QuoteCard
                style={style}
                quote={quote || ' '}
                source={source || ' '}
                author={author || 'Iron Heist'}
              />
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function getStyleSwatch(s: CardStyle): string {
  const swatches: Record<string, string> = {
    midnight: '#1a1208',
    parchment: '#f2e8cc',
    noir: '#111111',
    dusk: '#1a1035',
    ember: '#1a0f08',
  }
  return swatches[s.id] ?? '#000'
}
