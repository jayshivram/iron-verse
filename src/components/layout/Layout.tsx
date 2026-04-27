import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToTop } from '@/components/ui/ScrollToTop'

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
