import { SESSION_ID_KEY } from './constants'

/** Generates a URL-friendly slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/** Gets or creates a persistent session ID */
export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, id)
  }
  return id
}

/** Extracts plain text from HTML content */
export function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

/** Estimates reading time in minutes based on word count */
export function estimateReadingTime(content: string): number {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Clamps a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Truncates text to a given character count, respecting word boundaries */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const truncated = text.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...'
}

/** Generates auto-excerpt from HTML content */
export function generateExcerpt(html: string, maxLength = 160): string {
  return truncate(stripHtml(html), maxLength)
}

/** Returns initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Delays execution */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Returns true if the user prefers dark mode at the OS level */
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** Groups an array by a key */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item)
      return { ...groups, [key]: [...(groups[key] ?? []), item] }
    },
    {} as Record<string, T[]>,
  )
}

/** Counts occurrences of each value returned by keyFn */
export function countBy<T>(array: T[], keyFn: (item: T) => string): Record<string, number> {
  return array.reduce(
    (counts, item) => {
      const key = keyFn(item)
      return { ...counts, [key]: (counts[key] ?? 0) + 1 }
    },
    {} as Record<string, number>,
  )
}
