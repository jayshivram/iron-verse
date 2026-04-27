import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { BookOpen, Download, Eye, Users } from 'lucide-react'

interface Stat {
  label: string
  value: number
  suffix?: string
  icon: React.ReactNode
}

function CountUp({ target, duration = 1.8 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [isInView, target, duration])

  return <span ref={ref}>{display.toLocaleString()}</span>
}

const STATS: Stat[] = [
  { label: 'Poetry collections', value: 9, icon: <BookOpen size={20} /> },
  { label: 'Free downloads', value: 5000, suffix: '+', icon: <Download size={20} /> },
  { label: 'Readers reached', value: 12000, suffix: '+', icon: <Eye size={20} /> },
  { label: 'Community members', value: 800, suffix: '+', icon: <Users size={20} /> },
]

export function StatsCounter() {
  return (
    <section className="py-20 px-6" aria-label="Stats">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center
                              text-amber-500 mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="font-display text-4xl text-ink-50">
                <CountUp target={stat.value} />
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <p className="text-xs text-ink-500 font-sans mt-2 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
