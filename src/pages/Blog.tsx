import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { BlogCardSkeleton } from '@/components/ui/SkeletonLoader'
import { Pagination } from '@/components/ui/Pagination'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SITE_NAME, POSTS_PER_PAGE } from '@/utils/constants'

export default function Blog() {
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  const category = searchParams.get('category') || undefined
  const tag = searchParams.get('tag') || undefined

  const { data, isLoading } = useBlogPosts({
    category,
    tags: tag ? [tag] : undefined,
    page,
    pageSize: POSTS_PER_PAGE,
  })

  const posts = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <>
      <Helmet>
        <title>Blog — {SITE_NAME}</title>
        <meta name="description" content="Writing about the process, the work, and the world the poems come from." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />

        <div className="mb-10 mt-6">
          <p className="text-xs uppercase tracking-widest text-amber-500 font-sans mb-3">Writing</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-ink-50 leading-none">
            From the notebook
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          {/* Posts */}
          <div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-ink-500 font-sans text-sm">
                No posts found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map((post, i) => <BlogCard key={post.id} post={post} index={i} />)}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
            )}
          </div>

          {/* Sidebar */}
          <BlogSidebar activeCategory={category} activeTags={tag ? [tag] : []} />
        </div>
      </div>
    </>
  )
}
