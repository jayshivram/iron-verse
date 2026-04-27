import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDate, formatReadingTime } from '@/utils/formatters'
import type { BlogPost } from '@/types/database.types'
import { cn } from '@/utils/cn'
import { Eye, Heart, Clock } from 'lucide-react'
import { formatCount } from '@/utils/formatters'

interface BlogCardProps {
  post: BlogPost
  index?: number
  featured?: boolean
}

export function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: 'easeOut' }}
      className={cn(
        'group',
        featured && 'md:col-span-2',
      )}
    >
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <div className={cn(
          'flex flex-col h-full rounded-xl border border-ink-800',
          'hover:border-ink-600 transition-all duration-300',
          'overflow-hidden',
        )}>
          {/* Image */}
          {post.featured_image_url && (
            <div className={cn(
              'relative overflow-hidden shrink-0',
              featured ? 'aspect-video' : 'aspect-[16/9]',
            )}>
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col flex-1 p-5">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-3 text-xs font-sans text-ink-500">
              {post.category && (
                <span className="tag-amber">{post.category}</span>
              )}
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {formatDate(post.published_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              )}
            </div>

            {/* Title */}
            <h2 className={cn(
              'font-serif font-semibold text-ink-50 leading-snug',
              'group-hover:text-amber-500 transition-colors duration-200 mb-2',
              featured ? 'text-2xl' : 'text-lg',
            )}>
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-ink-400 font-sans leading-relaxed line-clamp-3 flex-1">
                {post.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-800">
              <div className="flex items-center gap-1.5 text-xs text-ink-500 font-sans">
                <Clock size={11} />
                {formatReadingTime(post.reading_time_minutes)}
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-600 font-sans">
                <span className="flex items-center gap-1">
                  <Eye size={11} /> {formatCount(post.view_count)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={11} /> {formatCount(post.like_count)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
