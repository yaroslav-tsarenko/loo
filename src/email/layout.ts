// Email layout in the Loo game style (docs/DESIGN.md «Loo Pixel-soft»), shared by the Supabase Auth templates
// (docs/emails/build.ts) and the reminder emails (scripts/reminders.ts). Pure: strings in, HTML out.
// Email-safe on purpose: tables + inline styles only. Gmail strips SVG and web fonts, so pixel Loo and the «LOO»
// wordmark are drawn with table cells — they look the same in every client, with no images to block.

const C = {
  page: '#f6f3ff',
  card: '#ffffff',
  line: '#e3dbf7',
  lineStrong: '#cbbfeb',
  ink: '#2a2145',
  ink2: '#655a85',
  ink3: '#a398c2',
  violet: '#7c4dff',
  violetLip: '#5b2fd6',
  violetSoft: '#f3eeff',
  mint: '#2dd4bf',
  mintInk: '#0f766e',
  track: '#d9cff5',
  night: '#1e1838',
}
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

/* ── pixel art as tables ───────────────────────────────────────────────── */

const LOO_COLORS: Record<string, string> = { b: '#8B5CF6', d: '#6D28D9', k: '#1E1033', s: '#4C1D95', o: '#DDD6FE', O: '#FFC800', r: '#FDE68A', p: '#F9A8D4' }
const LOO_EYES = {
  normal: [[4, 8], [4, 9], [11, 8], [11, 9]],
  happy: [[4, 8], [3, 9], [5, 9], [11, 8], [10, 9], [12, 9]],
  squint: [[3, 8], [4, 9], [3, 9], [12, 8], [11, 9], [12, 9]],
  sad: [[5, 8], [4, 9], [10, 8], [11, 9]],
} as const

export interface LooPose {
  eyes: keyof typeof LOO_EYES
  bulb: boolean
}

function looRows(pose: LooPose): string[] {
  const rows = [
    '.......oo.......', '.......oo.......', '........s.......', '.......s........', '........s.......',
    '...bbbbbbbbbb...', '..bbbbbbbbbbbb..', '..bbbbbbbbbbbb..', '..bbbbbbbbbbbb..', '..bbbbbbbbbbbb..',
    'bbbbbbbbbbbbbbbb', '..bpbbbbbbbbpb..', '..dddddddddddd..', '..ddd......ddd..',
  ]
  const set = (x: number, y: number, ch: string) => {
    rows[y] = rows[y]!.slice(0, x) + ch + rows[y]!.slice(x + 1)
  }
  for (const [x, y] of LOO_EYES[pose.eyes]) set(x, y, 'k')
  if (pose.bulb) {
    rows[0] = rows[0]!.replace(/o/g, 'O')
    rows[1] = rows[1]!.replace(/o/g, 'O')
    set(5, 0, 'r')
    set(10, 0, 'r')
    set(5, 2, 'r')
    set(10, 2, 'r')
  }
  return rows
}

const FONT5x7: Record<string, string[]> = {
  L: ['x....', 'x....', 'x....', 'x....', 'x....', 'x....', 'xxxxx'],
  O: ['.xxx.', 'x...x', 'x...x', 'x...x', 'x...x', 'x...x', '.xxx.'],
}

function pixelTable(rows: readonly string[], colors: Record<string, string>, cell: number): string {
  const w = Math.max(...rows.map((r) => r.length))
  const trs = rows
    .map((row) => {
      const tds = [...row.padEnd(w, '.')].map((ch) => {
        const c = colors[ch]
        return `<td width="${cell}" height="${cell}" style="width:${cell}px;height:${cell}px;padding:0;font-size:0;line-height:0;${c ? `background:${c};` : ''}"${c ? ` bgcolor="${c}"` : ''}></td>`
      })
      return `<tr>${tds.join('')}</tr>`
    })
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;">${trs}</table>`
}

function wordmark(text: string, color: string, cell: number): string {
  const letters = [...text].map((ch) => FONT5x7[ch]!)
  const rows = Array.from({ length: 7 }, (_, y) => letters.map((l) => l[y]).join('.'))
  return pixelTable(rows, { x: color }, cell)
}

/* ── building blocks ───────────────────────────────────────────────────── */

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr><td align="center" bgcolor="${C.violet}" style="background:${C.violet};border-radius:12px;border-bottom:5px solid ${C.violetLip};">
    <a href="${href}" target="_blank" style="display:inline-block;padding:16px 34px;font-family:${FONT};font-size:17px;font-weight:800;color:#ffffff;text-decoration:none;letter-spacing:.2px;">${label}</a>
  </td></tr>
</table>`
}

export interface Quest {
  title: string
  step: number
  total: number
  reward: string
}

function questBox({ title, step, total, reward }: Quest): string {
  const segs = Array.from(
    { length: total },
    (_, i) => `<td height="12" style="padding:0 3px;"><div style="height:12px;border-radius:3px;background:${i < step ? C.mint : C.track};font-size:0;line-height:0;">&nbsp;</div></td>`,
  ).join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.violetSoft};border:2px solid ${C.line};border-radius:12px;">
  <tr><td style="padding:14px 16px 6px;font-family:${FONT};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${C.violet};">Квест</td>
      <td align="right" style="font-size:12px;font-weight:800;color:${C.mintInk};">${reward}</td>
    </tr></table>
    <div style="font-size:16px;font-weight:800;color:${C.ink};margin-top:4px;">${title}</div>
  </td></tr>
  <tr><td style="padding:6px 13px 14px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${segs}</tr></table></td></tr>
</table>`
}

export interface EmailParts {
  /** Hidden preview line next to the subject in the inbox. */
  preheader: string
  pose: LooPose
  /** Already-escaped HTML. */
  title: string
  /** Already-escaped HTML (may contain <b>). */
  text: string
  quest?: Quest | null
  href: string
  cta: string
  note: string
  /** Origin for the footer link, e.g. https://playloo.app or the Supabase {{ .SiteURL }} placeholder. */
  siteUrl: string
  /** Shown for reminders and newsletters (not for account emails). */
  unsubscribeUrl?: string | null
}

export function renderEmail(p: EmailParts): string {
  const unsubscribe = p.unsubscribeUrl
    ? `<br>Не хочеш нагадувань? <a href="${p.unsubscribeUrl}" style="color:${C.ink3};">Відписатися</a> або змінити в налаштуваннях.`
    : ''
  return `<!doctype html>
<html lang="uk">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${p.title}</title></head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${p.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
      <tr><td bgcolor="${C.card}" style="background:${C.card};border:2px solid ${C.line};border-bottom:6px solid ${C.lineStrong};border-radius:18px;overflow:hidden;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" bgcolor="${C.night}" style="background:${C.night};padding:28px 16px 22px;border-radius:16px 16px 0 0;">
            ${pixelTable(looRows(p.pose), LOO_COLORS, 6)}
            <div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>
            ${wordmark('LOO', '#ffffff', 5)}
          </td></tr>
          <tr><td height="8" bgcolor="${C.violet}" style="background:${C.violet};height:8px;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:30px 32px 8px;font-family:${FONT};color:${C.ink};">
            <h1 style="margin:0 0 12px;font-size:26px;line-height:1.25;font-weight:800;color:${C.ink};">${p.title}</h1>
            <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:${C.ink2};">${p.text}</p>
            ${p.quest ? questBox(p.quest) : ''}
          </td></tr>
          <tr><td align="center" style="padding:24px 32px 8px;">${button(p.href, p.cta)}</td></tr>
          <tr><td style="padding:18px 32px 28px;font-family:${FONT};">
            <p style="margin:0 0 10px;font-size:13px;line-height:1.55;color:${C.ink3};">Кнопка не працює? Скопіюй посилання в браузер:<br><a href="${p.href}" style="color:${C.violet};word-break:break-all;">${p.href}</a></p>
            <p style="margin:0;font-size:13px;line-height:1.55;color:${C.ink3};">${p.note}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td align="center" style="padding:20px 12px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.ink3};">
        <b style="color:${C.ink2};">Loo</b> · навчання як гра · <a href="${p.siteUrl}" style="color:${C.ink3};">playloo.app</a><br>
        Питання? Пиши на <a href="mailto:support@playloo.app" style="color:${C.violet};">support@playloo.app</a>${unsubscribe}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
`
}
