import type { Frame, StepScenario } from '../engine/types'

export interface Stage {
  id: string
  label: string
  name: string
  // entrance criteria (current process document, short)
  criteria: string[]
  // stage introduced later than the example proposal went through the process
  since?: string
}

export const STAGES: readonly Stage[] = [
  { id: '0', label: 'Stage 0', name: 'Ідея', criteria: ['вимог немає', 'ідею ще не представили комітету або ще не просунули'] },
  { id: '1', label: 'Stage 1', name: 'Proposal', criteria: ['є champion — делегат TC39', 'описано проблему, приклади, загальний API', 'публічний репозиторій'] },
  { id: '2', label: 'Stage 2', name: 'Draft', criteria: ['обрано бажане рішення', 'чернетка специфікації з основною семантикою і синтаксисом'] },
  { id: '2.7', label: 'Stage 2.7', name: 'Approved in principle', criteria: ['повний текст специфікації', 'підписи рецензентів і редакторів ECMAScript', 'далі змінюють лише через тести й відгуки реалізацій'], since: 'з 2024' },
  { id: '3', label: 'Stage 3', name: 'Recommended for implementation', criteria: ['тести test262 написані й змерджені', 'рушії реалізують і випускають (часто за прапорцем)'] },
  { id: '4', label: 'Stage 4', name: 'Finished', criteria: ['дві сумісні реалізації, що проходять test262', 'досвід реального використання', 'PR у ecma262 схвалено редакторами'] },
]

export interface Tc39Frame extends Frame {
  // index into STAGES where the card is; null = not proposed yet / shipped
  at: number | null
  // stages the card has already passed
  passed: string[]
  // stage skipped by this proposal (process did not have it yet)
  skipped: string[]
  // shipped in an edition
  edition: string | null
  snippet: string
}

const before = `const city = user && user.address && user.address.city`
const after = `const city = user?.address?.city`

const code = `// було
${before}
// стало (ES2020)
${after}`

const pipeline: StepScenario<Tc39Frame> = {
  code,
  frames: [
    { line: null, at: null, passed: [], skipped: [], edition: null, snippet: before, note: 'TC39 — технічний комітет Ecma, що розвиває ECMAScript. Кожна нова можливість мови проходить стадії 0 → 4, а рішення про перехід комітет ухвалює консенсусом на зустрічах.' },
    { line: 2, at: 0, passed: [], skipped: [], edition: null, snippet: before, note: 'Stage 0: просто ідея. Біль знайома: щоб безпечно дістати вкладене поле, доводиться повторювати шлях через &&. Формальних вимог на цій стадії немає.' },
    { line: 2, at: 1, passed: ['0'], skipped: [], edition: null, snippet: before, note: 'Stage 1: є champion, описана проблема й приклади, створено публічний репозиторій. Комітет погоджується витрачати час на дослідження — але це ще не обіцянка, що фіча з’явиться.' },
    { line: 4, at: 2, passed: ['0', '1'], skipped: [], edition: null, snippet: after, note: 'Stage 2: обрано рішення — оператор ?. — і є чернетка специфікації, деталі ще уточнюють. Приклад такої деталі з фінального тексту: ?. не розпізнається перед цифрою, тож a?.5:0 лишається тернарним оператором.' },
    { line: 4, at: 3, passed: ['0', '1', '2'], skipped: ['2.7'], edition: null, snippet: after, note: 'Stage 2.7 з’явилася лише у 2024-му, тож optional chaining її не проходив. Тоді повний текст і підписи рецензентів були вимогою для Stage 3, а тести test262 — для Stage 4.' },
    { line: 4, at: 4, passed: ['0', '1', '2'], skipped: ['2.7'], edition: null, snippet: after, note: 'Stage 3 (2019): дизайн заморожено, рушії реалізують фічу, а зміни можливі лише через проблеми реалізації. Тоді ж підтримку додав TypeScript 3.7 — розробники могли користуватися заздалегідь.' },
    { line: 4, at: 5, passed: ['0', '1', '2', '3'], skipped: ['2.7'], edition: null, snippet: after, note: 'Stage 4: вимоги виконано — сумісні реалізації в рушіях, тести test262, схвалений редакторами PR у специфікацію. Фіча завершена й чекає на найближче щорічне видання.' },
    { line: 4, at: null, passed: ['0', '1', '2', '3', '4'], skipped: ['2.7'], edition: 'ES2020', snippet: after, note: 'Optional chaining увійшов до ECMAScript 2020. Стандарт виходить щороку: усе, що досягло Stage 4 до «зрізу» специфікації, потрапляє в наступне видання.' },
    { line: null, at: null, passed: ['0', '1', '2', '3', '4'], skipped: ['2.7'], edition: 'ES2020', snippet: after, note: 'Практичне правило: Stage 3 — уже можна пробувати через транспілятор чи прапорці; Stage 4 — частина мови. Пропозиції на Stage 1–2 ще можуть кардинально змінитися або зникнути.' },
  ],
}

export const tc39Scenarios: Record<string, StepScenario<Tc39Frame>> = {
  pipeline,
}
