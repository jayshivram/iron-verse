import { Link } from 'react-router-dom'
import { Instagram, Twitter, Heart } from 'lucide-react'
import { NAV_LINKS, SOCIAL_LINKS, SITE_NAME } from '@/utils/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-2xl text-amber-500">
              {SITE_NAME}
            </Link>
            <p className="mt-3 text-sm text-ink-400 font-sans leading-relaxed max-w-xs">
              Nine books. All free. Words about grief, love, obsession, and the ordinary ache of being alive.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-ink-500 hover:text-amber-500 transition-colors duration-150"
              >
                <Instagram size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-ink-500 hover:text-amber-500 transition-colors duration-150"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-ink-500 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-ink-400 font-sans hover:text-ink-100 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  className="text-sm text-ink-400 font-sans hover:text-ink-100 transition-colors duration-150"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Reading */}
          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-ink-500 mb-4">
              Start Reading
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/books/garden-of-grief"
                  className="text-sm text-ink-400 font-sans hover:text-ink-100 transition-colors duration-150"
                >
                  Garden of Grief
                </Link>
              </li>
              <li>
                <Link
                  to="/books/you-and-the-moon"
                  className="text-sm text-ink-400 font-sans hover:text-ink-100 transition-colors duration-150"
                >
                  You and the Moon
                </Link>
              </li>
              <li>
                <Link
                  to="/books/drunk-off-her"
                  className="text-sm text-ink-400 font-sans hover:text-ink-100 transition-colors duration-150"
                >
                  Drunk Off Her
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="text-sm text-amber-500 font-sans hover:text-amber-400 transition-colors duration-150"
                >
                  All nine books &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ink-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-600 font-sans">
            &copy; {year} {SITE_NAME}. All poetry rights reserved.
          </p>
          <p className="text-xs text-ink-600 font-sans flex items-center gap-1">
            Made with <Heart size={11} className="text-amber-700 fill-amber-700" /> and too many late nights.
          </p>
        </div>
      </div>
    </footer>
  )
}
