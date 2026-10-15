// IEEE 754 double decoding. Bits come from a real DataView; the exact decimal
// value of the stored double is computed with BigInt (no rounding anywhere).

export type FloatKind = 'zero' | 'subnormal' | 'normal' | 'infinity' | 'nan'

export interface FloatParts {
  value: number
  bits: bigint
  // 64 chars of '0' / '1'
  binary: string
  // 16 uppercase hex digits
  hex: string
  sign: 0 | 1
  // raw biased exponent 0..2047
  exponent: number
  // 52-bit fraction field
  fraction: bigint
  kind: FloatKind
}

const view = new DataView(new ArrayBuffer(8))
const FRACTION_MASK = (1n << 52n) - 1n
const ABS_MASK = (1n << 63n) - 1n

export function toBits(x: number): bigint {
  view.setFloat64(0, x)
  return view.getBigUint64(0)
}

export function fromBits(bits: bigint): number {
  view.setBigUint64(0, BigInt.asUintN(64, bits))
  return view.getFloat64(0)
}

export function decompose(x: number): FloatParts {
  const bits = toBits(x)
  const sign = Number(bits >> 63n) as 0 | 1
  const exponent = Number((bits >> 52n) & 0x7ffn)
  const fraction = bits & FRACTION_MASK
  const kind: FloatKind = exponent === 2047 ? (fraction === 0n ? 'infinity' : 'nan') : exponent === 0 ? (fraction === 0n ? 'zero' : 'subnormal') : 'normal'
  return {
    value: x,
    bits,
    binary: bits.toString(2).padStart(64, '0'),
    hex: bits.toString(16).toUpperCase().padStart(16, '0'),
    sign,
    exponent,
    fraction,
    kind,
  }
}

// value = (−1)^sign × significand × 2^power, significand an integer
function integerForm(p: FloatParts): { significand: bigint; power: number } {
  if (p.exponent === 0) return { significand: p.fraction, power: -1074 }
  return { significand: p.fraction | (1n << 52n), power: p.exponent - 1075 }
}

// Every finite double is a dyadic rational, so its decimal expansion is finite:
// m × 2^-k = m × 5^k / 10^k.
export function exactDecimal(x: number): string {
  if (Number.isNaN(x)) return 'NaN'
  if (!Number.isFinite(x)) return x > 0 ? 'Infinity' : '-Infinity'
  const p = decompose(x)
  const { significand, power } = integerForm(p)
  const minus = p.sign === 1 ? '-' : ''
  if (significand === 0n) return `${minus}0`
  if (power >= 0) return minus + (significand << BigInt(power)).toString()
  const k = -power
  const digits = (significand * 5n ** BigInt(k)).toString().padStart(k + 1, '0')
  const int = digits.slice(0, -k)
  const frac = digits.slice(-k).replace(/0+$/, '')
  return minus + (frac ? `${int}.${frac}` : int)
}

// what console.log prints (keeps the sign of -0)
export function shortest(x: number): string {
  return Object.is(x, -0) ? '-0' : String(x)
}

// Neighbouring doubles: bit patterns of non-negative doubles are ordered like the numbers.
export function nextUp(x: number): number {
  if (Number.isNaN(x) || x === Infinity) return x
  if (x === 0) return Number.MIN_VALUE
  const bits = toBits(x)
  return x > 0 ? fromBits(bits + 1n) : fromBits(bits - 1n)
}

export function nextDown(x: number): number {
  return -nextUp(-x)
}

// Distance from |x| to the next double up, as a power of two (null for NaN / ±Infinity / MAX_VALUE)
export function ulpPower(x: number): number | null {
  if (!Number.isFinite(x)) return null
  const p = decompose(Math.abs(x))
  return p.exponent === 0 ? -1074 : p.exponent - 1075
}

// How many representable doubles lie between a and b (−0 and +0 count as the same point)
export function ulpDistance(a: number, b: number): bigint {
  const ord = (x: number) => {
    const bits = toBits(x)
    return bits >> 63n ? -(bits & ABS_MASK) : bits
  }
  const d = ord(a) - ord(b)
  return d < 0n ? -d : d
}

// ── formula pieces ────────────────────────────────────────────────
export interface Formula {
  kind: FloatKind
  sign: 0 | 1
  // binary significand like '1.1001100…' (trailing zeros trimmed)
  significand: string
  // unbiased exponent used in the formula
  power: number | null
  // biased exponent as stored
  stored: number
}

export function formula(p: FloatParts): Formula {
  const frac = p.fraction.toString(2).padStart(52, '0').replace(/0+$/, '')
  const lead = p.kind === 'subnormal' || p.kind === 'zero' ? '0' : '1'
  const significand = frac ? `${lead}.${frac}` : lead
  const power = p.kind === 'normal' ? p.exponent - 1023 : p.kind === 'subnormal' || p.kind === 'zero' ? -1022 : null
  return { kind: p.kind, sign: p.sign, significand, power, stored: p.exponent }
}

// decimal value of 1.f (or 0.f) — exact enough to show; it is a double itself
export function significandValue(p: FloatParts): number {
  const f = Number(p.fraction) / 2 ** 52
  return p.kind === 'normal' ? 1 + f : f
}

// ── presets and a tiny expression parser for the free input ────────
export interface FloatPreset {
  id: string
  label: string
  value: number
  insight: string
}

export const FLOAT_PRESETS: readonly FloatPreset[] = [
  { id: '0.1', label: '0.1', value: 0.1, insight: '1/10 у двійковій системі — нескінченний дріб 0.000110011…₂. Мантиса обрізається на 52-му біті й округлюється вгору (кінець …1010), тож у пам’яті лежить трохи БІЛЬШЕ за 0.1.' },
  { id: '0.2', label: '0.2', value: 0.2, insight: 'Та сама мантиса, що й у 0.1, лише експонента на 1 більша: 0.2 = 0.1 × 2. Похибка теж подвоюється.' },
  { id: 'sum', label: '0.1 + 0.2', value: 0.1 + 0.2, insight: 'Обидва доданки вже округлені вгору, а сума округлюється ще раз — і потрапляє на сусідню поділку від 0.3. Тому 0.1 + 0.2 === 0.3 → false.' },
  { id: '0.3', label: '0.3', value: 0.3, insight: 'Найближчий до 0.3 double трохи МЕНШИЙ за 0.3. А 0.1 + 0.2 дала наступний double — рівно на 1 ULP більший.' },
  { id: '1', label: '1', value: 1, insight: 'Ціле — це теж double: 1.0 × 2⁰. Мантиса з нулів, бо провідна 1 прихована і не зберігається.' },
  { id: '0.5', label: '0.5', value: 0.5, insight: '0.5 = 2⁻¹ — степінь двійки, тому зберігається точно. Точні всі дроби зі знаменником-степенем двійки: 0.25, 0.375, 0.75.' },
  { id: '-0', label: '-0', value: -0, insight: 'Окремий біт знаку дає −0. -0 === 0 → true, але Object.is(-0, 0) → false, а 1 / -0 → -Infinity.' },
  { id: 'nan', label: 'NaN', value: NaN, insight: 'Експонента з одиниць і ненульова мантиса — це NaN. Таких шаблонів 2⁵³ − 2. IEEE 754 вимагає, щоб NaN не дорівнював нічому, навіть собі, тож перевіряй через Number.isNaN.' },
  { id: 'inf', label: 'Infinity', value: Infinity, insight: 'Експонента з одиниць і нульова мантиса — нескінченність. Її дає переповнення: 1e308 * 10 → Infinity.' },
  { id: '2^53', label: '2 ** 53', value: 2 ** 53, insight: 'На 2⁵³ закінчуються 53 біти точності: крок між сусідніми double тут уже 2. Непарні цілі далі не представимі.' },
  { id: '2^53+1', label: '2 ** 53 + 1', value: 2 ** 53 + 1, insight: '2⁵³ + 1 лежить рівно посередині між двома double і округлюється до парного — назад до 2⁵³. Тому 2 ** 53 === 2 ** 53 + 1 → true.' },
  { id: 'eps', label: 'Number.EPSILON', value: Number.EPSILON, insight: 'EPSILON = 2⁻⁵² — відстань від 1 до наступного double. Біля 1 це ціна одного біта мантиси; для більших чисел крок пропорційно більший.' },
  { id: 'maxsafe', label: 'MAX_SAFE_INTEGER', value: Number.MAX_SAFE_INTEGER, insight: '2⁵³ − 1: усі 52 біти мантиси — одиниці. Це найбільше n, для якого і n, і n + 1 точно представлені — межа «безпечних» цілих.' },
  { id: 'min', label: 'Number.MIN_VALUE', value: Number.MIN_VALUE, insight: 'Найменший додатний double ≈ 5e-324 — денормалізований: експонента з нулів, прихованої 1 немає, лише останній біт мантиси.' },
]

const CONSTANTS: Record<string, number> = {
  'Number.EPSILON': Number.EPSILON,
  'Number.MAX_SAFE_INTEGER': Number.MAX_SAFE_INTEGER,
  'Number.MIN_SAFE_INTEGER': Number.MIN_SAFE_INTEGER,
  'Number.MAX_VALUE': Number.MAX_VALUE,
  'Number.MIN_VALUE': Number.MIN_VALUE,
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  EPSILON: Number.EPSILON,
  'Math.PI': Math.PI,
  'Math.E': Math.E,
  NaN: NaN,
  Infinity: Infinity,
}

const TOKEN = /\s*(\*\*|[-+*/()]|Number\.[A-Z_]+|Math\.(?:PI|E)\b|[A-Z_]{3,}|NaN|Infinity|(?:0[xX][\da-fA-F]+|0[bB][01]+|0[oO][0-7]+|(?:\d[\d_]*\.?\d*|\.\d+)(?:[eE][-+]?\d+)?))/y

// Number literals, + - * / **, parentheses and a few constants. Evaluated with
// ordinary JS double arithmetic, so 0.1 + 0.2 behaves exactly like in JS. No eval.
export function evaluate(source: string): number | null {
  const tokens: string[] = []
  const text = source.trim()
  if (!text || text.length > 80) return null
  TOKEN.lastIndex = 0
  while (TOKEN.lastIndex < text.length) {
    const m = TOKEN.exec(text)
    if (!m) return null
    tokens.push(m[1]!)
    if (/^\s*$/.test(text.slice(TOKEN.lastIndex))) break
  }
  let i = 0
  const peek = () => tokens[i]
  const expr = (): number | null => {
    let left = term()
    while (left !== null && (peek() === '+' || peek() === '-')) {
      const op = tokens[i++]
      const right = term()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return left
  }
  const term = (): number | null => {
    let left = unary()
    while (left !== null && (peek() === '*' || peek() === '/')) {
      const op = tokens[i++]
      const right = unary()
      if (right === null) return null
      left = op === '*' ? left * right : left / right
    }
    return left
  }
  const unary = (): number | null => {
    if (peek() === '-' || peek() === '+') {
      const op = tokens[i++]
      const v = unary()
      return v === null ? null : op === '-' ? -v : v
    }
    return power()
  }
  const power = (): number | null => {
    const base = primary()
    if (base === null || peek() !== '**') return base
    i++
    const exp = unary()
    return exp === null ? null : base ** exp
  }
  const primary = (): number | null => {
    const t = tokens[i++]
    if (t === undefined) return null
    if (t === '(') {
      const v = expr()
      if (tokens[i++] !== ')') return null
      return v
    }
    if (t in CONSTANTS) return CONSTANTS[t]!
    const n = Number(t.replace(/_/g, ''))
    return /^[\d.]|^0[xbo]/i.test(t) && !Number.isNaN(n) ? n : null
  }
  const value = expr()
  return i === tokens.length ? value : null
}
