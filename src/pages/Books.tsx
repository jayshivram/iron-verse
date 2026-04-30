import { BookGrid } from '@/components/books/BookGrid'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SEOHead } from '@/components/ui/SEOHead'

export default function Books() {
  return (
    <>
      <SEOHead
        title="All Poetry Collections"
        description="Browse all nine free poetry collections by Iron Heist. Read online instantly or download the PDF. Grief, love, longing, desire — all of it free."
        path="/books"
        keywords={['poetry collections', 'free poetry PDF', 'read poetry online', 'Iron Heist books']}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'All Poetry Collections — Iron Verse',
          url: 'https://iron-verse-poetry.vercel.app/books',
          description: 'Nine free poetry collections by Iron Heist',
          author: { '@type': 'Person', name: 'Iron Heist' },
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <Breadcrumbs items={[{ label: 'Books', href: '/books' }]} />

        <div className="mb-10 mt-6">
          <p className="text-xs uppercase tracking-widest text-amber-500 font-sans mb-3">
            Free to read, free to keep
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-ink-50 leading-none">
            All collections
          </h1>
          <p className="text-ink-400 font-sans text-base mt-4 max-w-xl leading-relaxed">
            Every book here costs nothing. Download the PDF, read it online, share it freely.
            These poems were made to travel.
          </p>
        </div>

        <BookGrid />
      </div>
    </>
  )
}
