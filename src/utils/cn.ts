/** Utility for merging Tailwind classes. Simple version without clsx dependency. */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
