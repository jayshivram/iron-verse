export interface Book {
  id: string
  title: string
  slug: string
  subtitle: string | null
  description: string
  long_description: string | null
  cover_image_url: string
  pdf_url: string
  pdf_size_bytes: number | null
  page_count: number | null
  published_year: number | null
  publisher: string | null
  isbn: string | null
  language: string
  is_featured: boolean
  is_published: boolean
  tags: string[]
  view_count: number
  download_count: number
  seo_title: string | null
  seo_description: string | null
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  tags: string[]
  category: string | null
  reading_time_minutes: number
  view_count: number
  like_count: number
  is_published: boolean
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  author_id: string | null
  created_at: string
  updated_at: string
  author?: Profile
}

export interface Comment {
  id: string
  post_id: string
  parent_id: string | null
  author_name: string
  author_email: string | null
  author_website: string | null
  content: string
  is_approved: boolean
  is_spam: boolean
  like_count: number
  created_at: string
  replies?: Comment[]
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  social_links: Record<string, string>
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  book_id: string
  notes: string | null
  created_at: string
  book?: Book
}

export interface ReadingProgress {
  id: string
  user_id: string
  book_id: string
  current_page: number
  percentage: number
  last_read_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name: string | null
  is_active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  replied: boolean
  created_at: string
}

export interface PostLike {
  id: string
  post_id: string
  session_id: string
  created_at: string
}
