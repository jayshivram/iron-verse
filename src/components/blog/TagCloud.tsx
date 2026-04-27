import { Link } from 'react-router-dom'
import { useBlogTags } from '@/hooks/useBlogPosts'
import { cn } from '@/utils/cn'

interface TagCloudProps {
  activeTags?: string[]
  maxTags?: number
}

export function TagCloud({ activeTags = [], maxTags = 30 }: TagCloudProps) {
  const { data: tags = [] } = useBlogTags()

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, maxTags).map((tag) => (
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
  )
}
