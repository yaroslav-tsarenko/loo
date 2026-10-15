// Decision tree for `this` (checked top to bottom = priority order).

export type QuestionId = 'arrow' | 'new' | 'explicit' | 'method' | 'strict'
export type ResultId = 'lexical' | 'constructed' | 'bound' | 'implicit' | 'default-strict' | 'default-sloppy'

export interface Question {
  id: QuestionId
  text: string
  yes: QuestionId | ResultId
  no: QuestionId | ResultId
}

export interface Result {
  id: ResultId
  emoji: string
  title: string
  value: string
  explain: string
  example: string
}

export const QUESTIONS: Record<QuestionId, Question> = {
  arrow: { id: 'arrow', text: 'Це стрілкова функція?', yes: 'lexical', no: 'new' },
  new: { id: 'new', text: 'Викликано через new?', yes: 'constructed', no: 'explicit' },
  explicit: { id: 'explicit', text: 'Викликано через call / apply або це функція з bind?', yes: 'bound', no: 'method' },
  method: { id: 'method', text: 'Викликано як метод: obj.fn() чи obj[key]()?', yes: 'implicit', no: 'strict' },
  strict: { id: 'strict', text: 'Код у strict mode (модуль, class, \'use strict\')?', yes: 'default-strict', no: 'default-sloppy' },
}

export const RESULTS: Record<ResultId, Result> = {
  lexical: {
    id: 'lexical',
    emoji: '🏹',
    title: 'Лексичний this',
    value: 'this ззовні',
    explain: 'Стрілка не має власного this: вона бере this з оточення, де її створено. call / apply / bind його не змінять, а new на стрілці — TypeError.',
    example: 'method() {\n  setTimeout(() => this.tick(), 100)\n}',
  },
  constructed: {
    id: 'constructed',
    emoji: '🐣',
    title: 'Новий об’єкт',
    value: 'новий об’єкт',
    explain: 'new створює порожній об’єкт з [[Prototype]] = Fn.prototype і викликає функцію з this = цей об’єкт. Найвищий пріоритет: перебиває навіть bind.',
    example: "const ann = new User('Аня')\n// this у User → ann",
  },
  bound: {
    id: 'bound',
    emoji: '👉',
    title: 'Явне прив’язування',
    value: 'перший аргумент',
    explain: 'this — те, що передали в call / apply / bind. У sloppy mode null / undefined замінюються на globalThis, а примітиви загортаються в об’єкти; у strict — як є.',
    example: 'greet.call(admin)\nconst g = greet.bind(admin)',
  },
  implicit: {
    id: 'implicit',
    emoji: '🔵',
    title: 'Неявне: об’єкт перед крапкою',
    value: 'obj',
    explain: 'this — об’єкт, на якому викликали метод. Важить лише остання крапка: a.b.fn() → this = a.b. Скопіюєш метод у змінну — зв’язок зникне.',
    example: "user.hi()      // this = user\nconst f = user.hi\nf()            // this втрачено",
  },
  'default-strict': {
    id: 'default-strict',
    emoji: '🫥',
    title: 'За замовчуванням (strict)',
    value: 'undefined',
    explain: 'Звичайний виклик fn() без крапки у strict mode. Модулі ES і тіло class — завжди strict.',
    example: "'use strict'\nfunction f() { return this }\nf() // undefined",
  },
  'default-sloppy': {
    id: 'default-sloppy',
    emoji: '🌐',
    title: 'За замовчуванням (sloppy)',
    value: 'globalThis',
    explain: 'Звичайний виклик у нестрогому режимі: this = глобальний об’єкт (window у браузері). Джерело багів — тому strict mode і модулі.',
    example: 'function f() { return this }\nf() === globalThis // true',
  },
}

export interface Preset {
  code: string
  answers: Partial<Record<QuestionId, boolean>>
  thisValue: string
}

export const PRESETS: readonly Preset[] = [
  { code: 'user.hi()', answers: { arrow: false, new: false, explicit: false, method: true }, thisValue: 'user' },
  { code: 'const f = user.hi; f()  // модуль', answers: { arrow: false, new: false, explicit: false, method: false, strict: true }, thisValue: 'undefined' },
  { code: "new User('Аня')", answers: { arrow: false, new: true }, thisValue: 'новий User' },
  { code: 'user.hi.call(admin)', answers: { arrow: false, new: false, explicit: true }, thisValue: 'admin' },
  { code: 'new (User.bind(admin))()', answers: { arrow: false, new: true }, thisValue: 'новий User, не admin' },
  { code: 'setTimeout(() => this.tick())', answers: { arrow: true }, thisValue: 'this зовнішньої функції' },
  { code: 'function f() { return this }; f()  // script', answers: { arrow: false, new: false, explicit: false, method: false, strict: false }, thisValue: 'globalThis' },
]

export const FIRST: QuestionId = 'arrow'

export function isResult(id: QuestionId | ResultId): id is ResultId {
  return id in RESULTS
}
