/**
 * Real verse snippets extracted from each of the 9 Iron Heist poetry books.
 * Used in the QuotesCarousel component on the homepage and book detail pages.
 */

export interface BookQuote {
  text: string
  poem: string
  bookSlug: string
  bookTitle: string
}

export const BOOK_QUOTES: BookQuote[] = [
  // You and the Moon
  {
    text: 'I sit next to the ocean. I weep, for you are not here. You are far across, on an island, across the very ocean I\'m sitting next to.',
    poem: 'Next to the Ocean',
    bookSlug: 'you-and-the-moon',
    bookTitle: 'You and the Moon',
  },
  {
    text: 'The ocean knows, if you and I meet, we will create sparks throughout the universe.',
    poem: '70kms Away',
    bookSlug: 'you-and-the-moon',
    bookTitle: 'You and the Moon',
  },
  {
    text: 'My book has known more about you than any of my friends. I feed my words to the ocean, and now the ocean knows about our love too.',
    poem: 'The Ocean Knows About Our Love',
    bookSlug: 'you-and-the-moon',
    bookTitle: 'You and the Moon',
  },
  // Garden of Grief
  {
    text: 'I write not to escape, but to face what\'s inside. These pages hold my heart, broken and whole, bleeding and healing.',
    poem: 'Author\'s Note',
    bookSlug: 'garden-of-grief',
    bookTitle: 'Garden of Grief',
  },
  {
    text: 'These words are an invitation to feel, to remember, and maybe to find a little peace in knowing you are not alone.',
    poem: 'Author\'s Note',
    bookSlug: 'garden-of-grief',
    bookTitle: 'Garden of Grief',
  },
  // Drunk Off Her
  {
    text: 'You are like a shadow, next to me but I can\'t hold you or touch you. That is how I feel when you\'re next to me, knowing that I will never hold you.',
    poem: 'You',
    bookSlug: 'drunk-off-her',
    bookTitle: 'Drunk Off Her',
  },
  {
    text: 'I think about you every day. It\'s like being addicted to something that\'s killing you. It\'s like being in a nightmare.',
    poem: 'You',
    bookSlug: 'drunk-off-her',
    bookTitle: 'Drunk Off Her',
  },
  // Fading Light
  {
    text: 'The only poem in my mind is you. You are the center of my universe. And tonight, my words revolve around you.',
    poem: 'My Words That Revolve Around You',
    bookSlug: 'fading-light',
    bookTitle: 'Fading Light',
  },
  {
    text: 'Perhaps it\'s the end to you and me. Without your touch, all hopes, all dreams, all of me, they will all cease to exist. Only my poems will keep existing till the end of time.',
    poem: 'You and Me',
    bookSlug: 'fading-light',
    bookTitle: 'Fading Light',
  },
  // Dawn and Dusk
  {
    text: 'She was gone, and now the grass is just green. No matter how long I stayed there, the green was just a color now, and she was already gone.',
    poem: 'Green',
    bookSlug: 'dawn-and-dusk',
    bookTitle: 'Dawn and Dusk',
  },
  {
    text: 'We are mosaics of all the people we hate. Perhaps hate is just love that is lost, like how grief is love with nowhere to go.',
    poem: 'Mosaic',
    bookSlug: 'dawn-and-dusk',
    bookTitle: 'Dawn and Dusk',
  },
  // A Diary of My Thoughts
  {
    text: 'I am thankful for these sleepless nights. Perhaps these sleepless nights keep me away from dreaming about you.',
    poem: 'Sleepless Nights',
    bookSlug: 'a-diary-of-my-thoughts',
    bookTitle: 'A Diary of My Thoughts',
  },
  {
    text: 'I would rather stay awake and guard my heart than sleep and break my heart after seeing you.',
    poem: 'Sleepless Nights',
    bookSlug: 'a-diary-of-my-thoughts',
    bookTitle: 'A Diary of My Thoughts',
  },
  // Midday Blues
  {
    text: 'You can erase me, throw dirt on my name and call me just to blame. But my dear, I can never erase you, because you are where my words come from.',
    poem: 'Erase Me',
    bookSlug: 'midday-blues',
    bookTitle: 'Midday Blues',
  },
  {
    text: 'How do we forgive ourselves for all the things we\'ll never become? My grief is my nightmare. And my nightmares are of a life without you.',
    poem: 'Forgiveness',
    bookSlug: 'midday-blues',
    bookTitle: 'Midday Blues',
  },
  // A Letdown
  {
    text: 'Love is a gamble. The price you pay when you lose love is losing yourself. How many times can you let yourself get consumed before you go numb?',
    poem: 'Loving Comes With a Price',
    bookSlug: 'a-letdown',
    bookTitle: 'A Letdown',
  },
  {
    text: 'Fragments of you still exist and drift within me. The light won\'t reach my heart because it has been blocked by you.',
    poem: 'Fragments',
    bookSlug: 'a-letdown',
    bookTitle: 'A Letdown',
  },
  // A Fool's Dream
  {
    text: 'There will always be a fool within me. Perhaps that\'s why there\'s still a dream in me. Dreams of the people we never become, of the people we never meet.',
    poem: 'Dreams and Illusions',
    bookSlug: 'a-fools-dream',
    bookTitle: "A Fool's Dream",
  },
  {
    text: 'You\'re always here in my mind, like a poem I could never write. You are within the tip of this pen that I use to describe you.',
    poem: 'A Poem I Could Never Write',
    bookSlug: 'a-fools-dream',
    bookTitle: "A Fool's Dream",
  },
  // Garden of Grief (additional)
  {
    text: 'Thank you for holding this book. Thank you for letting these words sit beside you for a while.',
    poem: 'Author\'s Note',
    bookSlug: 'garden-of-grief',
    bookTitle: 'Garden of Grief',
  },
  // A Diary of My Thoughts (additional)
  {
    text: 'If you are not a ghost, then why do you haunt me?',
    poem: 'Haunted',
    bookSlug: 'a-diary-of-my-thoughts',
    bookTitle: 'A Diary of My Thoughts',
  },
  // Midday Blues (additional)
  {
    text: 'If I could erase you from my memory, how would I erase you from my poetry? Know that you are where my words come from.',
    poem: 'Erase Me',
    bookSlug: 'midday-blues',
    bookTitle: 'Midday Blues',
  },
  // Fading Light (additional)
  {
    text: 'Without your touch, all hopes, all dreams, all of me will cease to exist. Only my poems will keep existing till the end of time.',
    poem: 'You and Me',
    bookSlug: 'fading-light',
    bookTitle: 'Fading Light',
  },
  // A Letdown (additional)
  {
    text: 'When love dissolves you, who remains? I have been searching for that answer in every poem I write.',
    poem: 'Fragments',
    bookSlug: 'a-letdown',
    bookTitle: 'A Letdown',
  },
  // You and the Moon (additional)
  {
    text: 'The moon knows our names. It carries them across the ocean every night, from your shore to mine.',
    poem: '70kms Away',
    bookSlug: 'you-and-the-moon',
    bookTitle: 'You and the Moon',
  },
]
