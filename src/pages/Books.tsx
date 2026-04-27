import { Helmet } from 'react-helmet-async'
import { BookGrid } from '@/components/books/BookGrid'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { SITE_NAME } from '@/utils/constants'

export default function Books() {
  return (
    <>
      <Helmet>
        <title>All Collections — {SITE_NAME}</title>
        <meta name="description" content="Browse all free poetry collections by Iron Heist. Download or read online." />
      </Helmet>

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
