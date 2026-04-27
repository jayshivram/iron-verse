import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams, Link } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'
import { useDebouncedValue } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/Input'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SITE_NAME } from '@/utils/constants'
import { Search as SearchIcon, BookOpen, FileText } from 'lucide-react'
import { formatDate } from '@/utils/formatters'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebouncedValue(query, 400)
  const { data, isLoading } = useSearch(debouncedQuery)

  const books = data?.books || []
  const posts = data?.posts || []
  const hasResults = books.length > 0 || posts.length > 0

  return (
    <>
      <Helmet>
        <title>Search — {SITE_NAME}</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        <Breadcrumbs items={[{ label: 'Search', href: '/search' }]} />

        <h1 className="font-display text-4xl text-ink-50 mt-6 mb-8">Search</h1>

        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value) {
              setSearchParams({ q: e.target.value })
            } else {
              setSearchParams({})
            }
          }}
          placeholder="Search books, posts, poems..."
          leftIcon={<SearchIcon size={16} />}
          autoFocus
          aria-label="Search"
          className="text-lg py-3.5"
        />

        {debouncedQuery && (
          <div className="mt-10 space-y-10">
            {isLoading && (
              <p className="text-ink-500 font-sans text-sm">Searching...</p>
            )}

            {!isLoading && !hasResults && (
              <p className="text-ink-500 font-sans text-sm">
                Nothing found for "{debouncedQuery}".
              </p>
            )}

            {books.length > 0 && (
              <div>
                <h2 className="font-serif text-lg text-ink-300 mb-4 flex items-center gap-2">
                  <BookOpen size={16} className="text-amber-500" />
                  Books ({books.length})
                </h2>
                <ul className="space-y-3">
                  {books.map((book) => (
                    <li key={book.id}>
                      <Link
                        to={`/books/${book.slug}`}
                        className="flex items-center gap-4 p-3.5 rounded-lg border border-ink-800
                                   hover:border-ink-600 hover:bg-ink-900 transition-all group"
                      >
                        <img
                          src={book.cover_image_url}
                          alt=""
                          className="w-10 h-14 object-cover rounded ring-1 ring-ink-700 shrink-0"
                        />
                        <div>
                          <p className="font-sans font-medium text-ink-100 group-hover:text-amber-500 transition-colors">
                            {book.title}
                          </p>
                          {book.subtitle && (
                            <p className="text-xs text-ink-500">{book.subtitle}</p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {posts.length > 0 && (
              <div>
                <h2 className="font-serif text-lg text-ink-300 mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-amber-500" />
                  Posts ({posts.length})
                </h2>
                <ul className="space-y-3">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex flex-col p-3.5 rounded-lg border border-ink-800
                                   hover:border-ink-600 hover:bg-ink-900 transition-all group"
                      >
                        <p className="font-sans font-medium text-ink-100 group-hover:text-amber-500 transition-colors">
                          {post.title}
                        </p>
                        {post.excerpt && (
                          <p className="text-xs text-ink-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
                        )}
                        {post.published_at && (
                          <time className="text-xs text-ink-600 mt-1 font-sans">
                            {formatDate(post.published_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </time>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
