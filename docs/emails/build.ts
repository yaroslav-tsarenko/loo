// Builds the Supabase Auth email templates (pnpm emails:build) in the Loo game style — same layout as the
// reminder emails (src/email/layout.ts). Output: docs/emails/*.html + subjects.json + index.html (preview).
// Paste each file into Supabase → Authentication → Emails → Templates (subject + body).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderEmail, type EmailParts } from '@/email/layout'

const OUT = path.dirname(fileURLToPath(import.meta.url))
const SITE = '{{ .SiteURL }}'
const link = (type: string) => `${SITE}/auth/confirm?token_hash={{ .TokenHash }}&type=${type}`
type Template = { file: string; supabase: string; subject: string; parts: Omit<EmailParts, 'siteUrl'> }

const TEMPLATES: Template[] = [
  {
    file: 'confirm-signup.html', supabase: 'Confirm sign up', subject: 'Підтверди пошту — і рушаймо! · Loo',
    parts: {
      preheader: 'Один клік — і Loo готовий вирушати з тобою за першим рівнем.', pose: { eyes: 'happy', bulb: true },
      title: 'Твоя пригода починається!',
      text: 'Loo вже вилупився з яйця й чекає на тебе. Підтверди пошту — і рушаймо за першим рівнем: короткі уроки, боси, серії й ліги.',
      quest: { title: 'Підтверди пошту', step: 4, total: 5, reward: 'Останній крок' },
      href: link('email'), cta: 'Підтвердити пошту',
      note: 'Якщо ти не реєструвався в Loo — просто проігноруй цей лист, акаунт не буде активовано.',
    },
  },
  {
    file: 'reset-password.html', supabase: 'Reset password', subject: 'Новий пароль для Loo',
    parts: {
      preheader: 'Посилання, щоб встановити новий пароль. Діє обмежений час.', pose: { eyes: 'squint', bulb: true },
      title: 'Відновимо доступ',
      text: 'Хтось (сподіваємось, ти) попросив новий пароль для акаунта Loo. Натисни кнопку й придумай новий — твій прогрес, серія й спорядження на місці.',
      href: link('recovery'), cta: 'Встановити новий пароль',
      note: 'Посилання діє обмежений час і спрацює лише один раз. Не просив змінити пароль? Нічого не роби — старий пароль працює далі.',
    },
  },
  {
    file: 'change-email.html', supabase: 'Change email address', subject: 'Підтверди нову пошту · Loo',
    parts: {
      preheader: 'Підтверди, що це твоя нова адреса для входу в Loo.', pose: { eyes: 'normal', bulb: true },
      title: 'Нова пошта для Loo',
      text: 'Ти хочеш змінити пошту акаунта з <b>{{ .Email }}</b> на <b>{{ .NewEmail }}</b>. Підтверди, і далі входитимеш з новою адресою.',
      href: link('email_change'), cta: 'Підтвердити нову пошту',
      note: 'Не змінював пошту? Не натискай кнопку й напиши нам на support@playloo.app.',
    },
  },
  {
    file: 'magic-link.html', supabase: 'Magic link or OTP', subject: 'Твоє посилання для входу · Loo',
    parts: {
      preheader: 'Вхід в один клік — без пароля.', pose: { eyes: 'happy', bulb: true },
      title: 'Вхід в один клік', text: 'Натисни кнопку — і ти знову в Loo. Серія чекає!',
      href: link('magiclink'), cta: 'Увійти в Loo',
      note: 'Посилання діє обмежений час. Не намагався увійти? Просто проігноруй цей лист.',
    },
  },
  {
    file: 'invite.html', supabase: 'Invite user', subject: 'Тебе запрошують у Loo',
    parts: {
      preheader: 'Тебе запросили вчитися граючи: уроки, боси, ліги.', pose: { eyes: 'happy', bulb: true },
      title: 'Тебе запросили в Loo!',
      text: 'Loo — навчання як гра: короткі уроки, боси-екзамени, серії й тижневі ліги. Прийми запрошення — і отримай свого піксельного напарника.',
      quest: { title: 'Прийми запрошення', step: 1, total: 5, reward: 'Старт пригоди' },
      href: link('invite'), cta: 'Прийняти запрошення',
      note: 'Не чекав запрошення? Просто проігноруй цей лист.',
    },
  },
]

const sample = (html: string) => html.replaceAll(SITE, 'https://playloo.app').replaceAll('{{ .TokenHash }}', 'sample_token').replaceAll('{{ .Email }}', 'old@example.com').replaceAll('{{ .NewEmail }}', 'new@example.com')
const built = TEMPLATES.map((t) => ({ ...t, html: renderEmail({ ...t.parts, siteUrl: SITE }) }))
for (const t of built) fs.writeFileSync(path.join(OUT, t.file), t.html)
fs.writeFileSync(path.join(OUT, 'subjects.json'), JSON.stringify(Object.fromEntries(built.map((t) => [t.supabase, { subject: t.subject, file: t.file }])), null, 2) + '\n')
fs.writeFileSync(
  path.join(OUT, 'index.html'),
  `<!doctype html><html lang="uk"><meta charset="utf-8"><title>Loo — шаблони листів</title><body style="margin:0;background:#16112b;font-family:system-ui,sans-serif;color:#eeeaff;padding:24px;"><h1 style="margin:0 0 16px;font-size:22px;">Loo — шаблони листів (Supabase Auth)</h1><div style="display:flex;flex-wrap:wrap;gap:20px;">${built
    .map((t) => `<div><div style="font-weight:700;margin-bottom:6px;">${t.supabase} · «${t.subject}»</div><iframe style="width:560px;height:900px;border:0;border-radius:12px;background:#fff;" srcdoc="${sample(t.html).replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"></iframe></div>`)
    .join('')}</div></body></html>`,
)
console.log(`${built.length} templates → ${OUT}`)
