const DATE = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** «20 жовтня 2026 р.» → «20 жовтня 2026» */
export function blogDate(day: string): string {
  return DATE.format(new Date(`${day}T12:00:00Z`)).replace(/\s*р\.$/, '')
}

export function readingTime(minutes: number): string {
  return `${minutes} хв читання`
}
