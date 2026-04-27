import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SOCIAL_LINKS } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { Instagram } from 'lucide-react'

function WattpadIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 4H17.5L15 15.5L12.5 7H11.5L9 15.5L6.5 4H1L5.5 20H7L9.5 11L12 20H13.5L16 8.5L18.5 20H23L23 4Z" />
    </svg>
  )
}

function TumblrIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.304 1.406z"/>
    </svg>
  )
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, signOut } = useAuth()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45] bg-ink-950/60 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[50] w-72 bg-ink-900 border-l border-ink-800
                       flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-ink-800">
              <span className="font-display text-lg text-amber-500">Menu</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.2, ease: 'easeOut' }}
                >
                  <NavLink
                    to={link.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center px-4 py-3.5 rounded-lg text-base font-sans',
                        'transition-colors duration-150 mb-1',
                        isActive
                          ? 'text-amber-500 bg-amber-950'
                          : 'text-ink-200 hover:text-ink-50 hover:bg-ink-800',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="my-4 border-t border-ink-800" />

              {user ? (
                <>
                  <Link
                    to="/bookmarks"
                    onClick={onClose}
                    className="flex items-center px-4 py-3.5 rounded-lg text-base font-sans
                               text-ink-200 hover:text-ink-50 hover:bg-ink-800 transition-colors duration-150 mb-1"
                  >
                    Bookmarks
                  </Link>
                  <button
                    onClick={() => { signOut(); onClose() }}
                    className="w-full flex items-center px-4 py-3.5 rounded-lg text-base font-sans
                               text-ink-400 hover:text-ink-100 hover:bg-ink-800 transition-colors duration-150"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center px-4 py-3 rounded-lg
                             bg-amber-500 text-ink-950 font-medium font-sans text-sm"
                >
                  Sign in
                </Link>
              )}
            </nav>

            <div className="px-5 py-4 border-t border-ink-800 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-ink-400 hover:text-amber-500 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.wattpad}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wattpad"
                className="text-ink-400 hover:text-amber-500 transition-colors"
              >
                <WattpadIcon size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.tumblr}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tumblr"
                className="text-ink-400 hover:text-amber-500 transition-colors"
              >
                <TumblrIcon size={18} />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
