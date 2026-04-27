import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)
  const smoothProgress = useSpring(progress, { damping: 30, stiffness: 200 })

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      if (total > 0) {
        setProgress((scrollTop / total) * 100)
      }
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-amber-500 origin-left z-[60]"
      style={{ scaleX: useTransform(smoothProgress, [0, 100], [0, 1]) }}
      aria-hidden="true"
    />
  )
}
