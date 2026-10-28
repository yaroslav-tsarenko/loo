// Number and time formats of the admin area (Kyiv time, Ukrainian locale).

export const fmt = new Intl.NumberFormat('uk-UA')
export const when = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
export const date = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', year: 'numeric' })
export const full = new Intl.DateTimeFormat('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const signed = (n: number): string => `${n > 0 ? '+' : ''}${fmt.format(n)}`

// What an admin_audit action means, for the log and the learner card.
export const ACTION_LABEL: Record<string, string> = {
  'balance:xp': 'XP',
  'balance:bucks': 'Бакси',
  'balance:gems': 'Кристали',
  hearts: 'Сердечка',
  freezes: 'Заморозки серії',
  boost: 'Подвійний XP',
  'boost:end': 'Подвійний XP знято',
  'item:give': 'Видано предмет',
  'item:take': 'Забрано предмет',
  ban: 'Бан',
  unban: 'Розбан',
  'analytics:purge': 'Чистка аналітики',
}

export function describe(action: string, payload: Record<string, unknown>): string {
  const p = payload as Record<string, string | number | undefined>
  switch (action) {
    case 'balance:xp':
    case 'balance:bucks':
    case 'balance:gems':
      return `${signed(Number(p.amount))}${p.asked !== undefined ? ` (просили ${signed(Number(p.asked))})` : ''}${p.note ? ` · ${p.note}` : ''}`
    case 'hearts':
      return `= ${p.hearts}`
    case 'freezes':
      return signed(Number(p.count))
    case 'boost':
      return `+${p.hours} год`
    case 'item:give':
    case 'item:take':
      return String(p.itemId ?? '')
    case 'ban':
      return String(p.reason ?? '')
    case 'analytics:purge':
      return `старші за ${p.days} дн · видалено ${fmt.format(Number(p.removed ?? 0))}`
    default:
      return Object.keys(p).length ? JSON.stringify(p) : ''
  }
}

export const actorLabel = (actor: string): string => (actor === 'login' ? 'адмін-логін' : actor.startsWith('role:') ? `акаунт ${actor.slice(5, 13)}` : actor)
