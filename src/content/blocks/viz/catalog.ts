// Catalog of [!viz] ids and scenarios. Pure data: the parser validates against it,
// the UI maps ids to components, CONTENT_SPEC.md documents it. Do not rename ids.

export type VizMode = 'steps' | 'interactive'

export interface VizScenarioInfo {
  id: string
  title: string
  description: string
  mode: VizMode
}

export interface VizInfo {
  id: string
  // icon ref for <Icon>: `px:…` (our pixel set) or a library glyph — never an emoji
  icon: string
  title: string
  description: string
  // first scenario is the default
  scenarios: readonly VizScenarioInfo[]
}

const steps = (id: string, title: string, description: string): VizScenarioInfo => ({ id, title, description, mode: 'steps' })
const interactive = (id: string, title: string, description: string): VizScenarioInfo => ({ id, title, description, mode: 'interactive' })

export const VIZ_CATALOG: readonly VizInfo[] = [
  {
    id: 'call-stack',
    icon: 'px:pancakes',
    title: 'Call Stack',
    description: 'Як рушій кладе і знімає кадри викликів',
    scenarios: [
      steps('nested-calls', 'Вкладені виклики', 'функція викликає функцію: push, push, pop, pop'),
      steps('recursion', 'Рекурсія', 'factorial(3): стек росте до base case і згортається з результатами'),
      steps('stack-overflow', 'Переповнення стека', 'рекурсія без base case → RangeError: Maximum call stack size exceeded'),
    ],
  },
  {
    id: 'event-loop',
    icon: 'px:alarm',
    title: 'Event Loop',
    description: 'Стек, Web APIs, черги мікро- і макрозадач',
    scenarios: [
      steps('basic-timeout', 'setTimeout(…, 0)', 'чому колбек таймера виконується після всього синхронного коду'),
      steps('promise-vs-timeout', 'Promise проти setTimeout', 'мікрозадачі виконуються раніше за наступну макрозадачу: A D C B'),
      steps('async-await', 'async / await', 'код після await — це мікрозадача; функція «ставиться на паузу»'),
      steps('microtask-starvation', 'Голодування черги', 'мікрозадачі, що додають мікрозадачі, не пускають таймер'),
    ],
  },
  {
    id: 'scope-chain',
    icon: 'px:matryoshka',
    title: 'Scope chain і замикання',
    description: 'Лексичні оточення, посилання outer і захоплені змінні',
    scenarios: [
      steps('closure-counter', 'Лічильник на замиканні', 'makeCounter() повернула функцію, а оточення з count вижило'),
      steps('loop-var-vs-let', 'var проти let у циклі', 'одна змінна i на всіх проти нової j на кожну ітерацію'),
      steps('shadowing', 'Затінення', 'пошук імені йде зсередини назовні й зупиняється на першому збігу'),
    ],
  },
  {
    id: 'hoisting',
    icon: 'px:balloon',
    title: 'Hoisting і TDZ',
    description: 'Фаза створення контексту проти фази виконання',
    scenarios: [
      steps('var-let-function', 'var, let і function', 'що існує ще до першого рядка: undefined, TDZ чи готова функція'),
      steps('tdz', 'Temporal Dead Zone', 'внутрішній let затіняє зовнішній ще до свого рядка → ReferenceError'),
    ],
  },
  {
    id: 'this-binding',
    icon: 'px:target',
    title: 'this',
    description: 'Значення this визначає спосіб виклику',
    scenarios: [
      interactive('rules', 'Дерево правил', 'обери, як викликано функцію, і побач, чим стане this'),
      steps('lost-this', 'Втрачений this', 'метод, відірваний від об’єкта, і як bind це лікує'),
      steps('arrow', 'Стрілкові функції', 'стрілка не має свого this і бере його ззовні'),
    ],
  },
  {
    id: 'prototype-chain',
    icon: 'px:rabbit',
    title: 'Ланцюжок прототипів',
    description: 'Пошук властивості через [[Prototype]] аж до null',
    scenarios: [
      interactive('lookup', 'Пошук властивості', 'обери властивість і пройди ланцюжок bunny → rabbit → animal → Object.prototype → null'),
      steps('class-sugar', 'class — це цукор', 'що насправді створюють class, extends і new'),
    ],
  },
  {
    id: 'promise-states',
    icon: 'px:hourglass',
    title: 'Стани Promise',
    description: 'pending → fulfilled / rejected, ланцюжки і комбінатори',
    scenarios: [
      interactive('lifecycle', 'Життєвий цикл', 'resolve / reject руками: проміс змінює стан лише один раз'),
      steps('chain', 'Ланцюжок then/catch', 'кожен then повертає новий проміс; помилка «пролітає» до catch'),
      interactive('combinators', 'all / allSettled / race / any', 'налаштуй час і результат трьох промісів і порівняй комбінатори'),
    ],
  },
  {
    id: 'coercion',
    icon: 'px:wand',
    title: 'Приведення типів',
    description: 'Алгоритми зі специфікації крок за кроком',
    scenarios: [
      interactive('loose-equality', 'Алгоритм ==', 'обери два значення — і пройди IsLooselyEqual до результату'),
      interactive('plus-operator', 'Оператор +', 'ToPrimitive, потім конкатенація рядків або додавання чисел'),
    ],
  },
  {
    id: 'memory-refs',
    icon: 'px:box',
    title: 'Значення і посилання',
    description: 'Стек проти купи: що копіюється при присвоєнні',
    scenarios: [
      steps('copy-primitive-vs-object', 'Примітив проти об’єкта', 'b = a копіює число, а alias = cat копіює посилання'),
      steps('shallow-vs-deep', 'Поверхнева і глибока копія', 'spread копіює лише верхній рівень, structuredClone — усе'),
    ],
  },
  {
    id: 'gc',
    icon: 'px:trash',
    title: 'Збирач сміття',
    description: 'Досяжність від коренів і mark & sweep',
    scenarios: [
      interactive('reachability', 'Досяжність', 'переріж посилання, запусти mark & sweep і подивись, що зникне'),
      steps('leak-closure', 'Витік через замикання', 'обробник події тримає замикання, а воно — великий масив'),
    ],
  },
  {
    id: 'debounce-throttle',
    icon: 'px:clock',
    title: 'Debounce і throttle',
    description: 'Три таймлайни: сирі події, debounce, throttle',
    scenarios: [interactive('compare', 'Порівняння', 'натискай «подія» або запусти сплеск і підкрути мілісекунди')],
  },
  {
    id: 'array-pipeline',
    icon: 'px:apple',
    title: 'map → filter → reduce',
    description: 'Елементи проходять через етапи конвеєра',
    scenarios: [steps('map-filter-reduce', 'Кошик фруктів', 'знижка через map, відбір через filter, сума через reduce')],
  },
  {
    id: 'generators',
    icon: 'px:paddle',
    title: 'Генератори',
    description: 'Пінг-понг керування між викликом і генератором',
    scenarios: [steps('yield-pingpong', 'next() ⇄ yield', 'значення летять туди через next(x) і назад через yield')],
  },
  {
    id: 'float-precision',
    icon: 'px:abacus',
    title: 'IEEE 754: як лежить number',
    description: '64 біти double: знак, експонента, мантиса і точне значення',
    scenarios: [interactive('ieee754', 'Біти числа', 'обери число й побач біти, формулу і точне значення — звідси 0.1 + 0.2 ≠ 0.3')],
  },
  {
    id: 'regex-engine',
    icon: 'px:magnifier',
    title: 'Рушій регулярних виразів',
    description: 'Backtracking крок за кроком: спроби, відступи, катастрофа',
    scenarios: [interactive('backtracking', 'Backtracking', 'жадібний і лінивий квантифікатори, альтернатива і вибух кроків у /(a+)+b/')],
  },
  {
    id: 'proxy-traps',
    icon: 'px:mirror',
    title: 'Proxy і Reflect',
    description: 'Пастки handler перехоплюють операції над об’єктом',
    scenarios: [steps('get-set', 'get / set / has', 'читання і запис ідуть через пастки, без пастки — прямо в target; валідація кидає TypeError')],
  },
  {
    id: 'module-graph',
    icon: 'px:blocks',
    title: 'Модулі: ESM і CommonJS',
    description: 'Побудова, зв’язування й виконання графа модулів',
    scenarios: [
      steps('esm-live-binding', 'Живі зв’язки ESM', 'три фази завантаження; import бачить 0, потім 1, а присвоєння імпорту кидає TypeError'),
      steps('cjs-vs-esm', 'CommonJS проти ESM', 'module.exports копіює значення (0), import — живий зв’язок (1); require кешується'),
    ],
  },
  {
    id: 'unicode-string',
    icon: 'px:letterTile',
    title: 'Рядки і Unicode',
    description: 'Графеми, code points, UTF-16 code units і байти UTF-8',
    scenarios: [interactive('code-units', 'Що таке довжина рядка', 'обери рядок: length, [...s], Intl.Segmenter і TextEncoder рахують різне')],
  },
  {
    id: 'event-propagation',
    icon: 'px:bubbles',
    title: 'Поширення подій',
    description: 'Capture → target → bubble, target проти currentTarget і делегування',
    scenarios: [
      steps('capture-bubble', 'Capture, target, bubble', 'клік по кнопці: шлях window → button і назад, eventPhase і stopPropagation'),
      steps('delegation', 'Делегування', 'один слухач на <ul> і closest(\'li\') обробляють навіть щойно додані пункти'),
    ],
  },
  {
    id: 'render-pipeline',
    icon: 'px:image',
    title: 'Конвеєр рендерингу',
    description: 'Кадр за 16.7 мс: Style → Layout → Paint → Composite',
    scenarios: [
      steps('frame', 'Анатомія кадру', 'що запускають width, color і transform: Layout, Paint чи лише Composite'),
      steps('layout-thrashing', 'Layout thrashing', 'читання й запис упереміш → forced reflow на кожній ітерації, і як це виправити'),
    ],
  },
  {
    id: 'cors',
    icon: 'px:shield',
    title: 'CORS',
    description: 'Origin, Access-Control-* заголовки і preflight',
    scenarios: [
      steps('simple', 'Простий запит', 'GET з Origin: без Allow-Origin відповідь блокується, хоча сервер запит виконав'),
      steps('preflight', 'Preflight', 'PUT з JSON і cookie: спершу OPTIONS, потім справжній запит; credentials забороняють *'),
    ],
  },
  {
    id: 'http-cache',
    icon: 'px:floppy',
    title: 'HTTP-кеш',
    description: 'max-age, ETag і ревалідація з 304',
    scenarios: [steps('revalidation', 'Свіжість і ревалідація', 'fresh → з кешу без мережі, stale → If-None-Match → 304 або нова 200')],
  },
  {
    id: 'service-worker',
    icon: 'px:hardHat',
    title: 'Service Worker',
    description: 'install → waiting → activate → fetch і оновлення версій',
    scenarios: [steps('lifecycle', 'Життєвий цикл', 'precache в install, очищення в activate, cache-first fetch і чому нова версія чекає')],
  },
  {
    id: 'hidden-classes',
    icon: 'px:map',
    title: 'Hidden classes і inline caches',
    description: 'Як V8 описує форму об’єкта і кешує доступ до властивостей',
    scenarios: [
      steps('shapes', 'Форми і переходи', 'однаковий порядок властивостей — спільна форма; delete → dictionary mode'),
      steps('inline-cache', 'Inline cache', 'getX(o): monomorphic → polymorphic → megamorphic з кожною новою формою'),
    ],
  },
  {
    id: 'worker-messaging',
    icon: 'px:spool',
    title: 'Обмін повідомленнями з воркером',
    description: 'Два потоки, дві черги: structured clone і transfer',
    scenarios: [
      steps('postmessage', 'postMessage і structured clone', 'дані копіюються, зміна оригіналу не доходить до воркера, функція → DataCloneError'),
      steps('transfer', 'Копія проти передачі', 'ArrayBuffer на 8 МБ: клон копіює байти, transfer віддає власність за O(1) і робить буфер detached'),
    ],
  },
  {
    id: 'xss',
    icon: 'px:syringe',
    title: 'DOM XSS',
    description: 'Від source до sink: як рядок з URL стає кодом',
    scenarios: [steps('dom-sink', 'innerHTML як sink', '<img onerror> з ?q= виконує код; textContent, санітизація і Trusted Types це зупиняють')],
  },
  {
    id: 'tc39-stages',
    icon: 'px:temple',
    title: 'Стадії TC39',
    description: 'Шлях пропозиції від ідеї до щорічного стандарту ECMAScript',
    scenarios: [steps('pipeline', 'Від Stage 0 до ES2020', 'optional chaining ?. проходить стадії 0 → 4 і потрапляє в ECMAScript 2020')],
  },
]

const byId = new Map(VIZ_CATALOG.map((v) => [v.id, v]))

export function vizInfo(id: string): VizInfo | undefined {
  return byId.get(id)
}

export function vizScenario(info: VizInfo, scenario: string | null): VizScenarioInfo {
  return info.scenarios.find((s) => s.id === scenario) ?? info.scenarios[0]!
}
