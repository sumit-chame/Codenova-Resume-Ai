import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional classnames and merges conflicting Tailwind CSS classes cleanly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date object or timestamp string into a human-readable format.
 */
export function formatDate(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Extracts initials from a display name (e.g. "John Doe" -> "JD").
 */
export function getInitials(name?: string | null): string {
  if (!name) return 'RF';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'RF';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
