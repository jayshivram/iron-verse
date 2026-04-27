import { BlogCard } from './BlogCard'
import type { BlogPost } from '@/types/database.types'

interface RelatedPostsProps {
  posts: BlogPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-ink-800">
      <h2 className="font-serif text-2xl font-semibold text-ink-50 mb-8">
        More to read
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post, i) => (
          <BlogCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </section>
  )
}
