import { Moon, Sun } from 'lucide-react'
import { useThemeContext } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'

export function DarkModeToggle() {
  const { isDark, toggle } = useThemeContext()

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-9 h-9 flex items-center justify-center rounded-md
                 text-ink-400 hover:text-ink-100 hover:bg-ink-800
                 transition-colors duration-200 focus-visible:outline-2
                 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
    >
      <motion.span
        key={isDark ? 'moon' : 'sun'}
        initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </motion.span>
    </button>
  )
}
