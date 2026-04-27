import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogCardSkeleton } from '@/components/ui/SkeletonLoader'
import { useRecentPosts } from '@/hooks/useBlogPosts'
import { ArrowRight } from 'lucide-react'

export function LatestBlogPosts() {
  const { data: posts, isLoading } = useRecentPosts(3)

  if (!isLoading && (!posts || posts.length === 0)) return null

  return (
    <section className="py-24 px-6 bg-ink-900/40" aria-labelledby="latest-posts-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-500 font-sans mb-3">
              Writing
            </p>
            <h2
              id="latest-posts-heading"
              className="font-display text-[clamp(2rem,5vw,3.5rem)] text-ink-50 leading-none"
            >
              From the notebook
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-sans text-ink-400
                       hover:text-amber-500 transition-colors"
          >
            All posts
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)
            : posts?.map((post, i) => (
                <BlogCard key={post.id} post={post} index={i} />
              ))
          }
        </div>

        <Link
          to="/blog"
          className="sm:hidden mt-8 flex items-center justify-center gap-2 text-sm font-sans
                     text-ink-400 hover:text-amber-500 transition-colors"
        >
          All posts <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}
