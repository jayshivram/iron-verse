import { Link } from 'react-router-dom'
import { BlogSearch } from './BlogSearch'
import { useBlogTags } from '@/hooks/useBlogPosts'
import { useRecentPosts } from '@/hooks/useBlogPosts'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { formatDate } from '@/utils/formatters'
import { Tag } from 'lucide-react'
import { BLOG_CATEGORIES } from '@/utils/constants'
import { cn } from '@/utils/cn'

interface BlogSidebarProps {
  activeCategory?: string
  activeTags?: string[]
}

export function BlogSidebar({ activeCategory, activeTags = [] }: BlogSidebarProps) {
  const { data: tags = [] } = useBlogTags()
  const { data: recentPosts = [] } = useRecentPosts(5)

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="font-serif text-base font-semibold text-ink-200 mb-3">Search</h3>
        <BlogSearch />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-serif text-base font-semibold text-ink-200 mb-3">Categories</h3>
        <ul className="space-y-1">
          <li>
            <Link
              to="/blog"
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-md text-sm font-sans transition-colors',
                !activeCategory
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800',
              )}
            >
              All posts
            </Link>
          </li>
          {BLOG_CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                to={`/blog?category=${cat}`}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-md text-sm font-sans transition-colors',
                  activeCategory === cat
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800',
                )}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div>
          <h3 className="font-serif text-base font-semibold text-ink-200 mb-3">Recent posts</h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col gap-0.5"
                >
                  <span className="text-sm font-sans text-ink-300 group-hover:text-amber-500
                                   transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </span>
                  {post.published_at && (
                    <time className="text-xs text-ink-600 font-sans">
                      {formatDate(post.published_at, { month: 'short', day: 'numeric' })}
                    </time>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="font-serif text-base font-semibold text-ink-200 mb-3 flex items-center gap-2">
            <Tag size={14} /> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                className={cn(
                  'tag transition-colors',
                  activeTags.includes(tag)
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                    : 'hover:border-ink-500 hover:text-ink-100',
                )}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="rounded-xl border border-ink-800 p-5 bg-ink-900/50">
        <NewsletterSignup compact />
      </div>
    </aside>
  )
}
