import { Helmet } from 'react-helmet-async'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedBooks } from '@/components/home/FeaturedBooks'
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts'
import { StatsCounter } from '@/components/home/StatsCounter'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { QuotesCarousel } from '@/components/home/QuotesCarousel'
import { SITE_NAME } from '@/utils/constants'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{SITE_NAME} — Poetry by Iron Heist</title>
        <meta name="description" content="Nine free poetry collections by Iron Heist. Raw, honest writing about grief, longing, and everything between." />
      </Helmet>

      <HeroSection />
      <FeaturedBooks />
      <StatsCounter />
      <QuotesCarousel />
      <LatestBlogPosts />

      {/* Newsletter CTA */}
      <section className="py-24 px-6 border-t border-ink-900">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </>
  )
}
