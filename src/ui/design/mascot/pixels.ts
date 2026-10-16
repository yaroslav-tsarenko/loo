// Loo «Пружинка», the Levelup pixel mascot: a violet block with a spring antenna and a "eureka" bulb.
// Pure data + a rect builder — no React — so the same pixels feed <Loo/>, the logo mark, the next/og app icons,
// the favicon and plain SVG strings.
//
// Canvas: a 20×20 cell grid (1 cell = 1 SVG user unit). The 16×14 base sprite sits at (2, 4):
//
//   .......oo.......   bulb (off #DDD6FE, on #FFC800 + rays)
//   .......oo.......
//   ........s.......   spring antenna
//   .......s........
//   ........s.......
//   ...##########...   body, rounded top
//   ..############..
//   ..##e#####e###..   eyes — a separate expression layer (3×3 box per eye)
//   ..##e#####e###..
//   .p############p.   cheeks
//   ################   arm nubs
//   ..############..
//   ..dddddddddddd..   lip
//   ..ddd......ddd..   boots
//
// The logo mark is the 16×16 crop MARK_BOX around that sprite, so at 16px every cell is one device pixel.
// Sprites are arrays of strings: one char per cell, '.' or ' ' = transparent, other chars go through a key map.

export const LOO_GRID = 20
/** [x, y, w, h] of the logo-mark crop on the grid. */
export const MARK_BOX = [2, 3, 16, 16] as const

/** Mirrored as --lu-loo* tokens in src/app/tokens.css; hex here because next/og and the favicon need literals. */
export const LOO_COLORS = {
  body: '#8B5CF6',
  lip: '#6D28D9',
  ink: '#1E1033',
  white: '#FFFFFF',
  spring: '#4C1D95',
  bulbOff: '#DDD6FE',
  bulbOn: '#FFC800',
  glow: '#FDE68A',
  cheek: '#F9A8D4',
  heart: '#FF4B6E',
  blue: '#1CB0F6',
  blueLight: '#8FDBFF',
  yellow: '#FFC800',
  pink: '#FF86D0',
  green: '#58CC02',
  orange: '#FF9600',
  red: '#FF4B2B',
} as const

const C = LOO_COLORS

export interface Px {
  x: number
  y: number
  w: number
  h: number
  /** Any CSS color; 'currentColor' for the ground shadow. */
  c: string
  o?: number
}

type Ink = string | { c: string; o: number }
type Keys = Readonly<Record<string, Ink>>

const BASE_KEYS: Keys = {
  '#': C.body,
  d: C.lip,
  k: C.ink,
  w: C.white,
  s: C.spring,
  o: C.bulbOff,
  O: C.bulbOn,
  r: C.glow,
  p: C.cheek,
  h: C.heart,
  b: C.blue,
  B: C.blueLight,
  y: C.yellow,
  i: C.pink,
  g: C.green,
  f: C.red,
}

/** Turn sprite rows into rects: horizontal runs per row, then identical runs stacked vertically are merged. */
export function sprite(x0: number, y0: number, rows: readonly string[], keys: Keys = BASE_KEYS): Px[] {
  const runs: Px[] = []
  rows.forEach((row, dy) => {
    let i = 0
    while (i < row.length) {
      const ch = row[i] as string
      let j = i + 1
      while (j < row.length && row[j] === ch) j++
      const ink = keys[ch] ?? BASE_KEYS[ch]
      if (ink && ch !== '.' && ch !== ' ') {
        const { c, o } = typeof ink === 'string' ? { c: ink, o: undefined } : ink
        runs.push({ x: x0 + i, y: y0 + dy, w: j - i, h: 1, c, ...(o === undefined ? {} : { o }) })
      }
      i = j
    }
  })
  // Cells inside one sprite never overlap, so merging can't change what's painted.
  const merged: Px[] = []
  for (const r of runs) {
    const above = merged.find((m) => m.x === r.x && m.w === r.w && m.c === r.c && m.o === r.o && m.y + m.h === r.y)
    if (above) above.h += 1
    else merged.push({ ...r })
  }
  return merged
}

function shift(px: Px[], dx: number, dy: number): Px[] {
  return dx === 0 && dy === 0 ? px : px.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy }))
}

/* ── Body ──────────────────────────────────────────────────────────────── */

// Base-sprite origin on the grid; local sprite coordinates below are the ones in the header comment.
const OX = 2
const OY = 4
const at = (lx: number, ly: number, rows: readonly string[], keys?: Keys) => sprite(OX + lx, OY + ly, rows, keys)

const BODY = at(2, 5, ['.##########.', '############', '############', '############', '############', '############', '############', 'dddddddddddd'])
// Cheeks sit just under the eyes (the prototype had them on the outer edge, where they read as shoulders).
const CHEEKS = at(2, 9, ['.pp......pp.'])
const BOOT_ROW = OY + 13

/* ── Eyes: an expression layer, one 3×3 box per eye ───────────────────── */

/** Public expressions. `sparkle` (glossy 2×3 eyes with a highlight) is the "awe / eureka" one, not the default. */
export type LooEyes = 'normal' | 'wink' | 'squint' | 'happy' | 'sleepy' | 'dizzy' | 'skeptical' | 'surprised' | 'love' | 'sparkle'
export const LOO_EYES: readonly LooEyes[] = ['normal', 'wink', 'squint', 'happy', 'sleepy', 'dizzy', 'skeptical', 'surprised', 'love', 'sparkle']
/** Frame-only variants used inside moods. */
export type EyeKind = LooEyes | 'blink' | 'look' | 'sad'

const EYE_L = [OX + 3, OY + 6] as const
const EYE_R = [OX + 10, OY + 6] as const

// [left, right] patterns inside each eye box; right defaults to left.
type EyePair = readonly [left: readonly string[], right?: readonly string[]]
const EYE_ART: Record<EyeKind, EyePair> = {
  normal: [['...', '.k.', '.k.']],
  blink: [['...', '...', 'kkk']],
  wink: [['...', '.k.', '.k.'], ['...', '.k.', 'k.k']],
  squint: [['k..', '.k.', 'k..'], ['..k', '.k.', '..k']],
  happy: [['...', '.k.', 'k.k']],
  sleepy: [['...', '...', 'kkk']],
  dizzy: [['k.k', '.k.', 'k.k']],
  skeptical: [['...', 'kkk', '..k']],
  surprised: [['.k.', 'k.k', '.k.']],
  love: [['h.h', 'hhh', '.h.']],
  sparkle: [['.kw', '.kk', '.kk'], ['kw.', 'kk.', 'kk.']],
  look: [['k..', 'k..', '...']],
  sad: [['..k', '.k.', '.k.'], ['k..', '.k.', '.k.']],
}

function eyes(kind: EyeKind): Px[] {
  const [l, r = l] = EYE_ART[kind]
  return [...sprite(EYE_L[0], EYE_L[1], l), ...sprite(EYE_R[0], EYE_R[1], r)]
}

/* ── Spring antenna + bulb ─────────────────────────────────────────────── */

export type SpringKind = 'a' | 'b' | 'squash' | 'stretch' | 'droop'
export type BulbKind = 'off' | 'on' | 'on2'
/** Public bulb override: on = lit with rays, flicker = alternates on/off frame by frame. */
export type LooBulb = 'off' | 'on' | 'flicker'

// Stem cells (grid) and the bulb's top-left corner for each spring pose.
const SPRINGS: Record<SpringKind, { stem: readonly (readonly [number, number])[]; bulb: readonly [number, number] }> = {
  a: { stem: [[10, 6], [9, 7], [10, 8]], bulb: [9, 4] },
  b: { stem: [[9, 6], [10, 7], [9, 8]], bulb: [9, 4] },
  squash: { stem: [[10, 7], [9, 8]], bulb: [9, 5] },
  stretch: { stem: [[9, 5], [10, 6], [9, 7], [10, 8]], bulb: [9, 3] },
  droop: { stem: [[10, 8], [11, 7]], bulb: [12, 7] },
}

const RAYS: Record<'on' | 'on2', readonly string[]> = {
  on: ['..rr..', 'r....r', '......', 'r....r'],
  on2: ['.r..r.', '......', 'r....r', '......'],
}

function antenna(spring: SpringKind, bulb: BulbKind): Px[] {
  const s = SPRINGS[spring]
  const [bx, by] = s.bulb
  return [
    ...(bulb === 'off' ? [] : sprite(bx - 2, by - 2, RAYS[bulb])),
    ...s.stem.map(([x, y]) => ({ x, y, w: 1, h: 1, c: C.spring })),
    ...sprite(bx, by, bulb === 'off' ? ['oo', 'oo'] : ['OO', 'OO']),
  ]
}

/* ── Arms ──────────────────────────────────────────────────────────────── */

export type ArmKind = 'rest' | 'low' | 'up' | 'wave'
function arm(kind: ArmKind, side: 'l' | 'r'): Px[] {
  const l = side === 'l'
  switch (kind) {
    case 'rest':
      return sprite(l ? 2 : 16, 14, ['##'])
    case 'low':
      return sprite(l ? 2 : 16, 15, ['##'])
    case 'up':
      return l ? sprite(2, 11, ['#.', '#.', '.#']) : sprite(16, 11, ['.#', '.#', '#.'])
    case 'wave':
      return sprite(l ? 3 : 16, 11, ['#', '#', '#'])
  }
}

/* ── Effects ───────────────────────────────────────────────────────────── */

export type Fx =
  | 'tear1'
  | 'tear2'
  | 'tear3'
  | 'zSmall'
  | 'zBig'
  | 'dot1'
  | 'dot2'
  | 'ask'
  | 'bang'
  | 'sparkA'
  | 'sparkB'
  | 'flame0'
  | 'flame1'
  | 'flame2'
  | 'motion'
  | 'stars0'
  | 'stars1'
  | 'stars2'
  | 'stars3'
  | 'heart0'
  | 'heart1'
  | 'heart2'

const plus = (x: number, y: number, c: string) => sprite(x, y, ['.x.', 'xxx', '.x.'], { x: c })
const dot = (x: number, y: number, c: string) => sprite(x + 1, y + 1, ['x'], { x: c })
const HEART = ['h.h', 'hhh', '.h.']

// Flames behind Loo: per-column heights above the boot row, three flicker frames.
const FLAME_BASE = 17
const FLAME_HEIGHTS: readonly (readonly number[])[] = [
  [3, 5, 8, 10, 7, 9, 11, 10, 12, 13, 12, 13, 11, 10, 9, 7, 10, 8, 5, 3],
  [4, 7, 6, 9, 8, 10, 12, 11, 10, 12, 13, 11, 12, 9, 10, 8, 9, 6, 7, 2],
  [2, 4, 7, 8, 10, 8, 10, 12, 11, 11, 12, 12, 10, 11, 8, 10, 7, 8, 4, 3],
]
function flame(frame: number): Px[] {
  const heights = FLAME_HEIGHTS[frame] ?? []
  const out: Px[] = []
  heights.forEach((h, x) => {
    const top = FLAME_BASE - h
    out.push({ x, y: top, w: 1, h: 1, c: C.red })
    out.push({ x, y: top + 1, w: 1, h: Math.max(0, h - 1), c: C.orange })
    const core = Math.max(0, h - 5)
    if (core > 0) out.push({ x, y: FLAME_BASE - core, w: 1, h: core, c: C.yellow })
  })
  return out
}

// Dizzy stars circling the bulb: two stars on opposite sides of an orbit, four steps round.
const ORBIT: readonly (readonly [number, number])[] = [
  [5, 4],
  [7, 1],
  [12, 1],
  [14, 4],
  [12, 7],
  [7, 7],
]
function stars(step: number): Px[] {
  const a = ORBIT[step % ORBIT.length] ?? [0, 0]
  const b = ORBIT[(step + 3) % ORBIT.length] ?? [0, 0]
  return [...dot(a[0] - 1, a[1] - 1, C.yellow), ...dot(b[0] - 1, b[1] - 1, C.blue)]
}

function fx(kind: Fx): Px[] {
  switch (kind) {
    case 'tear1':
      return sprite(6, 13, ['b'])
    case 'tear2':
      return sprite(6, 13, ['B', 'b'])
    case 'tear3':
      return sprite(6, 15, ['B', 'b'])
    case 'zSmall':
      return sprite(15, 5, ['bbb', '..b', '.b.', 'bbb'])
    case 'zBig':
      return sprite(16, 0, ['bbbb', '..b.', '.b..', 'bbbb'])
    case 'dot1':
      return sprite(4, 8, ['b'])
    case 'dot2':
      return sprite(3, 7, ['b'])
    case 'ask':
      return sprite(1, 0, ['.bb.', 'b..b', '..b.', '.b..', '....', '.b..'])
    case 'bang':
      return sprite(15, 2, ['hh', 'hh', 'hh', '..', 'hh'])
    case 'sparkA':
      return [...plus(0, 4, C.yellow), ...dot(16, 2, C.blue), ...plus(17, 7, C.pink), ...dot(0, 9, C.green)]
    case 'sparkB':
      return [...dot(0, 4, C.yellow), ...plus(16, 2, C.blue), ...dot(17, 7, C.pink), ...plus(0, 9, C.green)]
    case 'flame0':
      return flame(0)
    case 'flame1':
      return flame(1)
    case 'flame2':
      return flame(2)
    case 'motion':
      return sprite(18, 9, ['.B', 'B.'])
    case 'stars0':
      return stars(0)
    case 'stars1':
      return stars(1)
    case 'stars2':
      return stars(2)
    case 'stars3':
      return stars(4)
    case 'heart0':
      return sprite(15, 6, HEART)
    case 'heart1':
      return sprite(16, 3, HEART)
    case 'heart2':
      return sprite(17, 0, HEART, { h: { c: C.heart, o: 0.5 } })
  }
}

const BEHIND: ReadonlySet<Fx> = new Set(['flame0', 'flame1', 'flame2'])
// Effects that ride on the torso (move with lift); the rest float in the scene.
const ON_TORSO: ReadonlySet<Fx> = new Set(['tear1', 'tear2', 'tear3'])

/* ── Skins ─────────────────────────────────────────────────────────────── */

export type LooHat = 'beanie' | 'cap' | 'crown' | 'party' | 'grad'
export type LooGlasses = 'round' | 'shades' | 'nerd'

/** Cosmetics for the future shop. Every field is optional; colors are any CSS color. */
export interface LooSkin {
  hat?: LooHat
  glasses?: LooGlasses
  hoodie?: string
  scarf?: string
}

const SHADE: Ink = { c: '#000', o: 0.2 }
const GLINT: Ink = { c: '#fff', o: 0.5 }

// Hats sit on the head around the spring; the antenna is drawn on top, so the bulb always stays visible.
const HATS: Record<LooHat, Px[]> = {
  beanie: sprite(4, 6, ['...bbbbbb...', '..bbbbbbbb..', '.bbbbbbbbbb.', 'BBBBBBBBBBBB'], { b: C.blue, B: '#1592CF' }),
  cap: sprite(4, 7, ['..rrrrrrrr..', '.rrrrrrrrrr.', 'RRRRRRRRRRRRRRR'], { r: '#FF4B4B', R: '#E02F2F' }),
  crown: sprite(5, 6, ['y...yy...y', 'yy.yyyy.yy', 'yyyyyyyyyy', 'YbYYrrYYgY'], { y: C.yellow, Y: '#F2A900', b: C.blue, r: '#FF4B4B', g: C.green }),
  party: sprite(3, 2, ['..yy..', '..pp..', '.pppp.', '.yyyy.', 'pppppp', 'pppppp', 'iiiiii', '.pppp.'], { p: '#58CC02', y: C.yellow, i: C.pink }),
  grad: sprite(3, 7, ['MMMMMMMMMMMMMM', '..nnnnnnnnnn.y', '............y', '............y'], { M: '#3D3D52', n: '#2B2B3A', y: C.yellow }),
}

// Rings around each 1-px eye, joined by a bridge across the face.
const GLASSES: Record<LooGlasses, Px[]> = {
  round: sprite(5, 10, ['.k......k.', 'k.kkkkkk.k', 'k.k....k.k', '.k......k.']),
  shades: [...sprite(5, 11, ['kkkkkkkkkk', 'kkk....kkk']), ...sprite(5, 11, ['x......x'], { x: GLINT })],
  nerd: sprite(4, 10, ['kkkkk..kkkkk', 'k...kwwk...k', 'k...k..k...k', 'kkkkk..kkkkk']),
}

function hoodie(color: string): Px[] {
  const keys: Keys = { h: color, j: SHADE, w: C.white }
  return [
    ...sprite(4, 9, ['.hhhhhhhhhh.', 'h..........h', 'h..........h', 'h..........h', 'h..........h', 'hhhhhhhhhhhh', 'hhhhhhhhhhhh', 'hhhhhhhhhhhh'], keys),
    ...sprite(4, 16, ['jjjjjjjjjjjj'], keys),
    ...sprite(7, 14, ['w....w', 'w....w'], keys),
  ]
}

function scarf(color: string): Px[] {
  const keys: Keys = { c: color, j: SHADE, w: { c: '#fff', o: 0.35 } }
  return [...sprite(4, 14, ['cccccccccccc', '.......cc...', '.......cc...', '.......c.c..'], keys), ...sprite(5, 14, ['w.w.w.w.w.'], keys), ...sprite(11, 16, ['jj'], keys)]
}

function skinArm(px: Px[], color: string | undefined): Px[] {
  return color ? px.map((p) => ({ ...p, c: color })) : px
}

/* ── Poses ─────────────────────────────────────────────────────────────── */

export interface Pose {
  /** Torso offset against the boots: -1 = stretched up, +1 = squashed down. */
  lift?: number
  /** Whole-figure offset (jumps). Negative = up. */
  dy?: number
  /** Torso sideways wobble (dizzy). */
  dx?: number
  eyes: EyeKind
  arms: readonly [ArmKind, ArmKind]
  spring: SpringKind
  bulb?: BulbKind
  cheeks?: boolean
  fx?: readonly Fx[]
}

/** Every pixel of one animation frame, back to front, in grid coordinates. */
export function poseRects(pose: Pose, skin?: LooSkin): Px[] {
  const lift = pose.lift ?? 0
  const dy = pose.dy ?? 0
  const air = dy < 0
  const effects = pose.fx ?? []
  const torso: Px[] = []
  const add = (px: Px[]) => torso.push(...px)

  const sleeve = skin?.hoodie
  add(skinArm(arm(pose.arms[0], 'l'), sleeve))
  add(skinArm(arm(pose.arms[1], 'r'), sleeve))
  add(BODY)
  if (skin?.hoodie) add(hoodie(skin.hoodie))
  if (skin?.scarf) add(scarf(skin.scarf))
  if (pose.cheeks) add(CHEEKS)
  add(eyes(pose.eyes))
  for (const f of effects) if (ON_TORSO.has(f)) add(fx(f))
  if (skin?.glasses) add(GLASSES[skin.glasses])
  if (skin?.hat) add(HATS[skin.hat])
  add(antenna(pose.spring, pose.bulb ?? 'off'))

  // Boots stay on the ground; when the torso lifts, the legs stretch to fill the gap. In the air: boots only.
  const legTop = BOOT_ROW + Math.min(0, lift)
  const legH = air ? 1 : BOOT_ROW + 1 - legTop
  const legs = sprite(4, legTop, ['ddd......ddd']).map((p) => ({ ...p, h: legH }))

  const shadowW = air ? (dy <= -2 ? 6 : 8) : 10
  const shadow: Px = { x: 10 - shadowW / 2, y: 18, w: shadowW, h: 1, c: 'currentColor', o: 0.12 }

  return [
    shadow,
    ...effects.filter((f) => BEHIND.has(f)).flatMap(fx),
    ...shift([...legs, ...shift(torso, pose.dx ?? 0, lift)], 0, dy),
    ...effects.filter((f) => !BEHIND.has(f) && !ON_TORSO.has(f)).flatMap(fx),
  ]
}

/* ── Moods ─────────────────────────────────────────────────────────────── */

export type LooMood = 'idle' | 'happy' | 'cheer' | 'sad' | 'thinking' | 'sleeping' | 'wave' | 'fire' | 'eureka' | 'wink' | 'dizzy' | 'love' | 'surprised'
export const LOO_MOODS: readonly LooMood[] = ['idle', 'happy', 'cheer', 'sad', 'thinking', 'sleeping', 'wave', 'fire', 'eureka', 'wink', 'dizzy', 'love', 'surprised']

export interface LooFrame {
  /** How many clock ticks the frame stays on screen. */
  hold: number
  pose: Pose
}

export interface LooTimeline {
  /** Milliseconds per tick. */
  tick: number
  /** frames[0] is the key pose: what servers render, reduced-motion users see and static <Loo animated={false}/> shows. */
  frames: readonly LooFrame[]
}

function timeline(tick: number, base: Pose, frames: readonly (readonly [number, Partial<Pose>])[]): LooTimeline {
  return { tick, frames: frames.map(([hold, over]) => ({ hold, pose: { ...base, ...over } })) }
}

const UP: readonly [ArmKind, ArmKind] = ['up', 'up']
const REST: readonly [ArmKind, ArmKind] = ['rest', 'rest']

export const LOO_TIMELINES: Record<LooMood, LooTimeline> = {
  // Spring sways, 1-cell breathing bob, a blink.
  idle: timeline(200, { eyes: 'normal', arms: REST, spring: 'a', cheeks: true }, [
    [5, {}],
    [5, { lift: -1, spring: 'b' }],
    [1, { eyes: 'blink' }],
    [5, { spring: 'b' }],
    [5, { lift: -1 }],
  ]),
  // Bouncing on the spot, spring boinging.
  happy: timeline(110, { eyes: 'happy', arms: REST, spring: 'stretch', cheeks: true }, [
    [2, { dy: -1 }],
    [2, { dy: -2 }],
    [1, { dy: -1, spring: 'a' }],
    [1, { lift: 1, spring: 'squash' }],
    [1, { spring: 'a' }],
  ]),
  // Crouch → jump with arms up; the bulb flashes, sparkles twinkle.
  cheer: timeline(110, { eyes: 'happy', arms: UP, spring: 'stretch', bulb: 'on', cheeks: true, fx: ['sparkB'] }, [
    [2, { dy: -2 }],
    [1, { dy: -1, spring: 'a', bulb: 'off', fx: ['sparkA'] }],
    [1, { spring: 'a', bulb: 'on2', fx: ['sparkA'] }],
    [2, { lift: 1, arms: REST, spring: 'squash', bulb: 'off', fx: ['sparkA'] }],
    [1, { dy: -1, bulb: 'on2', fx: ['sparkB'] }],
  ]),
  // Squashed down, spring drooping, worried eyes, a tear rolling off.
  sad: timeline(160, { eyes: 'sad', arms: ['low', 'low'], spring: 'droop', fx: ['tear2'] }, [
    [4, {}],
    [2, { fx: ['tear3'] }],
    [6, { fx: [] }],
    [1, { eyes: 'blink', fx: [] }],
    [3, { fx: ['tear1'] }],
  ]),
  // Eyes up-left at a "?" that builds from two dots; the bulb flickers as the idea forms.
  thinking: timeline(150, { eyes: 'look', arms: REST, spring: 'a', bulb: 'on', fx: ['dot1', 'dot2', 'ask'] }, [
    [3, {}],
    [1, { bulb: 'off' }],
    [1, { bulb: 'on' }],
    [3, { bulb: 'off', spring: 'b' }],
    [1, { eyes: 'blink', bulb: 'off' }],
    [3, { bulb: 'off', fx: [] }],
    [2, { bulb: 'off', spring: 'b', fx: ['dot1'] }],
    [2, { bulb: 'off', fx: ['dot1', 'dot2'] }],
  ]),
  // Slow breathing, spring drooped, bulb off, "z"s drifting up.
  sleeping: timeline(320, { eyes: 'sleepy', arms: REST, spring: 'droop', cheeks: true, fx: ['zSmall', 'zBig'] }, [
    [3, {}],
    [2, { lift: 1, fx: ['zBig'] }],
    [3, { lift: 1, fx: [] }],
    [2, { fx: ['zSmall'] }],
  ]),
  // Right arm swinging, with a wink.
  wave: timeline(170, { eyes: 'wink', arms: ['rest', 'up'], spring: 'a', cheeks: true, fx: ['motion'] }, [
    [2, {}],
    [2, { arms: ['rest', 'wave'], spring: 'b', fx: [] }],
    [2, {}],
    [2, { arms: ['rest', 'wave'], spring: 'b', fx: [] }],
    [4, { eyes: 'normal', fx: [] }],
  ]),
  // Fired up: flames flicker behind, fists pump, determined >-< squint.
  fire: timeline(110, { eyes: 'squint', arms: UP, spring: 'stretch', fx: ['flame0'] }, [
    [2, {}],
    [2, { lift: -1, arms: ['up', 'rest'], spring: 'a', fx: ['flame1'] }],
    [2, { fx: ['flame2'] }],
    [2, { lift: -1, arms: ['rest', 'up'], spring: 'b', fx: ['flame1'] }],
  ]),
  // The idea lands: sparkle eyes, bulb blazing with twinkling rays, a little hop.
  eureka: timeline(130, { eyes: 'sparkle', arms: REST, spring: 'stretch', bulb: 'on', cheeks: true }, [
    [3, {}],
    [1, { dy: -1, bulb: 'on2' }],
    [2, { dy: -1, arms: UP }],
    [1, { bulb: 'on2', spring: 'a' }],
    [1, { lift: 1, spring: 'squash' }],
    [2, { bulb: 'on2', spring: 'a' }],
  ]),
  // A wink, then the eye pops back open.
  wink: timeline(180, { eyes: 'wink', arms: REST, spring: 'b', cheeks: true }, [
    [6, {}],
    [4, { eyes: 'normal', spring: 'a' }],
    [1, { eyes: 'blink', spring: 'a' }],
    [3, { eyes: 'normal', spring: 'a' }],
  ]),
  // After a run of mistakes: x x eyes, wobbling, stars circling the bulb.
  dizzy: timeline(140, { eyes: 'dizzy', arms: ['low', 'low'], spring: 'droop', fx: ['stars0'] }, [
    [2, { dx: -1 }],
    [2, { spring: 'b', fx: ['stars1'] }],
    [2, { dx: 1, spring: 'a', fx: ['stars2'] }],
    [2, { spring: 'b', fx: ['stars3'] }],
  ]),
  // Heart eyes, little hearts floating up.
  love: timeline(160, { eyes: 'love', arms: REST, spring: 'a', cheeks: true, fx: ['heart1'] }, [
    [3, {}],
    [3, { lift: -1, spring: 'b', fx: ['heart2'] }],
    [2, { fx: [] }],
    [3, { lift: -1, spring: 'b', fx: ['heart0'] }],
  ]),
  // O O eyes, the spring shoots straight up, a "!".
  surprised: timeline(150, { eyes: 'surprised', arms: UP, spring: 'stretch', fx: ['bang'] }, [
    [4, { dy: -1 }],
    [2, {}],
    [1, { eyes: 'blink', arms: REST, spring: 'a', fx: [] }],
    [5, { arms: REST, spring: 'a', fx: [] }],
  ]),
}

export interface LooOverrides {
  eyes?: LooEyes
  bulb?: LooBulb
}

/** A mood's timeline with the `eyes` / `bulb` props applied. Blinks survive only when the override is the default `normal`. */
export function looTimeline(mood: LooMood, { eyes: e, bulb }: LooOverrides = {}): LooTimeline {
  const t = LOO_TIMELINES[mood]
  if (!e && !bulb) return t
  return {
    tick: t.tick,
    frames: t.frames.map((f, i) => ({
      hold: f.hold,
      pose: {
        ...f.pose,
        ...(e && !(e === 'normal' && f.pose.eyes === 'blink') ? { eyes: e } : {}),
        ...(bulb ? { bulb: bulb === 'flicker' ? (i % 2 ? 'off' : 'on') : bulb } : {}),
      },
    })),
  }
}

/** Where each frame sits on the looping tick clock: visible while a <= tick < a + h. */
export function frameSpans(t: LooTimeline): { a: number; h: number }[] {
  let a = 0
  return t.frames.map((f, i) => {
    const span = { a, h: f.hold }
    a += f.hold
    // Browsers without @property flip the clock straight to its end value; let the last frame cover it.
    if (i === t.frames.length - 1) span.h += 1
    return span
  })
}

export function timelineTicks(t: LooTimeline): number {
  return t.frames.reduce((n, f) => n + f.hold, 0)
}

/** A 1-cell ring around the opaque cells of `px` (sticker outline for busy backgrounds). */
export function outlineRects(px: Px[], color: string): Px[] {
  const solid = new Set<string>()
  for (const p of px) for (let x = p.x; x < p.x + p.w; x++) for (let y = p.y; y < p.y + p.h; y++) solid.add(`${x},${y}`)
  const ring = new Set<string>()
  for (const key of solid) {
    const [x = 0, y = 0] = key.split(',').map(Number)
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]] as const) {
      const n = `${x + dx},${y + dy}`
      if (!solid.has(n)) ring.add(n)
    }
  }
  return [...ring].map((key) => {
    const [x = 0, y = 0] = key.split(',').map(Number)
    return { x, y, w: 1, h: 1, c: color }
  })
}

/** The logo mark: idle key frame with the bulb lit (no rays — they'd leave the crop), without the ground shadow. */
export function markRects(): Px[] {
  return poseRects({ eyes: 'normal', arms: REST, spring: 'a', cheeks: true, bulb: 'on' }).filter((p) => p.c !== 'currentColor' && p.c !== C.glow)
}

/** One rect as an SVG string (for icons built outside React). */
export function rectSvg(p: Px): string {
  return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${p.c}"${p.o === undefined ? '' : ` fill-opacity="${p.o}"`}/>`
}
