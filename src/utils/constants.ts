export const SITE_NAME = 'Iron Verse'
export const SITE_DESCRIPTION =
  'Nine poetry books. All free. Words about grief, love, obsession, and the ordinary ache of being alive.'
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://iron-verse.vercel.app'

export const BOOKS_PER_PAGE = 9
export const POSTS_PER_PAGE = 10
export const COMMENTS_PER_PAGE = 20

export const MAX_COMMENT_LENGTH = 1000
export const MAX_BIO_LENGTH = 500

export const READING_SAVE_INTERVAL = 5000 // ms between saves

export const DEFAULT_AVATAR = '/images/ui/default-avatar.webp'

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/poetsanctuary',
  twitter: 'https://twitter.com/poetsanctuary',
  goodreads: 'https://goodreads.com/poetsanctuary',
}

export const NAV_LINKS = [
  { label: 'Books', href: '/books' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export const BLOG_CATEGORIES = [
  'Reflections',
  'Craft',
  'Reading',
  'Personal',
  'Writing Process',
] as const

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Books', href: '/admin/books', icon: 'BookOpen' },
  { label: 'Blog Posts', href: '/admin/blog', icon: 'FileText' },
  { label: 'Comments', href: '/admin/comments', icon: 'MessageSquare' },
  { label: 'Subscribers', href: '/admin/subscribers', icon: 'Mail' },
  { label: 'Messages', href: '/admin/messages', icon: 'Inbox' },
] as const

// Session ID key in localStorage
export const SESSION_ID_KEY = 'ps_session_id'
