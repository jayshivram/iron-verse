import { useParams, Link } from 'react-router-dom'
import { useBlogPost, useRelatedPosts } from '@/hooks/useBlogPosts'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CommentSection } from '@/components/blog/CommentSection'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { formatDate, formatReadingTime } from '@/utils/formatters'
import { blogService } from '@/services/blog.service'
import { useEffect } from 'react'
import { Clock, Calendar, Eye } from 'lucide-react'
import { formatCount } from '@/utils/formatters'
import { SEOHead } from '@/components/ui/SEOHead'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useBlogPost(slug!)
  const { data: related = [] } = useRelatedPosts(post?.id || '', post?.tags || [])

  useEffect(() => {
    if (post) {
      blogService.incrementViewCount(post.id)
    }
  }, [post?.id])

  if (isLoading) return <PageLoader />

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <h1 className="font-serif text-2xl text-ink-100 mb-3">Post not found</h1>
        <Link to="/blog" className="btn-secondary mt-4">Back to blog</Link>
      </div>
    )
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.excerpt || `Read ${post.title} on the Iron Verse blog by Iron Heist.`}
        path={`/blog/${post.slug}`}
        image={post.featured_image_url || undefined}
        imageAlt={post.title}
        type="article"
        publishedAt={post.published_at || undefined}
        modifiedAt={post.updated_at || undefined}
        keywords={post.tags || []}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          image: post.featured_image_url,
          url: `https://iron-verse-poetry.vercel.app/blog/${post.slug}`,
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          author: {
            '@type': 'Person',
            name: 'Iron Heist',
            url: 'https://iron-verse-poetry.vercel.app/about',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Iron Verse',
            url: 'https://iron-verse-poetry.vercel.app',
          },
          inLanguage: 'en',
        }}
      />

      <ReadingProgressBar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
          {/* Main */}
          <article>
            {/* Header */}
            <header className="mb-10">
              {post.category && (
                <span className="tag-amber mb-4 inline-block">{post.category}</span>
              )}
              <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] text-ink-50 leading-tight mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="font-serif text-xl text-ink-400 leading-relaxed mb-6">{post.excerpt}</p>
              )}

              <div className="flex flex-wrap items-center gap-5 text-sm text-ink-500 font-sans">
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(post.published_at, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {formatReadingTime(post.reading_time_minutes)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={13} />
                  {formatCount(post.view_count)} views
                </span>
              </div>
            </header>

            {/* Featured image */}
            {post.featured_image_url && (
              <div className="rounded-xl overflow-hidden mb-10 ring-1 ring-ink-800">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full aspect-video object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert prose-amber max-w-none font-sans"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-ink-900">
                {post.tags.map((tag) => (
                  <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="tag hover:border-ink-500">
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8">
              <ShareButtons url={currentUrl} title={post.title} />
            </div>

            {/* Comments */}
            <CommentSection postId={post.id} />

            {/* Related */}
            <RelatedPosts posts={related} />
          </article>

          {/* Sidebar */}
          <BlogSidebar activeCategory={post.category || undefined} />
        </div>
      </div>
    </>
  )
}
