import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Search, X } from 'lucide-react'
import { useDebouncedValue } from '@/hooks/useDebounce'
import { useSearch } from '@/hooks/useSearch'
import { Link } from 'react-router-dom'
import { truncate } from '@/utils/helpers'

export function BlogSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 400)
  const { data, isLoading } = useSearch(debouncedQuery)

  const posts = data?.posts || []

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        leftIcon={<Search size={16} />}
        rightIcon={
          query ? (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <X size={14} />
            </button>
          ) : null
        }
        aria-label="Search blog posts"
      />

      {debouncedQuery && posts.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-ink-900 border border-ink-700 rounded-lg
                        shadow-ink z-20 overflow-hidden">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              onClick={() => setQuery('')}
              className="flex flex-col px-4 py-3 hover:bg-ink-800 border-b border-ink-800
                         last:border-0 transition-colors"
            >
              <span className="text-sm font-sans text-ink-100 font-medium">{post.title}</span>
              {post.excerpt && (
                <span className="text-xs text-ink-500 mt-0.5">{truncate(post.excerpt, 80)}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      {debouncedQuery && !isLoading && posts.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-ink-900 border border-ink-700 rounded-lg
                        shadow-ink z-20 px-4 py-3">
          <p className="text-sm text-ink-500 font-sans">No posts found for "{debouncedQuery}"</p>
        </div>
      )}
    </div>
  )
}
