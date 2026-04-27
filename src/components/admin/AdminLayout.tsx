import { NavLink, Outlet, Link } from 'react-router-dom'
import { ADMIN_NAV, SITE_NAME } from '@/utils/constants'
import { cn } from '@/utils/cn'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-ink-900 border-r border-ink-800',
          'transition-transform duration-300 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-ink-800">
          <Link to="/admin" className="font-display text-lg text-ink-50">
            {SITE_NAME}
            <span className="block text-xs font-sans text-ink-500 tracking-wider">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-ink-400 hover:text-ink-100 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  end={item.href === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans transition-colors',
                      isActive
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'text-ink-300 hover:bg-ink-800 hover:text-ink-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Back to site */}
        <div className="px-3 py-4 border-t border-ink-800">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-sans text-ink-500 hover:text-ink-100
                       px-3 py-2 rounded-md hover:bg-ink-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to site
          </Link>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-ink-800 bg-ink-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-ink-400 hover:text-ink-100 rounded"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <span className="font-display text-sm text-ink-50">{SITE_NAME} Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
