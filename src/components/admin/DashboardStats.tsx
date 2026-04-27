import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import { queryKeys } from '@/lib/react-query'
import { motion } from 'framer-motion'
import { BookOpen, FileText, Users, Download, Eye, MessageSquare, Mail } from 'lucide-react'
import { Skeleton } from '@/components/ui/SkeletonLoader'
import { formatCount } from '@/utils/formatters'

const ICONS: Record<string, React.ReactNode> = {
  total_books: <BookOpen size={20} />,
  total_posts: <FileText size={20} />,
  total_subscribers: <Mail size={20} />,
  total_downloads: <Download size={20} />,
  total_views: <Eye size={20} />,
  pending_comments: <MessageSquare size={20} />,
  unread_messages: <Users size={20} />,
}

const LABELS: Record<string, string> = {
  total_books: 'Books',
  total_posts: 'Blog posts',
  total_subscribers: 'Subscribers',
  total_downloads: 'Downloads',
  total_views: 'Page views',
  pending_comments: 'Pending comments',
  unread_messages: 'Unread messages',
}

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: queryKeys.admin.stats as unknown as readonly unknown[],
    queryFn: analyticsService.getAdminStats,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-ink-800 p-5">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, value], i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="rounded-xl border border-ink-800 bg-ink-900 p-5 hover:border-ink-600 transition-colors"
        >
          <div className="flex items-center gap-2 text-amber-500 mb-3">
            {ICONS[key]}
            <span className="text-xs font-sans text-ink-500 ml-1">{LABELS[key]}</span>
          </div>
          <p className="font-display text-3xl text-ink-50">{formatCount(value as number)}</p>
        </motion.div>
      ))}
    </div>
  )
}
