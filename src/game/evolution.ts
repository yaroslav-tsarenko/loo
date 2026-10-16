// 🥚→🌟 Loo's evolution: the learner's character levels up across ALL courses, one scale for everything.
// Single source of truth for the forms, their order, labels and the difficulty → form mapping (UI imports from here;
// the mascot draws each form: <Loo form tier />).

export const LOO_FORMS = ['egg', 'pixel', 'block', 'lamp', 'charged', 'armored', 'crowned', 'legendary'] as const
export type LooForm = (typeof LOO_FORMS)[number]

export const LOO_FORM_LABEL: Record<LooForm, string> = {
  egg: 'Яйце',
  pixel: 'Піксель',
  block: 'Блок',
  lamp: 'Ламповий',
  charged: 'Заряджений',
  armored: 'Броньований',
  crowned: 'Коронований',
  legendary: 'Легендарний',
}

// «для Броньованого» — genitive for difficulty tags.
export const LOO_FORM_FOR: Record<LooForm, string> = {
  egg: 'Яйця',
  pixel: 'Пікселя',
  block: 'Блока',
  lamp: 'Лампового',
  charged: 'Зарядженого',
  armored: 'Броньованого',
  crowned: 'Коронованого',
  legendary: 'Легендарного',
}

export const LOO_FORM_EMOJI: Record<LooForm, string> = {
  egg: '🥚',
  pixel: '👾',
  block: '🧱',
  lamp: '💡',
  charged: '⚡',
  armored: '🛡️',
  crowned: '👑',
  legendary: '🌟',
}

export type EvoTier = 1 | 2 | 3
export const TIER_ROMAN: Record<EvoTier, string> = { 1: 'I', 2: 'II', 3: 'III' }

// «Ламповий II»; the final form has a single tier (no numeral).
export function formTitle(form: LooForm, tier: EvoTier): string {
  return form === 'legendary' ? LOO_FORM_LABEL.legendary : `${LOO_FORM_LABEL[form]} ${TIER_ROMAN[tier]}`
}

export const isLooForm = (s: string): s is LooForm => (LOO_FORMS as readonly string[]).includes(s)

// ── One difficulty scale ───────────────────────────────────────────────────────────────────────────────────────
// Course levels (noob…god) and legacy content levels (junior…techlead) stay as they are internally; every label the
// learner sees is the Loo form that matches the difficulty.
export const LEVEL_FORM: Record<string, LooForm> = {
  noob: 'pixel',
  beginner: 'pixel',
  junior: 'block',
  middle: 'lamp',
  senior: 'armored',
  god: 'legendary',
  techlead: 'legendary',
}

export const levelForm = (level: string): LooForm => LEVEL_FORM[level] ?? 'block'

// «Броньований»
export const levelLabel = (level: string): string => LOO_FORM_LABEL[levelForm(level)]

// «🛡️ Броньований»
export const levelBadge = (level: string): string => `${LOO_FORM_EMOJI[levelForm(level)]} ${levelLabel(level)}`

// «🛡️ для Броньованого» — exercise difficulty tags
export const levelTag = (level: string): string => `${LOO_FORM_EMOJI[levelForm(level)]} для ${LOO_FORM_FOR[levelForm(level)]}`
