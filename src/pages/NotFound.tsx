import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_NAME } from '@/utils/constants'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Not found — {SITE_NAME}</title>
      </Helmet>

      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-display text-[10rem] text-ink-900 leading-none select-none">404</p>
          <h1 className="font-display text-4xl text-ink-50 -mt-6 mb-4">Lost in the margins</h1>
          <p className="text-ink-400 font-sans text-base mb-10 max-w-sm">
            That page doesn't exist. Maybe it was a poem that didn't make it into the collection.
          </p>
          <Link to="/" className="btn-primary flex items-center gap-2 mx-auto w-fit">
            <Home size={16} />
            Back home
          </Link>
        </motion.div>
      </div>
    </>
  )
}
