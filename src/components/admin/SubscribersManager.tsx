import { useQuery } from '@tanstack/react-query'
import { newsletterService } from '@/services/newsletter.service'
import { queryKeys } from '@/lib/react-query'
import { formatDate } from '@/utils/formatters'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { UserCheck, UserX } from 'lucide-react'

export function SubscribersManager() {
  const { data: subscribers, isLoading } = useQuery({
    queryKey: queryKeys.admin.subscribers as unknown as readonly unknown[],
    queryFn: newsletterService.getAllSubscribers,
  })

  const active = subscribers?.filter((s) => s.is_active) || []
  const inactive = subscribers?.filter((s) => !s.is_active) || []

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="font-display text-2xl text-ink-50">Newsletter subscribers</h1>
        {subscribers && (
          <span className="text-sm text-ink-500 font-sans">
            {active.length} active · {inactive.length} unsubscribed
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-ink-800">
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4">Email</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden sm:table-cell">Name</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3 pr-4 hidden md:table-cell">Subscribed</th>
                <th className="text-left text-xs uppercase tracking-wider text-ink-500 pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900">
              {subscribers?.map((sub) => (
                <tr key={sub.id} className="hover:bg-ink-900/50 transition-colors">
                  <td className="py-3.5 pr-4 text-ink-200">{sub.email}</td>
                  <td className="py-3.5 pr-4 text-ink-400 hidden sm:table-cell">
                    {sub.name || '—'}
                  </td>
                  <td className="py-3.5 pr-4 text-ink-500 hidden md:table-cell">
                    {formatDate(sub.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3.5">
                    {sub.is_active ? (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <UserCheck size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-ink-500">
                        <UserX size={12} /> Unsubscribed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {subscribers?.length === 0 && (
            <div className="text-center py-16 text-ink-500 font-sans text-sm">
              No subscribers yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
