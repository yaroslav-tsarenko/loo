// Icon refs for learning data (tracks, sections, topics, lessons, reels) — never Apple emoji in the UI (docs/DESIGN.md).
// A ref is a plain string the UI passes straight to <Icon name={ref}>: `px:…` (our pixel set), `pi:…`/`tb:…`/`lucide:…`
// (library glyphs), `si:…` (brand marks). Pure data — no React, so the domain, server and course compiler can use it.

export type LessonIconKind = 'theory' | 'start' | 'core' | 'cards' | 'code' | 'interview'

export const LESSON_ICONS: Record<LessonIconKind, string> = {
  theory: 'px:book',
  start: 'px:questionBlock',
  core: 'px:microscope',
  cards: 'px:brain',
  code: 'px:code',
  interview: 'px:mic',
}

// Topic test and section exam nodes of a course path.
export const TEST_ICON = 'px:flag'
export const EXAM_ICON = 'px:crown'

// Topics without their own icon cycle through these.
export const TOPIC_FALLBACK_ICONS: readonly string[] = ['px:book', 'px:puzzle', 'px:gear', 'px:magnifier', 'px:brain', 'px:rocket', 'px:tools']
// Sections / stages without an icon.
export const SECTION_FALLBACK_ICON = 'px:map'
// A reel (micro-fact) without a known leading emoji.
export const REEL_FALLBACK_ICON = 'px:bulb'

// Author emoji (vault frontmatter, guide parts, reel titles, legacy course YAML) → icon ref.
// Keys are bare emoji without the U+FE0F variation selector.
const EMOJI_ICONS: Record<string, string> = {
  // learning flow
  '📖': 'px:book',
  '📘': 'px:book',
  '📚': 'px:books',
  '🤔': 'px:questionBlock',
  '❓': 'px:question',
  '❔': 'px:question',
  '🔬': 'px:microscope',
  '🧠': 'px:brain',
  '🛠': 'px:tools',
  '🔧': 'px:tools',
  '🧰': 'px:toolbox',
  '🎤': 'px:mic',
  '🏁': 'px:flag',
  '🚩': 'px:flag',
  '👑': 'px:crown',
  '🎯': 'px:target',
  '🏆': 'px:trophy',
  '🥇': 'px:medal',
  '🏅': 'px:medal',
  '🎓': 'px:gradCap',
  '🎲': 'px:dice',
  '🩹': 'px:bandage',
  '🗺': 'px:map',
  '📍': 'px:map',
  // sections
  '🌱': 'px:sprout',
  '🧱': 'px:bricks',
  '⏳': 'px:hourglass',
  '⌛': 'px:hourglass',
  '🌐': 'px:globe',
  '🌍': 'px:globe',
  '🌎': 'px:globe',
  '🏗': 'px:blocks',
  '🥋': 'px:belt',
  '🚀': 'px:rocket',
  '🏔': 'px:mountain',
  '⛰': 'px:mountain',
  // topics and reels
  '⚙': 'px:gear',
  '🍳': 'px:gear',
  '👋': 'pi:PiHandWavingFill',
  '📦': 'px:box',
  '➕': 'pi:PiPlusBold',
  '🚦': 'px:traffic',
  '🔁': 'px:repeat',
  '🔄': 'px:repeat',
  '🔂': 'px:repeat',
  '🧺': 'tb:TbStack2',
  '🗂': 'lucide:Braces',
  '🖱': 'px:cursor',
  '👉': 'px:cursor',
  '🧬': 'px:dna',
  '⚛': 'tb:TbAtom',
  '🔭': 'px:magnifier',
  '🔍': 'px:magnifier',
  '🔎': 'px:magnifier',
  '🎒': 'px:chest',
  '🎁': 'pi:PiGiftFill',
  '🤝': 'pi:PiSealCheckFill',
  '🗑': 'px:trash',
  '🧹': 'px:trash',
  '🎛': 'pi:PiTimerFill',
  '⏱': 'pi:PiTimerFill',
  '⏰': 'px:alarm',
  '🕰': 'px:clock',
  '🕐': 'px:clock',
  '🔢': 'tb:TbMath',
  '📏': 'tb:TbMath',
  '♾': 'tb:TbMath',
  '🧮': 'px:abacus',
  '🔤': 'px:letterTile',
  '🔠': 'px:letterTile',
  '🗃': 'px:database',
  '🗄': 'px:database',
  '💾': 'px:floppy',
  '🪄': 'px:wand',
  '✨': 'tb:TbSparkles',
  '🧩': 'px:puzzle',
  '🚨': 'px:warning',
  '⚠': 'px:warning',
  '🛑': 'px:warning',
  '🧯': 'px:warning',
  '🪤': 'px:warning',
  '🧨': 'px:bomb',
  '💣': 'px:bomb',
  '❌': 'px:cross',
  '🧾': 'px:file',
  '📄': 'px:file',
  '📜': 'px:scroll',
  '📋': 'px:clipboard',
  '📝': 'px:clipboard',
  '📅': 'pi:PiCalendarCheckFill',
  '🗓': 'pi:PiCalendarCheckFill',
  '🖼': 'px:image',
  '🎨': 'tb:TbPalette',
  '👷': 'px:hardHat',
  '🧵': 'px:spool',
  '🛡': 'px:shield',
  '🔒': 'px:lock',
  '🔐': 'px:lock',
  '🔑': 'px:key',
  '🗝': 'px:key',
  '🏎': 'px:bolt',
  '⚡': 'px:bolt',
  '🧭': 'px:compass',
  '🧪': 'px:testTube',
  '✅': 'px:check',
  '✔': 'px:check',
  '💬': 'px:chat',
  '🗣': 'px:chat',
  '💭': 'px:think',
  '📡': 'tb:TbNetwork',
  '🛰': 'tb:TbApi',
  '🔗': 'px:link',
  '🏷': 'px:tag',
  '⚖': 'px:scales',
  '🖥': 'px:monitor',
  '💻': 'px:monitor',
  '🪟': 'px:monitor',
  '🔥': 'px:fire',
  '💡': 'px:bulb',
  '⭐': 'px:star',
  '🌟': 'px:star',
  '💎': 'px:gem',
  '❤': 'px:heart',
  '📱': 'px:phone',
  '🃏': 'px:cards',
  '🎴': 'px:cards',
  '🧊': 'pi:PiSnowflakeFill',
  '❄': 'pi:PiSnowflakeFill',
  '🪞': 'px:mirror',
  '🪆': 'px:matryoshka',
  '🥞': 'px:pancakes',
  '🎈': 'px:balloon',
  '🫧': 'px:bubbles',
  '🐢': 'px:turtle',
  '🚪': 'px:door',
  '🏠': 'px:house',
  '🛒': 'px:cart',
  '🚚': 'px:truck',
  '✉': 'px:envelope',
  '📬': 'px:envelope',
  '📨': 'px:envelope',
  '🎭': 'pi:PiShuffleBold',
  '🤯': 'pi:PiSparkleFill',
  '👻': 'pi:PiQuestionFill',
  '🕳': 'pi:PiQuestionFill',
  '🙈': 'pi:PiEyeFill',
  '👀': 'pi:PiEyeFill',
  '➡': 'pi:PiArrowRightBold',
  '🌊': 'tb:TbStack2',
  '🧅': 'tb:TbStack2',
  '✂': 'pi:PiShuffleBold',
  '🐍': 'pi:PiPathFill',
  '🦆': 'pi:PiPuzzlePieceFill',
  '🍕': 'pi:PiPuzzlePieceFill',
  '🍽': 'pi:PiPuzzlePieceFill',
  '🤖': 'tb:TbBrain',
  '📈': 'pi:PiChartBarFill',
  '📊': 'pi:PiChartBarFill',
  '📰': 'pi:PiNewspaperFill',
  '🐳': 'si:SiDocker',
  '🐘': 'si:SiPostgresql',
}

const LIBRARY_REF = /^(px|pi|tb|lucide|si):[A-Za-z][A-Za-z0-9]*$/
const PICTO = /\p{Extended_Pictographic}|\p{Regional_Indicator}/gu

/**
 * Normalises an author icon (emoji or ref) to an icon ref. Library refs pass through; emoji map via the table above
 * (the first known pictograph of a combo wins); anything else → `fallback`.
 */
export function iconRef(raw: string | null | undefined, fallback: string | null = null): string | null {
  const value = raw?.trim().replace(/^emoji:/, '')
  if (!value) return fallback
  if (LIBRARY_REF.test(value)) return value
  for (const m of value.matchAll(PICTO)) {
    const hit = EMOJI_ICONS[m[0]]
    if (hit) return hit
  }
  return fallback
}

export const EMOJI_ICON_TABLE: Readonly<Record<string, string>> = EMOJI_ICONS
