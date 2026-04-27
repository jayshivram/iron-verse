import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {/* Dark mode background */}
        <img
          src="/images/ui/bg-1.webp"
          alt=""
          className="hidden dark:block w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Light mode background */}
        <img
          src="/images/ui/bg-2.webp"
          alt=""
          className="block dark:hidden w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Overlay — heavier in dark, lighter in light so bg-2 shows through */}
        <div className="absolute inset-0 bg-ink-950/70 dark:bg-ink-950/80" />
        {/* Vignette from bottom */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xs uppercase tracking-[0.3em] text-amber-500 font-sans mb-6"
        >
          Poetry by Iron Heist
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-display text-[clamp(3rem,10vw,7.5rem)] text-ink-50 leading-none mb-8"
        >
          Words that cost something to write.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55 }}
          className="font-serif text-xl text-ink-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Nine collections of raw, honest poetry. Grief, longing, desire, clarity.
          All of it free. All of it yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/books" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            <BookOpen size={18} />
            Read for free
          </Link>
          <Link
            to="/about"
            className="btn-ghost text-base px-6 py-3.5 flex items-center gap-2 text-ink-300 hover:text-ink-50"
          >
            About the poet
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-amber-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
        </div>
      </motion.div>
    </section>
  )
}
