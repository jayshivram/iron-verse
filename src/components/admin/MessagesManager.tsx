import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactService } from '@/services/newsletter.service'
import { queryKeys } from '@/lib/react-query'
import { formatDate } from '@/utils/formatters'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Trash2, Mail, MailOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/utils/cn'

export function MessagesManager() {
  const qc = useQueryClient()
  const { data: messages, isLoading } = useQuery({
    queryKey: queryKeys.admin.messages as unknown as readonly unknown[],
    queryFn: contactService.getAllMessages,
  })

  const markRead = useMutation({
    mutationFn: contactService.markAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.messages }),
  })

  const deleteMsg = useMutation({
    mutationFn: contactService.deleteMessage,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.messages }),
  })

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="font-display text-2xl text-ink-50">Contact messages</h1>
        {messages && (
          <span className="text-sm text-ink-500 font-sans">
            {messages.filter((m) => !m.is_read).length} unread
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="space-y-3">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'rounded-xl border p-5',
                !msg.is_read ? 'border-amber-500/30 bg-amber-500/5' : 'border-ink-800 bg-ink-900',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-ink-100 font-sans">{msg.name}</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-amber-500 hover:underline font-sans"
                    >
                      {msg.email}
                    </a>
                    {!msg.is_read && (
                      <span className="ml-auto text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-sans">
                        New
                      </span>
                    )}
                    <time className="text-xs text-ink-600 font-sans">
                      {formatDate(msg.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>
                  {msg.subject && (
                    <p className="text-sm font-medium text-ink-300 font-sans mb-1">{msg.subject}</p>
                  )}
                  <p className="text-sm text-ink-400 font-sans leading-relaxed">{msg.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!msg.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<MailOpen size={13} />}
                      onClick={async () => {
                        try {
                          await markRead.mutateAsync(msg.id)
                        } catch {
                          toast.error('Failed')
                        }
                      }}
                    >
                      Mark read
                    </Button>
                  )}
                  <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}>
                    <Button variant="secondary" size="sm" leftIcon={<Mail size={13} />}>
                      Reply
                    </Button>
                  </a>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 size={13} />}
                    onClick={async () => {
                      try {
                        await deleteMsg.mutateAsync(msg.id)
                        toast.success('Message deleted')
                      } catch {
                        toast.error('Failed')
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {messages?.length === 0 && (
            <div className="text-center py-16 text-ink-500 font-sans text-sm">
              No messages yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
