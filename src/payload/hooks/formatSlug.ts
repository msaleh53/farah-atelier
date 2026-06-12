import type { FieldHook } from 'payload'

/** Turn an arbitrary string into a URL-safe slug. */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Field hook for a `slug` text field: if the editor leaves it blank, derive it
 * from the value of `fallbackField` (e.g. `title`). If they typed one, just
 * normalise it. Mirrors the auto-from-title behaviour the old Sanity slug had.
 */
export const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string' && value.length > 0) {
      return slugify(value)
    }
    const fallback = (data?.[fallbackField] ?? originalDoc?.[fallbackField]) as
      | string
      | undefined
    if (typeof fallback === 'string' && fallback.length > 0) {
      return slugify(fallback)
    }
    return value
  }
