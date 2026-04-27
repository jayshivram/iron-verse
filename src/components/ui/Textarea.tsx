import React, { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn('textarea', error && 'border-red-500 focus:border-red-500', className)}
          {...props}
        />
        {error && <p className="field-error">{error}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
