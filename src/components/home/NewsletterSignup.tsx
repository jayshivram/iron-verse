import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { newsletterService } from '@/services/newsletter.service'
import { Mail, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  name: z.string().min(1).max(100).optional(),
})
type FormData = z.infer<typeof schema>

interface NewsletterSignupProps {
  compact?: boolean
  className?: string
}

export function NewsletterSignup({ compact = false, className }: NewsletterSignupProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await newsletterService.subscribe(data.email, data.name)
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('text-center', className)}
      >
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
          <Check size={22} className="text-green-400" />
        </div>
        <p className="font-serif text-lg text-ink-100">You're in.</p>
        <p className="text-sm text-ink-400 font-sans mt-1">
          New poems and posts will find their way to you.
        </p>
      </motion.div>
    )
  }

  if (compact) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 mb-3">
          <Mail size={15} className="text-amber-500" />
          <h3 className="font-serif text-sm font-semibold text-ink-200">Get new posts by email</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2" noValidate>
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            className="input flex-1 text-sm py-2"
            autoComplete="email"
          />
          <button type="submit" disabled={isSubmitting} className="btn-primary text-sm py-2 px-4">
            {isSubmitting ? '...' : 'Subscribe'}
          </button>
        </form>
        {errors.email && <p className="field-error mt-1">{errors.email.message}</p>}
      </div>
    )
  }

  return (
    <div className={cn('max-w-lg mx-auto text-center', className)}>
      <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
        <Mail size={24} className="text-amber-500" />
      </div>

      <h2 className="font-display text-3xl text-ink-50 mb-2">Stay in the words</h2>
      <p className="text-ink-400 font-sans text-sm mb-8 max-w-sm mx-auto leading-relaxed">
        New collections, blog posts, and the occasional note about the process. No noise, just writing.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              className="input w-full"
              autoComplete="email"
            />
            {errors.email && <p className="field-error mt-1">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary px-6">
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm text-red-400 font-sans">
            <AlertCircle size={14} />
            Something went wrong. Try again.
          </div>
        )}

        <p className="text-xs text-ink-600 font-sans">No spam, ever. Unsubscribe anytime.</p>
      </form>
    </div>
  )
}
