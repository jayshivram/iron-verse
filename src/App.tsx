import { Suspense, lazy, Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { queryClient } from '@/lib/react-query'
import { Layout } from '@/components/layout/Layout'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { ScrollToTop } from '@/components/ui/ScrollToTop'

// ─── Error boundary ──────────────────────────────────────────────────────────
interface EBState { error: Error | null }
class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace', color: '#f87171' }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

// Lazy page imports
const Home = lazy(() => import('@/pages/Home'))
const Books = lazy(() => import('@/pages/Books'))
const BookDetail = lazy(() => import('@/pages/BookDetail'))
const BookReader = lazy(() => import('@/pages/BookReader'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPostPage = lazy(() => import('@/pages/BlogPost'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Search = lazy(() => import('@/pages/Search'))
const Bookmarks = lazy(() => import('@/pages/Bookmarks'))
const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.default })))
const AdminHome = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminHome })))
const BooksManager = lazy(() => import('@/components/admin/BooksManager').then((m) => ({ default: m.BooksManager })))
const BookForm = lazy(() => import('@/components/admin/BookForm').then((m) => ({ default: m.BookForm })))
const BlogPostsManager = lazy(() => import('@/components/admin/BlogPostsManager').then((m) => ({ default: m.BlogPostsManager })))
const BlogPostForm = lazy(() => import('@/components/admin/BlogPostForm').then((m) => ({ default: m.BlogPostForm })))
const CommentsManager = lazy(() => import('@/components/admin/CommentsManager').then((m) => ({ default: m.CommentsManager })))
const SubscribersManager = lazy(() => import('@/components/admin/SubscribersManager').then((m) => ({ default: m.SubscribersManager })))
const MessagesManager = lazy(() => import('@/components/admin/MessagesManager').then((m) => ({ default: m.MessagesManager })))

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'oklch(11% 0.015 48)',
                    color: 'oklch(93% 0.008 48)',
                    border: '1px solid oklch(18% 0.012 48)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  },
                }}
              />

              <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes with full layout */}
                  <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="books" element={<Books />} />
                    <Route path="books/:slug" element={<BookDetail />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogPostPage />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="search" element={<Search />} />
                    <Route path="bookmarks" element={<Bookmarks />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Book reader — minimal layout (no header/footer) */}
                  <Route path="books/:slug/read" element={<BookReader />} />

                  {/* Admin — own layout */}
                  <Route path="admin" element={<AdminDashboard />}>
                    <Route index element={<AdminHome />} />
                    <Route path="books" element={<BooksManager />} />
                    <Route path="books/new" element={<BookForm />} />
                    <Route path="books/:id/edit" element={<BookForm />} />
                    <Route path="blog" element={<BlogPostsManager />} />
                    <Route path="blog/new" element={<BlogPostForm />} />
                    <Route path="blog/:id/edit" element={<BlogPostForm />} />
                    <Route path="comments" element={<CommentsManager />} />
                    <Route path="subscribers" element={<SubscribersManager />} />
                    <Route path="messages" element={<MessagesManager />} />
                  </Route>
                </Routes>
              </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
