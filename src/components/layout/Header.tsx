import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Menu, X, User, LogOut } from 'lucide-react'
import { NAV_LINKS } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import { MobileMenu } from './MobileMenu'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'
import { cn } from '@/utils/cn'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300',
          'border-b',
          scrolled
            ? 'bg-ink-900/70 border-ink-800/60 backdrop-blur-md backdrop-saturate-150'
            : 'bg-transparent border-transparent',
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Wordmark */}
            <Link to="/" className="group flex items-center gap-2.5" aria-label="Home">
              <span className="font-display text-xl text-amber-500 group-hover:text-amber-400 transition-colors duration-200">
                Poet's Sanctuary
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'px-3.5 py-2 rounded-md text-sm font-sans transition-colors duration-150',
                      isActive
                        ? 'text-amber-500'
                        : 'text-ink-300 hover:text-ink-100',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                to="/search"
                aria-label="Search"
                className="w-9 h-9 flex items-center justify-center rounded-md text-ink-400
                           hover:text-ink-100 hover:bg-ink-800 transition-colors duration-150"
              >
                <Search size={18} />
              </Link>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                    className="w-9 h-9 flex items-center justify-center rounded-md text-ink-400
                               hover:text-ink-100 hover:bg-ink-800 transition-colors duration-150"
                  >
                    <User size={18} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-48 bg-ink-800 border border-ink-700
                                   rounded-lg shadow-ink overflow-hidden"
                      >
                        <div className="px-3 py-2 border-b border-ink-700">
                          <p className="text-xs text-ink-400 font-sans truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/bookmarks"
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink-200
                                     hover:bg-ink-700 hover:text-ink-50 transition-colors duration-150"
                        >
                          <BookOpen size={15} />
                          Bookmarks
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm text-amber-500
                                       hover:bg-ink-700 transition-colors duration-150"
                          >
                            Admin
                          </Link>
                        )}
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ink-400
                                     hover:bg-ink-700 hover:text-ink-100 transition-colors duration-150"
                        >
                          <LogOut size={15} />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex btn-secondary text-xs py-1.5 px-3"
                >
                  Sign in
                </Link>
              )}

              <DarkModeToggle />

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-md text-ink-400
                           hover:text-ink-100 hover:bg-ink-800 transition-colors duration-150"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
