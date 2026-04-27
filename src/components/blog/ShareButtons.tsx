import { Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/utils/cn'

interface ShareButtonsProps {
  url: string
  title: string
  className?: string
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const links = [
    {
      label: 'Twitter',
      icon: <Twitter size={15} />,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    },
    {
      label: 'Facebook',
      icon: <Facebook size={15} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin size={15} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
  ]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs text-ink-500 font-sans mr-1">Share</span>

      {links.map(({ label, icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-ink-700
                     text-ink-400 hover:text-ink-100 hover:border-ink-500 transition-colors"
        >
          {icon}
        </a>
      ))}

      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="w-8 h-8 flex items-center justify-center rounded-full border border-ink-700
                   text-ink-400 hover:text-ink-100 hover:border-ink-500 transition-colors"
      >
        {copied ? <Check size={15} className="text-green-400" /> : <Link2 size={15} />}
      </button>
    </div>
  )
}
