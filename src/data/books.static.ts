/**
 * Static book data — used as the primary data source.
 * All 9 poetry books by Jay Shivram (Iron Heist).
 * Assets are served from /public/images/books/ and /public/pdfs/.
 */

import type { Book } from '@/types/database.types'

export const STATIC_BOOKS: Book[] = [
  {
    id: 'you-and-the-moon',
    title: 'You and the Moon',
    slug: 'you-and-the-moon',
    subtitle: 'A cosmic love story told in verse',
    description:
      'I sit next to the ocean. I weep, for you are not here. You are far across, on an island, across the very ocean I\'m sitting next to.',
    long_description:
      'You and the Moon is an intimate collection of 58 pages tracing the arc of a love divided by distance and drawn together by the night sky. Written as a journal of raw thoughts, each poem moves between ocean shores, moonlit skies, and the quiet ache of separation. The collection is organised into five movements, from the pull of the ocean to cosmic devotion to the weight of words on paper, and closes with the unwavering certainty that two souls born under the right moons will always find their way back.',
    cover_image_url: '/images/books/you-and-the-moon.webp',
    pdf_url: '/pdfs/You_and_the_Moon.pdf',
    pdf_size_bytes: 1565650,
    page_count: 58,
    published_year: 2022,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: true,
    is_published: true,
    tags: ['love', 'longing', 'ocean', 'cosmic', 'distance', 'devotion'],
    view_count: 0,
    download_count: 0,
    seo_title: 'You and the Moon — Poetry by Iron Heist',
    seo_description:
      'A cosmic love story told in verse. Free poetry book by Jay Shivram (Iron Heist).',
    created_at: '2022-06-01T00:00:00Z',
    updated_at: '2022-06-01T00:00:00Z',
  },
  {
    id: 'garden-of-grief',
    title: 'Garden of Grief',
    slug: 'garden-of-grief',
    subtitle: 'A brief collection of poems',
    description:
      'I write not to escape, but to face what\'s inside. These pages hold my heart, broken and whole, bleeding and healing.',
    long_description:
      'Garden of Grief is a 103-page raw and honest record of a year spent trying to understand the self. This collection holds sleepless nights, hollow mornings, burning houses, and the slow work of healing, all laid bare without apology. It is an invitation to feel, to remember, and to find a little peace in knowing you are not alone. As the author writes in his note: "Thank you for holding this book. Thank you for letting these words sit beside you for a while."',
    cover_image_url: '/images/books/gog.webp',
    pdf_url: '/pdfs/GARDEN_OF_GRIEF.pdf',
    pdf_size_bytes: 6939189,
    page_count: 103,
    published_year: 2025,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: true,
    is_published: true,
    tags: ['grief', 'healing', 'introspection', 'self-discovery', 'loss', 'identity'],
    view_count: 0,
    download_count: 0,
    seo_title: 'Garden of Grief — Poetry by Iron Heist',
    seo_description:
      'A raw and honest record of grief, healing, and self-discovery. Free poetry collection by Jay Shivram (Iron Heist).',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'drunk-off-her',
    title: 'Drunk Off Her',
    slug: 'drunk-off-her',
    subtitle: null,
    description:
      'You are like a shadow, next to me but I can\'t hold you or touch you. That is how I feel when you\'re next to me, knowing that I will never hold you.',
    long_description:
      'Drunk Off Her is a 27-page descent into obsession, longing, and the particular madness of loving someone just out of reach. Across twelve poems, from "A Nemesis" to "A Final Nail to this Coffin", the collection traces the full arc of intoxicating love: its dizzy heights, its slow destruction, and the moment when the writer must choose between the addiction and himself. The writing is blunt, vulnerable, and bruisingly honest.',
    cover_image_url: '/images/books/drunk-off-her.webp',
    pdf_url: '/pdfs/DRUNK_OFF_HER.pdf',
    pdf_size_bytes: 1095079,
    page_count: 27,
    published_year: 2022,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: true,
    is_published: true,
    tags: ['obsession', 'love', 'longing', 'heartbreak', 'addiction', 'memories'],
    view_count: 0,
    download_count: 0,
    seo_title: 'Drunk Off Her — Poetry by Iron Heist',
    seo_description:
      'A 27-poem descent into obsession and the particular madness of loving someone just out of reach.',
    created_at: '2022-09-01T00:00:00Z',
    updated_at: '2022-09-01T00:00:00Z',
  },
  {
    id: 'fading-light',
    title: 'Fading Light',
    slug: 'fading-light',
    subtitle: null,
    description:
      'The only poem in my mind is you. You are the center of my universe. And tonight, my words revolve around you.',
    long_description:
      'Fading Light is a 21-page meditation on love as language. The fifteen poems in this collection, from "My Words That Revolve Around You" to "A Thousand Poems", explore what it means when every sentence you write belongs to another person. The writing moves from tender devotion through silent torment, bottles and smoke, and eventually to grief itself, asking the question all poets must face: when the person who inspires your words is gone, what becomes of the words?',
    cover_image_url: '/images/books/fading-light.webp',
    pdf_url: '/pdfs/Fading_Light.pdf',
    pdf_size_bytes: 194124,
    page_count: 21,
    published_year: 2024,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: false,
    is_published: true,
    tags: ['love', 'poetry', 'grief', 'words', 'devotion', 'loss'],
    view_count: 0,
    download_count: 0,
    seo_title: 'Fading Light — Poetry by Iron Heist',
    seo_description:
      'A collection about love as language, what happens when the person who inspires every word is gone.',
    created_at: '2024-05-01T00:00:00Z',
    updated_at: '2024-05-01T00:00:00Z',
  },
  {
    id: 'dawn-and-dusk',
    title: 'Dawn and Dusk',
    slug: 'dawn-and-dusk',
    subtitle: null,
    description:
      'She was gone, and now the grass is just green. We are mosaics of all the people we hate. Perhaps hate is just love that is lost.',
    long_description:
      'Dawn and Dusk is a 20-poem journey through mythology, nature, and the emotional seasons of loving and losing. Fourteen chapters move from "Green", a poem about lying on grass where she used to hold him, through smoke, conquered lands, Medusa, and mercy. The collection opens with a quote from Dostoevsky and closes with the understanding that grief is love with nowhere to go. Quiet, imagistic, and deeply felt.',
    cover_image_url: '/images/books/dawn-and-dusk.webp',
    pdf_url: '/pdfs/Dawn_and_Dusk.pdf',
    pdf_size_bytes: 157230,
    page_count: 20,
    published_year: 2024,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: false,
    is_published: true,
    tags: ['nature', 'mythology', 'grief', 'seasons', 'loss', 'imagery'],
    view_count: 0,
    download_count: 0,
    seo_title: 'Dawn and Dusk — Poetry by Iron Heist',
    seo_description:
      'Mythology, nature, and the emotional seasons of loving and losing. Free poetry by Iron Heist.',
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
  },
  {
    id: 'a-diary-of-my-thoughts',
    title: 'A Diary of My Thoughts',
    slug: 'a-diary-of-my-thoughts',
    subtitle: 'An intimate journey through the labyrinth of the mind',
    description:
      'I am thankful for these sleepless nights. If you\'re not a ghost, then why do you haunt me? I would rather stay awake and guard my heart than sleep and break it.',
    long_description:
      'A Diary of My Thoughts is a 20-page anthology of thirteen poems that map the innermost landscape of grief and longing. Written on sleepless nights and dated with timestamps, each poem reads like a private journal entry, hollow, burning, nostalgic, and finally resolved. The collection closes with "My End" and "Mistakes", refusing to look away from the hardest parts of the human experience.',
    cover_image_url: '/images/books/a-diary-of-my-thoughts.webp',
    pdf_url: '/pdfs/A_Diary_of_my_Thoughts.pdf',
    pdf_size_bytes: 248209,
    page_count: 20,
    published_year: 2024,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: false,
    is_published: true,
    tags: ['introspection', 'grief', 'sleepless', 'heartbreak', 'nostalgia', 'honesty'],
    view_count: 0,
    download_count: 0,
    seo_title: 'A Diary of My Thoughts — Poetry by Iron Heist',
    seo_description:
      'Thirteen poems written on sleepless nights. An honest record of grief, longing, and the self.',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
  {
    id: 'midday-blues',
    title: 'Midday Blues',
    slug: 'midday-blues',
    subtitle: null,
    description:
      'If I could erase you from my memory, how would I erase you from my poetry? Know that you are where my words come from.',
    long_description:
      'Midday Blues is a 17-page collection exploring faith, freedom, seasons, and the impossible task of forgetting someone who has become the source of your writing. Twelve poems move from the lyrical simplicity of "Midday Blues" through questions of religion and freedom before arriving at forgiveness and the changing of seasons. The writing is spare and unsentimental, finding grace in the smallest turns of phrase.',
    cover_image_url: '/images/books/midday-blues.webp',
    pdf_url: '/pdfs/Midday_Blues.pdf',
    pdf_size_bytes: 138953,
    page_count: 17,
    published_year: 2024,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: false,
    is_published: true,
    tags: ['faith', 'freedom', 'seasons', 'love', 'forgiveness', 'identity'],
    view_count: 0,
    download_count: 0,
    seo_title: 'Midday Blues — Poetry by Iron Heist',
    seo_description:
      'A collection on faith, freedom, and the impossibility of erasing someone from your poetry.',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'a-letdown',
    title: 'A Letdown',
    slug: 'a-letdown',
    subtitle: null,
    description:
      'Love is a gamble. The price you pay when you lose love is losing yourself. How many times can you let yourself get consumed before you go numb?',
    long_description:
      'A Letdown is a tightly wound 10-page collection of seven poems about the slow unravelling that follows love\'s end. From "Loving Comes With a Price" to "Fragments", a poem addressed to a girl who lives as a fragment in memory, the book asks the question: when love dissolves you, who remains? The writing is unflinching and spare, giving voice to the grief of someone who once believed, and no longer knows how to stop.',
    cover_image_url: '/images/books/a-letdown.webp',
    pdf_url: '/pdfs/A_Letdown.pdf',
    pdf_size_bytes: 182735,
    page_count: 10,
    published_year: 2024,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: false,
    is_published: true,
    tags: ['heartbreak', 'grief', 'fragments', 'loss', 'love', 'dissolution'],
    view_count: 0,
    download_count: 0,
    seo_title: 'A Letdown — Poetry by Iron Heist',
    seo_description:
      'Seven poems about the slow unravelling that follows love\'s end. Free poetry by Iron Heist.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'a-fools-dream',
    title: "A Fool's Dream",
    slug: 'a-fools-dream',
    subtitle: null,
    description:
      'There will always be a fool within me. Perhaps that\'s why there\'s still a dream in me. Dreams of the people we never become, of the people we never meet.',
    long_description:
      "A Fool's Dream is an 11-page philosophical collection that asks what it means to dream in a world that punishes illusion. Seven short poems move from Dreams and Illusions through Real, A Poem I Could Never Write, and A Ghost Waiting for Dawn, before arriving at despair and the distant comfort of something still unnameable. The collection is quiet, existential, and achingly honest about the gap between what we imagine and what we are.",
    cover_image_url: '/images/books/a-fools-dream.webp',
    pdf_url: '/pdfs/A_Fools_Dream.pdf',
    pdf_size_bytes: 144416,
    page_count: 11,
    published_year: 2023,
    publisher: 'Iron Heist',
    isbn: null,
    language: 'en',
    is_featured: false,
    is_published: true,
    tags: ['dreams', 'illusions', 'existence', 'philosophy', 'despair', 'hope'],
    view_count: 0,
    download_count: 0,
    seo_title: "A Fool's Dream — Poetry by Iron Heist",
    seo_description:
      'A philosophical collection about the gap between what we imagine and what we are. Free poetry by Iron Heist.',
    created_at: '2023-08-01T00:00:00Z',
    updated_at: '2023-08-01T00:00:00Z',
  },
]

/** Return a copy sorted by created_at descending (default) */
export function getStaticBooks(): Book[] {
  return [...STATIC_BOOKS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function getStaticFeaturedBooks(): Book[] {
  return STATIC_BOOKS.filter((b) => b.is_featured)
}

export function getStaticBookBySlug(slug: string): Book | null {
  return STATIC_BOOKS.find((b) => b.slug === slug) ?? null
}

/** Is Supabase properly configured (not placeholder values)? */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  return (
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    !url.includes('your-project') &&
    key.length > 50 &&
    !key.includes('your-anon-key')
  )
}
