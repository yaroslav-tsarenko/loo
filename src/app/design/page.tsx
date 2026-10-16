import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { PiArrowRightBold, PiCheckBold, PiGearSixFill, PiHeartFill, PiLightningFill, PiPlayFill, PiSpeakerHighFill, PiStarFill, PiXBold } from 'react-icons/pi'
import { Avatar } from '@/ui/design/Avatar'
import { Badge, Pill } from '@/ui/design/Badge'
import { Button, IconButton } from '@/ui/design/Button'
import { Card } from '@/ui/design/Card'
import { EmptyState } from '@/ui/design/EmptyState'
import { GameIcon, type GameIconName } from '@/ui/design/GameIcon'
import { ProgressBar } from '@/ui/design/ProgressBar'
import { Ring } from '@/ui/design/Ring'
import { StatChip } from '@/ui/design/StatChip'
import { Logo, LogoMark, Wordmark } from '@/ui/design/brand/Logo'
import { TONES } from '@/ui/design/cx'
import { LOO_EYES, LOO_EYES_LABEL, LOO_LABEL, LOO_MOODS, Loo, LooPixels, type LooBulb, type LooSkin } from '@/ui/design/mascot/Loo'
import { LOO_GRID, LOO_TIMELINES, MARK_BOX, poseRects, timelineTicks, type LooMood } from '@/ui/design/mascot/pixels'
import { LooSays } from '@/ui/design/mascot/LooSays'
import { ICON_NAMES } from '@/ui/icons/catalog'
import { Icon } from '@/ui/icons/Icon'
import { ConfettiDemo, LoadingDemo, OverlayDemo, ProgressDemo, StatsDemo, TabsToggleDemo } from './demos'

export const metadata: Metadata = { title: 'Дизайн-система' }

const PALETTE = ['green', 'blue', 'red', 'yellow', 'orange', 'purple', 'pink'] as const
const NAMES: Record<(typeof PALETTE)[number], string> = { green: 'Feather green', blue: 'Sky blue', red: 'Cardinal red', yellow: 'Bee yellow', orange: 'Flame orange', purple: 'Beetle purple', pink: 'Bubblegum pink' }
const NEUTRALS = ['bg', 'bg-sunk', 'surface', 'surface-2', 'surface-3', 'border', 'border-strong', 'text', 'text-2', 'text-3'] as const
const GAME_ICONS: GameIconName[] = ['fire', 'gem', 'heart', 'bolt', 'crown', 'chest']
const SKINS: { label: string; skin: LooSkin }[] = [
  { label: 'beanie', skin: { hat: 'beanie' } },
  { label: 'cap + shades', skin: { hat: 'cap', glasses: 'shades' } },
  { label: 'crown', skin: { hat: 'crown' } },
  { label: 'party + round', skin: { hat: 'party', glasses: 'round' } },
  { label: 'grad + nerd', skin: { hat: 'grad', glasses: 'nerd' } },
  { label: 'hoodie', skin: { hoodie: '#1CB0F6' } },
  { label: 'hoodie + beanie', skin: { hoodie: '#CE82FF', hat: 'beanie' } },
  { label: 'scarf', skin: { scarf: '#FF4B4B' } },
  { label: 'scarf + crown + shades', skin: { scarf: '#FFC800', hat: 'crown', glasses: 'shades' } },
]
const LOO_SIZES = [16, 24, 32, 48, 64, 96, 120, 160, 240]
const LOO_BULBS: LooBulb[] = ['off', 'on', 'flicker']
const LOO_TOKENS = ['loo', 'loo-lip', 'loo-ink', 'loo-spring', 'loo-bulb', 'loo-bulb-on', 'loo-glow', 'loo-cheek'] as const
const MARK_SIZES = [16, 32, 48, 64]

// Every frame of a mood laid out flat, with its hold in ticks — the timeline at a glance.
function LooFilmstrip({ mood }: { mood: LooMood }) {
  const t = LOO_TIMELINES[mood]
  return (
    <div className="ds-loo-strip">
      <code>{mood}</code>
      {t.frames.map((f, i) => (
        <figure key={i} className="ds-loo-cell">
          <svg width={60} height={60} viewBox={`0 0 ${LOO_GRID} ${LOO_GRID}`} shapeRendering="crispEdges" className="loo" aria-hidden="true">
            <LooPixels px={poseRects(f.pose)} />
          </svg>
          <figcaption className="ds-muted">
            {i === 0 ? 'key · ' : ''}×{f.hold}
          </figcaption>
        </figure>
      ))}
      <span className="ds-muted">
        {timelineTicks(t)} × {t.tick} мс = {(timelineTicks(t) * t.tick) / 1000} с
      </span>
    </div>
  )
}

function Section({ id, title, lead, children }: { id: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="ds-section">
      <h2 className="ds-h2">{title}</h2>
      {lead ? <p className="ds-muted">{lead}</p> : null}
      {children}
    </section>
  )
}

function Sample() {
  return (
    <div className="ds-stack">
      <div className="ds-row">
        <LogoMark size={40} />
        <StatChip kind="streak" value={12} size="sm" />
        <StatChip kind="gems" value={340} size="sm" />
        <StatChip kind="hearts" value={5} size="sm" />
      </div>
      <Card variant="raised">
        <LooSays mood="happy" size={72} text="Готовий до уроку?" />
      </Card>
      <ProgressBar value={0.6} label="Приклад" />
      <div className="ds-row">
        <Button size="sm">Почати</Button>
        <Button size="sm" variant="ghost">
          Пізніше
        </Button>
      </div>
    </div>
  )
}

// Dev-only gallery of the Levelup design system. Does not touch the vault or DB.
export default function DesignShowcasePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div className="page ds" data-width="wide">
      <header className="ds-hero">
        <Loo mood="wave" size={132} />
        <div>
          <Logo size={44} />
          <h1 className="ds-h1">Дизайн-система</h1>
          <p className="ds-muted">
            Токени <code>--lu-*</code> (src/app/tokens.css), компоненти <code>src/ui/design</code>, маскот Loo, реєстр іконок <code>src/ui/icons</code>. Лише dev-режим.
          </p>
        </div>
      </header>
      <nav className="ds-toc" aria-label="Розділи">
        {['brand', 'buttons', 'cards', 'progress', 'badges', 'stats', 'overlays', 'forms', 'people', 'loo', 'icons', 'themes'].map((id) => (
          <a key={id} href={`#${id}`} className="lu-pill" data-tone="gray" data-size="sm">
            {id}
          </a>
        ))}
      </nav>

      <Section id="brand" title="Бренд і токени">
        <div className="ds-row">
          <Logo size={56} />
          <Logo size={34} />
          <LogoMark size={64} />
          <Wordmark height={40} />
        </div>
        <div className="ds-swatches">
          {PALETTE.map((c) => (
            <div key={c} className="ds-swatch">
              <span className="ds-chip" style={{ background: `var(--lu-${c})`, boxShadow: `0 4px 0 var(--lu-${c}-lip)` }} />
              <strong>{NAMES[c]}</strong>
              <code>--lu-{c}</code>
              <span className="ds-row ds-tight">
                <span className="ds-dot" style={{ background: `var(--lu-${c}-lip)` }} title="lip" />
                <span className="ds-dot" style={{ background: `var(--lu-${c}-soft)` }} title="soft" />
                <span className="ds-dot" style={{ background: `var(--lu-${c}-ink)` }} title="ink" />
              </span>
            </div>
          ))}
        </div>
        <div className="ds-swatches ds-swatches-sm">
          {NEUTRALS.map((n) => (
            <div key={n} className="ds-swatch">
              <span className="ds-chip" style={{ background: `var(--lu-${n})` }} />
              <code>--lu-{n}</code>
            </div>
          ))}
        </div>
        <div className="ds-type">
          <p style={{ fontSize: 'var(--lu-fs-3xl)', fontWeight: 900 }}>Вчися граючи · 36</p>
          <p style={{ fontSize: 'var(--lu-fs-2xl)', fontWeight: 900 }}>Замикання в JavaScript · 28</p>
          <p style={{ fontSize: 'var(--lu-fs-xl)', fontWeight: 800 }}>Урок 3 з 7 · 23</p>
          <p style={{ fontSize: 'var(--lu-fs-md)', fontWeight: 700 }}>Обери правильну відповідь · 17</p>
          <p style={{ fontSize: 'var(--lu-fs-sm)', fontWeight: 600 }}>Nunito для ігрового UI; статті лишаються в шрифті читача · 15</p>
        </div>
        <div className="ds-row">
          {(['xs', 'sm', '', 'lg', 'xl'] as const).map((r) => (
            <span key={r} className="ds-radius" style={{ borderRadius: `var(--lu-r${r ? `-${r}` : ''})` }}>
              r{r ? `-${r}` : ''}
            </span>
          ))}
        </div>
      </Section>

      <Section id="buttons" title="Кнопки" lead="3D-губа (lip) під кнопкою; при натисканні кнопка «сідає» на неї.">
        <div className="ds-row">
          <Button>Продовжити</Button>
          <Button variant="secondary">Почати</Button>
          <Button variant="danger">Здатися</Button>
          <Button variant="super" icon={<GameIcon name="crown" size={22} />}>
            Super
          </Button>
          <Button variant="ghost">Пропустити</Button>
        </div>
        <div className="ds-row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg" iconEnd={<PiArrowRightBold size={20} />}>
            Large
          </Button>
          <LoadingDemo />
          <Button disabled>Перевірити</Button>
          <Button href="/design#buttons" variant="secondary" icon={<PiPlayFill size={18} />}>
            Посилання
          </Button>
        </div>
        <div className="ds-narrow">
          <Button block size="lg">
            На всю ширину
          </Button>
        </div>
        <div className="ds-row">
          <IconButton label="Закрити" icon={<PiXBold size={22} />} />
          <IconButton label="Налаштування" icon={<PiGearSixFill size={22} />} variant="ghost" />
          <IconButton label="Озвучити" icon={<PiSpeakerHighFill size={24} />} variant="secondary" size="lg" />
          <IconButton label="Готово" icon={<PiCheckBold size={22} />} variant="primary" round />
          <IconButton label="Улюблене" icon={<PiHeartFill size={22} />} variant="danger" round />
          <IconButton label="Супер" icon={<PiStarFill size={22} />} variant="super" round />
        </div>
      </Section>

      <Section id="cards" title="Картки">
        <div className="ds-grid">
          <Card>
            <strong>Flat</strong>
            <p className="ds-muted">Рамка 2px, без губи.</p>
          </Card>
          <Card variant="raised">
            <strong>Raised</strong>
            <p className="ds-muted">З 3D-губою.</p>
          </Card>
          <Card href="/design#cards">
            <strong>Interactive</strong>
            <p className="ds-muted">Натисни — сідає.</p>
          </Card>
          <Card variant="interactive" selected>
            <strong>Selected</strong>
            <p className="ds-muted">Стан вибору відповіді.</p>
          </Card>
          <Card variant="raised" tone="green">
            <strong>Tone green</strong>
            <p className="ds-muted">Правильно!</p>
          </Card>
          <Card variant="raised" tone="red">
            <strong>Tone red</strong>
            <p className="ds-muted">Помилка.</p>
          </Card>
        </div>
      </Section>

      <Section id="progress" title="Прогрес">
        <div className="ds-stack">
          {TONES.filter((t) => t !== 'gray').map((t, i) => (
            <ProgressBar key={t} value={0.15 + i * 0.12} tone={t} label={`Прогрес ${t}`} size={i % 3 === 0 ? 'sm' : i % 3 === 1 ? 'md' : 'lg'} />
          ))}
          <ProgressBar value={0.7} tone="purple" striped label="Подвійний XP" valueText="×2 XP · 12 хв" size="lg" />
          <ProgressDemo />
        </div>
      </Section>

      <Section id="badges" title="Бейджі та пігулки">
        <div className="ds-row">
          <Badge>3</Badge>
          <Badge tone="blue">NEW</Badge>
          <Badge tone="green">+15</Badge>
          <Badge tone="purple">99+</Badge>
          <Pill tone="green" icon={<PiCheckBold />}>
            Вивчено
          </Pill>
          <Pill tone="orange" icon={<GameIcon name="fire" size={18} />}>
            Челендж
          </Pill>
          <Pill tone="blue" icon={<Icon name="si:SiReact" size={16} />}>
            React
          </Pill>
          <Pill tone="purple" solid>
            Senior
          </Pill>
          <Pill tone="yellow" size="sm" icon={<PiLightningFill />}>
            +20 XP
          </Pill>
          <Pill tone="gray" size="sm">
            Junior
          </Pill>
        </div>
        <div className="ds-row">
          {GAME_ICONS.map((g) => (
            <span key={g} className="ds-icon-cell">
              <GameIcon name={g} size={40} />
              <code>{g}</code>
            </span>
          ))}
        </div>
      </Section>

      <Section id="stats" title="Стат-чіпи" lead="CountUp анімує зміну значення; сіра серія — сьогодні ще не зараховано.">
        <StatsDemo />
      </Section>

      <Section id="overlays" title="Sheet, Tooltip, Popover, Confetti" lead="Sheet — нижня шторка на телефоні, діалог на десктопі (нативний <dialog>).">
        <OverlayDemo />
        <ConfettiDemo />
      </Section>

      <Section id="forms" title="Вкладки та перемикачі">
        <TabsToggleDemo />
      </Section>

      <Section id="people" title="Аватари та порожні стани">
        <div className="ds-row">
          <Avatar name="Ярослав Царенко" size={56} ring="green" />
          <Avatar name="Олена" />
          <Avatar name="Max Payne" size={36} />
          <Avatar name="Loo Пружинка" tone="purple" ring="purple" />
        </div>
        <div className="ds-grid">
          <Card>
            <EmptyState title="Помилок немає" mood="cheer">
              Усі помилки виправлено. Так тримати!
            </EmptyState>
          </Card>
          <Card>
            <EmptyState title="Карток на сьогодні немає" action={<Button variant="secondary">Нові картки</Button>}>
              Loo відпочиває. Повертайся завтра.
            </EmptyState>
          </Card>
        </div>
      </Section>

      <Section
        id="loo"
        title="Loo 💡"
        lead={
          <>
            «Пружинка»: піксельний фіолетовий блок з антеною-пружинкою та лампочкою «еврика», сітка {LOO_GRID}×{LOO_GRID} клітинок (src/ui/design/mascot/pixels.ts). API: <code>{'<Loo mood="happy" eyes="wink" bulb="on" size={120} skin={{ hat: "crown" }} />'}</code>, <code>{'<LooSays mood eyes text />'}</code>. Кадрова анімація: усі кадри рендерить сервер, один CSS-годинник <code>steps()</code> перемикає їх; без руху (prefers-reduced-motion,{' '}
            <code>animated={'{false}'}</code>) видно ключовий кадр.
          </>
        }
      >
        <div className="ds-loo-grid">
          {LOO_MOODS.map((m) => (
            <figure key={m} className="ds-loo">
              <Loo mood={m} size={140} />
              <figcaption>
                <code>{m}</code>
                <span className="ds-muted">{LOO_LABEL[m]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <h3 className="ds-h3">Кадри</h3>
        <div className="ds-stack">
          {LOO_MOODS.map((m) => (
            <LooFilmstrip key={m} mood={m} />
          ))}
        </div>
        <h3 className="ds-h3">Очі × настрої</h3>
        <p className="ds-muted">
          Очі — окремий шар виразу: <code>eyes</code> поєднується з будь-яким настроєм. Ключові кадри, 48 px.
        </p>
        <div className="ds-loo-matrix" role="table" aria-label="Очі × настрої">
          <div role="row" className="ds-loo-matrix-row">
            <span role="columnheader" />
            {LOO_EYES.map((e) => (
              <code key={e} role="columnheader" title={LOO_EYES_LABEL[e]}>
                {e}
              </code>
            ))}
          </div>
          {LOO_MOODS.map((m) => (
            <div key={m} role="row" className="ds-loo-matrix-row">
              <code role="rowheader">{m}</code>
              {LOO_EYES.map((e) => (
                <span key={e} role="cell">
                  <Loo mood={m} eyes={e} size={48} animated={false} label={`${m} · ${e}`} />
                </span>
              ))}
            </div>
          ))}
        </div>
        <h3 className="ds-h3">Лампочка «еврика»</h3>
        <div className="ds-row">
          {LOO_BULBS.map((b) => (
            <figure key={b} className="ds-loo-cell">
              <Loo mood="idle" bulb={b} size={112} decorative />
              <figcaption>
                <code>bulb=&quot;{b}&quot;</code>
              </figcaption>
            </figure>
          ))}
          <figure className="ds-loo-cell">
            <Loo mood="eureka" size={112} decorative />
            <figcaption>
              <code>mood=&quot;eureka&quot;</code>
            </figcaption>
          </figure>
        </div>
        <div className="ds-swatches ds-swatches-sm">
          {LOO_TOKENS.map((n) => (
            <div key={n} className="ds-swatch">
              <span className="ds-chip" style={{ background: `var(--lu-${n})` }} />
              <code>--lu-{n}</code>
            </div>
          ))}
        </div>
        <h3 className="ds-h3">Скіни (для магазину)</h3>
        <div className="ds-loo-grid">
          {SKINS.map((s) => (
            <figure key={s.label} className="ds-loo">
              <Loo mood="idle" size={112} skin={s.skin} animated={false} />
              <figcaption>
                <code>{s.label}</code>
              </figcaption>
            </figure>
          ))}
        </div>
        <h3 className="ds-h3">Розміри 16 → 240 px</h3>
        <div className="ds-row ds-loo-sizes">
          {LOO_SIZES.map((s) => (
            <figure key={s} className="ds-loo-cell">
              <Loo mood="happy" size={s} decorative />
              <figcaption className="ds-muted">{s}</figcaption>
            </figure>
          ))}
        </div>
        <h3 className="ds-h3">Логотип-марка ({MARK_BOX[2]}×{MARK_BOX[3]} клітинок, чітка на кратних 16 px)</h3>
        <div className="ds-row ds-loo-sizes">
          {MARK_SIZES.map((s) => (
            <figure key={s} className="ds-loo-cell">
              <LogoMark size={s} />
              <figcaption className="ds-muted">{s}</figcaption>
            </figure>
          ))}
        </div>
        <h3 className="ds-h3">Репліки</h3>
        <div className="ds-stack">
          <LooSays mood="thinking" text="Хм… а що поверне typeof null?" />
          <LooSays mood="sad" text="Ой! Майже. Подивись пояснення 👇" />
          <LooSays mood="fire" text="7 днів поспіль! Серія палає 🔥" />
          <LooSays mood="eureka" text="Еврика! Тепер зрозуміло, чому замикання пам’ятає змінну." />
          <LooSays mood="dizzy" text="Три помилки поспіль… Перепочинь і глянь підказку." />
          <LooSays mood="idle" side="top" size={80} text="Бульбашка зверху для вузьких екранів." />
        </div>
      </Section>

      <Section id="icons" title="Іконки" lead={<>Рядок <code>set:Name</code> для YAML курсів: <code>si:SiJavascript</code>, <code>pi:PiFireFill</code>, <code>tb:TbBrain</code>, <code>lucide:Flame</code>, <code>emoji:🔥</code>. Лише куровані іконки потрапляють у бандл.</>}>
        <h3 className="ds-h3">Simple Icons — бренди ({ICON_NAMES.si.length})</h3>
        <div className="ds-icons">
          {ICON_NAMES.si.map((n) => (
            <span key={n} className="ds-icon-cell" title={`si:${n}`}>
              <Icon name={`si:${n}`} size={30} />
              <code>{n.slice(2)}</code>
            </span>
          ))}
        </div>
        <h3 className="ds-h3">Phosphor — UI ({ICON_NAMES.pi.length})</h3>
        <div className="ds-icons">
          {ICON_NAMES.pi.map((n, i) => (
            <span key={n} className="ds-icon-cell" title={`pi:${n}`}>
              <Icon name={`pi:${n}`} size={28} color={`var(--lu-${PALETTE[i % PALETTE.length]})`} />
              <code>{n.slice(2).replace(/(Fill|Bold)$/, '')}</code>
            </span>
          ))}
        </div>
        <h3 className="ds-h3">Tabler — предмети ({ICON_NAMES.tb.length})</h3>
        <div className="ds-icons">
          {ICON_NAMES.tb.map((n) => (
            <span key={n} className="ds-icon-cell" title={`tb:${n}`}>
              <Icon name={`tb:${n}`} size={28} />
              <code>{n.slice(2)}</code>
            </span>
          ))}
        </div>
        <h3 className="ds-h3">Lucide ({ICON_NAMES.lucide.length}) та emoji</h3>
        <div className="ds-icons">
          {ICON_NAMES.lucide.map((n) => (
            <span key={n} className="ds-icon-cell" title={`lucide:${n}`}>
              <Icon name={`lucide:${n}`} size={26} />
              <code>{n}</code>
            </span>
          ))}
          {['emoji:🔥', '🦊', '🧱', '🌱', '🎤', 'unknown:Nope'].map((n) => (
            <span key={n} className="ds-icon-cell" title={n}>
              <Icon name={n} size={28} />
              <code>{n}</code>
            </span>
          ))}
        </div>
      </Section>

      <Section id="themes" title="Світла і темна тема" lead="Ті самі компоненти з примусовою color-scheme — токени через light-dark().">
        <div className="ds-grid ds-grid-2">
          <div className="ds-theme lu-scheme-light">
            <Sample />
          </div>
          <div className="ds-theme lu-scheme-dark">
            <Sample />
          </div>
        </div>
        <div className="ds-row">
          <Ring value={0.75} label="Денна мета" size={88} stroke={9} tone="orange">
            <GameIcon name="fire" size={32} />
          </Ring>
          <Ring value={0.4} label="Тема" size={72} tone="purple">
            <Icon name="si:SiTypescript" size={28} />
          </Ring>
          <Ring value={1} label="Готово" size={56} stroke={6}>
            <PiCheckBold size={22} color="var(--lu-green)" />
          </Ring>
        </div>
      </Section>
    </div>
  )
}
