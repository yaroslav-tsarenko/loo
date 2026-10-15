# COURSE_FORMAT — як створити курс для Levelup

Курс — це папка (пакет), яку можна писати в Obsidian, валідувати однією командою і завантажити в Levelup ZIP-архівом.
Платформа сама будує з неї шлях у стилі Duolingo: розділи → теми → уроки → тести тем → екзамени розділів.

Формат блоків усередині markdown (картки, тести, задачі, візуалізації) — у [CONTENT_SPEC.md](../CONTENT_SPEC.md).
Педагогіка і анатомія теми — у [LEARNING_PLAYBOOK.md](./LEARNING_PLAYBOOK.md).

## 1. Структура пакета

```text
my-course/
├── course.yaml              # маніфест (обовʼязково)
├── cover.png                # обкладинка 1200×630 (необовʼязково)
├── README.md                # опис для сторінки курсу (необовʼязково)
├── <Посібник A>/            # «посібник» = папка тем, як у vault
│   ├── _guide.md            # індекс посібника (frontmatter: title, slug, parts…)
│   ├── <A> - 01. Тема.md    # тема (topic)
│   └── …
├── <Посібник B>/…
└── assets/                  # зображення (png, jpg, webp, svg, gif) для ![[…]]
```

Одна тема = один `.md`-файл. Порядок тем — номер у назві (`NN.`) або `order` у frontmatter.

## 2. `course.yaml`

```yaml
id: javascript-noob-to-god          # [a-z0-9-], унікальний у маркетплейсі, не змінюється
version: 1.0.0                      # semver; нова версія не губить прогрес (звʼязок по id вправ)
title: JavaScript from Noob to God
subtitle: Від першого console.log до архітектури, V8 і співбесід
subject: programming                # programming | language | security | science | other
language: uk                        # мова викладання (BCP 47)
icon: si:SiJavascript               # див. §6
color: '#F7DF1E'
cover: cover.png
levels: [noob, junior, middle, senior, god]
tags: [javascript, frontend, interview]
estimatedHours: 120
authors: [{ name: Yaroslav Tsarenko }]
license: proprietary                # або CC-BY-4.0 тощо

sections:                           # етапи шляху, у порядку проходження
  - id: start
    title: Старт з нуля
    icon: '🌱'
    from: JavaScript Start          # папка посібника
  - id: core
    title: Ядро мови
    icon: '🧱'
    from: JavaScript
    chapters: 1-7                   # необовʼязково: діапазон тем посібника
  - id: interview
    title: Співбесіда
    icon: '🎤'
    from: JS Interview Q&A
    kind: practice                  # path (за замовчуванням) | practice — банк вправ без уроків-теорії

exams:
  topic:   { questions: 10, pass: 0.8 }                  # тест у кінці кожної теми
  section: { questions: 25, pass: 0.8, testOut: true }   # екзамен розділу; testOut = можна «перескочити»
placement: { enabled: true, maxQuestions: 20 }            # вступний тест
```

## 3. Тема (topic)

Frontmatter:

```yaml
---
title: Замикання
id: jsd-ch-05                 # стабільний id теми (обовʼязково для курсів у маркетплейсі)
level: middle                 # noob | junior | middle | senior | god (старі junior/middle/senior/techlead теж ок)
icon: '🎒'                    # або si:/pi:/lucide: іконка
tags: [functions, scope]
prerequisites: ["[[JavaScript - 04. Scope, hoisting і TDZ]]"]
estimatedMinutes: 35
---
```

Тіло — стаття (відображається як «📖 Теорія») з блоками-вправами всередині. Рекомендована анатомія — LEARNING_PLAYBOOK §2.

## 4. Вправи

| Блок | Тип вправи | Мінімум для теми |
|---|---|---|
| `[!quiz]` single / multi / output / order / fill | тест | 6 |
| `[!question]-` | картка (FSRS) | 6 |
| `[!interview]` | картка-співбесіда | — |
| `[!task]` з `js starter` + `js tests` | задача з автотестами | 2 (для programming) |
| `[!reel]` | мікрофакт для уроків і стрічки | 3 |
| `[!viz]`, `[!figure]` | ілюстрації | 1 |

Кожна вправа — **явний `id`**, унікальний у межах курсу: `<префікс>-NN-<тип>-NN`. Рівень — `level:` у meta-рядку або з заголовка `## 🟢 Junior`.
Курси мов (`subject: language`) додатково отримають типи `translate`, `listen`, `speak`, `match` (заплановано; формат буде в цьому ж документі).

## 5. Як платформа будує шлях

1. Розділ (`sections[]`) → теми у порядку.
2. Тема → уроки: `📖 теорія → 🤔 старт (пре-тест) → 🔬 розбори (по 3 тести + картки + факт) → 🧠 закріплення → 🛠️ задачі по одній → 🎤 співбесіда`.
3. Кінець теми → **тест теми** (`exams.topic.questions` вправ з пулу теми, перемішано).
4. Кінець розділу → **екзамен розділу** (вправи з усіх тем; при `testOut` його можна скласти будь-коли, щоб відкрити наступний розділ).
5. Рівень учня фільтрує вправи: нижче рівня — скорочено, вище — позначка 🔥 «челендж».

## 6. Іконки

`emoji:🔥` або просто `'🔥'` · `si:SiJavascript` (Simple Icons, бренди й технології) · `pi:PiFireFill` (Phosphor) · `lucide:Flame`.
Список дозволених іконок — `src/ui/icons/registry.ts` (неіснуюча іконка = помилка валідації).

## 7. Валідація

```bash
pnpm course:check path/to/my-course
```

Перевіряє: схему `course.yaml`, існування посібників і діапазонів, унікальність id, биті wiki-links, формат кожної вправи, наявність правильних відповідей, що **еталонні рішення задач проходять тести, а заготовки — ні** (у пісочниці з таймаутом), ліміти розмірів, іконки, мінімуми з §4 (попередження).

## 8. Завантаження в Levelup (курси користувачів)

1. ZIP пакета ≤ 25 МБ, ≤ 2000 файлів, лише `.md .yaml .yml .json .png .jpg .jpeg .webp .gif .svg`.
2. Сервер розпаковує в памʼяті (захист від zip-bomb і path traversal), прогоняє ту саму валідацію; код тестів виконується **тільки** в ізольованій пісочниці без мережі.
3. Markdown санітизується: сирий HTML, `javascript:`-посилання, iframe, скрипти — відкидаються; SVG — очищаються.
4. Статуси: `draft → review → published`. Нова версія публікується поверх, прогрес учнів зберігається за `id` вправ.

## 9. Чекліст автора

- [ ] `course.yaml` валідний, `id` остаточний
- [ ] Кожна тема має `id`, `level`, `icon`, 🎯-результати і «📚 Джерела»
- [ ] ≥ 6 тестів, ≥ 6 карток, ≥ 3 фішки на тему; задачі з тестами
- [ ] `pnpm course:check` → ✅
