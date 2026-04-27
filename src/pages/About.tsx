import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SITE_NAME } from '@/utils/constants'
import { BookOpen, Heart } from 'lucide-react'

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — {SITE_NAME}</title>
        <meta name="description" content="About Iron Heist, the poet behind these nine free collections." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-xs uppercase tracking-widest text-amber-500 font-sans mb-6">About</p>
          <h1 className="font-display text-[clamp(3rem,8vw,5.5rem)] text-ink-50 leading-none mb-10">
            Iron Heist
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="prose prose-invert prose-amber max-w-none font-sans"
        >
          <p>
            I write because the alternative is carrying it around unsaid. Poetry is where I put
            the things that don't fit anywhere else: grief that outlasts the reason for it, love
            that arrives at the wrong time, the strange comfort of 3am.
          </p>

          <p>
            Nine collections. All free. That part matters to me. I didn't write these for a market
            or a shelf. I wrote them to reach people who might recognize something of themselves
            in the words. A paywall between the poem and the reader seems like a betrayal of that.
          </p>

          <p>
            The name is a contradiction on purpose. <em>Iron</em>: something rigid, cold, industrial.
            <em>Heist</em>: something stolen, urgent, barely planned. That tension is where most of
            these poems live.
          </p>

          <h2>The work</h2>
          <p>
            Each collection has its own center of gravity. <em>Garden of Grief</em> is the oldest,
            written over three years. <em>Midday Blues</em> took four months. <em>Drunk Off Her</em>
            happened in a single terrible week. They're all different, and they're all the same person.
          </p>

          <h2>Contact & community</h2>
          <p>
            If a poem meant something to you, I'd genuinely like to hear it. Use the{' '}
            <Link to="/contact">contact page</Link>, or find me wherever the internet has
            deposited me this week.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex gap-4 mt-12"
        >
          <Link to="/books" className="btn-primary flex items-center gap-2">
            <BookOpen size={16} />
            Read the poetry
          </Link>
          <Link to="/contact" className="btn-secondary flex items-center gap-2">
            <Heart size={16} />
            Say hello
          </Link>
        </motion.div>
      </div>
    </>
  )
}
