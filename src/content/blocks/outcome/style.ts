import type { CalloutStyle } from '../types'

export const successStyle: CalloutStyle = { type: 'success', aliases: ['check', 'done'], label: 'Готово', tone: 'success', icon: 'check' }
export const failureStyle: CalloutStyle = { type: 'failure', aliases: ['fail', 'missing', 'danger', 'error', 'bug'], label: 'Помилка', tone: 'danger', icon: 'x' }
