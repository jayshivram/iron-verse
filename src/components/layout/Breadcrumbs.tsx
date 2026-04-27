import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 text-xs font-sans text-ink-500">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-ink-300 transition-colors"
            aria-label="Home"
          >
            <Home size={12} />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="text-ink-700" aria-hidden />
            {item.href && i < items.length - 1 ? (
              <Link to={item.href} className="hover:text-ink-300 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-300" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
