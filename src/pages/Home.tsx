import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedBooks } from '@/components/home/FeaturedBooks'
import { LatestBlogPosts } from '@/components/home/LatestBlogPosts'
import { StatsCounter } from '@/components/home/StatsCounter'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'
import { QuotesCarousel } from '@/components/home/QuotesCarousel'
import { SpotifySection } from '@/components/home/SpotifySection'
import { SEOHead } from '@/components/ui/SEOHead'

export default function Home() {
  return (
    <>
      <SEOHead
        title="Iron Verse — Poetry by Iron Heist"
        titleExact
        description="Nine free poetry collections by Iron Heist. Raw, honest writing about grief, longing, desire, and the ordinary ache of being alive. Read online or download — all free, always."
        path="/"
        keywords={['grief poetry', 'love poetry', 'sad poetry', 'emotional poetry', 'free poetry books', 'poetry PDF download']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Iron Verse',
          url: 'https://iron-verse-poetry.vercel.app/',
          description: 'Nine free poetry collections by Iron Heist',
          author: {
            '@type': 'Person',
            name: 'Iron Heist',
            url: 'https://iron-verse-poetry.vercel.app/about',
          },
        }}
      />
      <HeroSection />
      <FeaturedBooks />
      <StatsCounter />
      <QuotesCarousel />
      <SpotifySection />
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
