// Catalog of [!figure] scenes: realistic, scripted tool walkthroughs (DevTools,
// editor, browser). Pure data shared by the parser, the UI and CONTENT_SPEC.md.

export type FigureDevice = 'desktop' | 'phone' | 'auto'

export interface FigureScenarioInfo {
  id: string
  title: string
  description: string
}

export interface FigureInfo {
  id: string
  // icon ref for <Icon> (pixel set / library glyph)
  icon: string
  title: string
  description: string
  // poster url shown in the browser bar before the scene loads
  url: string
  device: FigureDevice
  // first scenario is the default
  scenarios: readonly FigureScenarioInfo[]
}

const sc = (id: string, title: string, description: string): FigureScenarioInfo => ({ id, title, description })

export const FIGURE_CATALOG: readonly FigureInfo[] = [
  {
    id: 'devtools-console',
    icon: 'px:monitor',
    title: 'DevTools · Console',
    description: 'Код вводиться рядок за рядком, вивід і помилки — як у Chrome',
    url: 'https://playground.dev/',
    device: 'auto',
    scenarios: [
      sc('typeof-quirks', 'Дивацтва typeof', 'typeof null, NaN, масиви і функції — і червона TypeError'),
      sc('promise-order', 'Порядок промісів', 'синхронний код, мікрозадачі й таймер — у якому порядку друкує консоль'),
      sc('this-lost', 'Втрачений this', 'метод у змінній губить this → TypeError, bind рятує'),
      sc('object-inspect', 'Інспекція об’єкта', 'console.table і розгортання об’єкта до [[Prototype]]'),
      sc('hello-console', 'Перша програма', 'console.log, опечатка з ReferenceError, 2 + 2 і рядок-шаблон зі змінною'),
    ],
  },
  {
    id: 'devtools-network',
    icon: 'px:globe',
    title: 'DevTools · Network',
    description: 'Запити, статуси, водоспад таймінгів і заголовки',
    url: 'https://app.example/orders',
    device: 'auto',
    scenarios: [
      sc('cors-preflight', 'CORS preflight', 'POST з JSON спершу породжує OPTIONS, а відповідь несе Access-Control-*'),
      sc('cache-revalidate', '304 Not Modified', 'перезавантаження з ETag: сервер відповідає 304 без тіла'),
    ],
  },
  {
    id: 'devtools-performance',
    icon: 'px:clock',
    title: 'DevTools · Performance',
    description: 'Flame chart: long task, layout thrashing і виправлена версія',
    url: 'https://app.example/feed',
    device: 'auto',
    scenarios: [sc('layout-thrashing', 'Layout thrashing', 'читання offsetHeight у циклі змушує браузер рахувати layout щоразу')],
  },
  {
    id: 'devtools-memory',
    icon: 'pi:PiBrainFill',
    title: 'DevTools · Memory',
    description: 'Heap snapshot, дерево retainers і знайдений detached DOM',
    url: 'https://app.example/modal',
    device: 'auto',
    scenarios: [sc('detached-dom', 'Detached DOM', 'знімок купи знаходить відірваний від сторінки вузол, який тримає слухач')],
  },
  {
    id: 'code-editor-run',
    icon: 'px:code',
    title: 'Редактор і тести',
    description: 'TDD-цикл: тест червоний → код → тест зелений',
    url: 'https://code.example/kata/capitalize',
    device: 'auto',
    scenarios: [sc('tdd', 'Червоний → зелений', 'пишемо capitalize, поки всі тести не позеленіють')],
  },
  {
    id: 'browser-render',
    icon: 'px:image',
    title: 'Як браузер малює сторінку',
    description: 'HTML → DOM, CSS → CSSOM, render tree, layout, paint, composite',
    url: 'https://coffee.example/',
    device: 'auto',
    scenarios: [sc('pipeline', 'Критичний шлях рендерингу', 'від байтів HTML до пікселів на екрані')],
  },
  {
    id: 'event-bubbling',
    icon: 'px:bubbles',
    title: 'Спливання подій',
    description: 'Клік по кнопці: capture вниз, bubble вгору, делегування на батькові',
    url: 'https://todo.example/',
    device: 'auto',
    scenarios: [sc('delegation', 'Делегування', 'один слухач на списку ловить кліки всіх кнопок, навіть нових')],
  },
]

const byId = new Map(FIGURE_CATALOG.map((f) => [f.id, f]))

export function figureInfo(id: string): FigureInfo | undefined {
  return byId.get(id)
}

export function figureScenario(info: FigureInfo, scenario: string | null): FigureScenarioInfo {
  return info.scenarios.find((s) => s.id === scenario) ?? info.scenarios[0]!
}
