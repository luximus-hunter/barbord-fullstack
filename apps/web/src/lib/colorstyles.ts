export const colorStyles = {
  crimson: 'bg-red-300 text-red-900 font-bold dark:bg-red-700 dark:text-white',
  red: 'bg-red-200 text-red-900 dark:bg-red-500 dark:text-white',
  neutral:
    'bg-neutral-200 text-neutral-900 dark:bg-neutral-600 dark:text-white',
  orange: 'bg-orange-200 text-orange-900 dark:bg-orange-500 dark:text-white',
  green: 'bg-green-200 text-green-900 dark:bg-green-500 dark:text-white',
  blue: 'bg-blue-200 text-blue-900 dark:bg-blue-500 dark:text-white',
  yellow: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-500 dark:text-white',
  purple: 'bg-purple-200 text-purple-900 dark:bg-purple-500 dark:text-white',
} as const;

export type ColorStyles = keyof typeof colorStyles;