/**
 * setup-assets.mjs
 * Run this once from the project root to copy covers, PDFs, and fonts
 * into the public directory.
 *
 * Usage:  node setup-assets.mjs
 */

import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

// Base paths (relative to poets-sanctuary/)
const SRC = resolve(__dir, '..') // Iron Heist Poetry/
const PUBLIC = resolve(__dir, 'public')

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function copy(src, dest) {
  try {
    copyFileSync(src, dest)
    console.log(`  ✓  ${dest.replace(PUBLIC, 'public')}`)
  } catch (e) {
    console.warn(`  ✗  ${src} → ${e.message}`)
  }
}

// ─── Fonts ───────────────────────────────────────────────────────────────────
ensureDir(resolve(PUBLIC, 'fonts'))
copy(resolve(SRC, 'fonts src', 'KirimomiSwash.ttf'), resolve(PUBLIC, 'fonts', 'KirimomiSwash.ttf'))
copy(resolve(SRC, 'fonts src', 'KirimomiSwaIt.ttf'), resolve(PUBLIC, 'fonts', 'KirimomiSwaIt.ttf'))

// ─── Book covers ─────────────────────────────────────────────────────────────
ensureDir(resolve(PUBLIC, 'images', 'books'))
const COVERS = [
  ['GOG.webp',                    'gog.webp'],
  ['You are my moonlight.webp',   'you-and-the-moon.webp'],
  ['A Fools Dream.webp',          'a-fools-dream.webp'],
  ['A Diary of my thoughts.webp', 'a-diary-of-my-thoughts.webp'],
  ['A Letdown.webp',              'a-letdown.webp'],
  ['Dawn & Dusk.webp',            'dawn-and-dusk.webp'],
  ['Drunk OFF her.webp',          'drunk-off-her.webp'],
  ['Fading Light.webp',           'fading-light.webp'],
  ['Midday Blues.webp',           'midday-blues.webp'],
]
for (const [src, dest] of COVERS) {
  copy(resolve(SRC, 'webp src', src), resolve(PUBLIC, 'images', 'books', dest))
}

// ─── UI backgrounds ──────────────────────────────────────────────────────────
ensureDir(resolve(PUBLIC, 'images', 'ui'))
copy(resolve(SRC, 'webp src', 'BG 1.webp'), resolve(PUBLIC, 'images', 'ui', 'bg-1.webp'))
copy(resolve(SRC, 'webp src', 'BG 2.webp'), resolve(PUBLIC, 'images', 'ui', 'bg-2.webp'))

// ─── PDFs ─────────────────────────────────────────────────────────────────────
ensureDir(resolve(PUBLIC, 'pdfs'))
const PDFS = [
  ['GARDEN OF GRIEF.pdf',        'GARDEN_OF_GRIEF.pdf'],
  ['You and the Moon.pdf',       'You_and_the_Moon.pdf'],
  ["A Fool's Dream.pdf",         'A_Fools_Dream.pdf'],
  ['A Diary of my Thoughts.pdf', 'A_Diary_of_my_Thoughts.pdf'],
  ['A Letdown.pdf',              'A_Letdown.pdf'],
  ['Dawn and Dusk.pdf',          'Dawn_and_Dusk.pdf'],
  ['DRUNK OFF HER.pdf',          'DRUNK_OFF_HER.pdf'],
  ['Fading Light.pdf',           'Fading_Light.pdf'],
  ['Midday Blues.pdf',           'Midday_Blues.pdf'],
]
for (const [src, dest] of PDFS) {
  copy(resolve(SRC, 'pdfs', src), resolve(PUBLIC, 'pdfs', dest))
}

console.log('\nDone! Run `npm run dev` to start the development server.')
