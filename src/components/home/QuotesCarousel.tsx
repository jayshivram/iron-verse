import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { BOOK_QUOTES } from '@/data/quotes.static'

// Show a random subset to keep it fresh without being predictable
function getShuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function QuotesCarousel() {
  const [quotes] = useState(() => getShuffled(BOOK_QUOTES))
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setDirection(1)
    setIndex((i) => (i + 1) % quotes.length)
  }, [quotes.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => (i - 1 + quotes.length) % quotes.length)
  }, [quotes.length])

  useEffect(() => {
    if (isPaused) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next, isPaused])

  const quote = quotes[index]

  return (
    <section
      className="py-24 px-6 border-t border-ink-900 relative overflow-hidden"
      aria-label="Quotes from the books"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative">
        {/* Section label */}
        <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-sans mb-10">
          Words from the page
        </p>

        {/* Quote mark */}
        <Quote
          size={32}
          className="text-amber-500/30 mx-auto mb-6"
          aria-hidden="true"
        />

        {/* Animated quote */}
        <div className="min-h-[10rem] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.blockquote
              key={index}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full"
            >
              <p className="font-serif text-xl md:text-2xl text-ink-100 leading-relaxed italic mb-6">
                "{quote.text}"
              </p>
              <footer className="font-sans text-sm text-ink-400">
                <cite className="not-italic">
                  <span className="text-ink-300">— {quote.poem}</span>
                  <span className="mx-2 text-ink-700">·</span>
                  <Link
                    to={`/books/${quote.bookSlug}`}
                    className="text-amber-500 hover:text-amber-400 transition-colors duration-150 underline-offset-2 hover:underline"
                  >
                    {quote.bookTitle}
                  </Link>
                </cite>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            aria-label="Previous quote"
            className="p-2 rounded-full border border-ink-800 text-ink-400 hover:border-amber-500 hover:text-amber-500 transition-colors duration-150"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dot indicators — show at most 7 dots */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Quote selector">
            {quotes.slice(0, Math.min(quotes.length, 7)).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index % Math.min(quotes.length, 7)}
                aria-label={`Quote ${i + 1}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1)
                  setIndex(i)
                }}
                className={[
                  'rounded-full transition-all duration-300',
                  i === index % Math.min(quotes.length, 7)
                    ? 'w-5 h-1.5 bg-amber-500'
                    : 'w-1.5 h-1.5 bg-ink-700 hover:bg-ink-500',
                ].join(' ')}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next quote"
            className="p-2 rounded-full border border-ink-800 text-ink-400 hover:border-amber-500 hover:text-amber-500 transition-colors duration-150"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
