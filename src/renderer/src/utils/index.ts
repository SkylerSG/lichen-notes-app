import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
// TS likes to complain here - no worries
const dateFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Pacific/Auckland'
})

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms)

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}
