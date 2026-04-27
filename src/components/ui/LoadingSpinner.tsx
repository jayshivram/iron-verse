import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
}

export function LoadingSpinner({ size = 'md', className, label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center" role="status" aria-label={label}>
      <span
        className={cn(
          'rounded-full border-ink-600 border-t-amber-500 animate-spin',
          sizes[size],
          className,
        )}
      />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950">
      <LoadingSpinner size="lg" />
    </div>
  )
}
