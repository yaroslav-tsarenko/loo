import type { ReactNode } from 'react'
import { cx } from '../cx'
import { BELLY, BODY, COLORS as C, EAR_L, EAR_L_INNER, EAR_L_TIP, EAR_R, EAR_R_INNER, EAR_R_TIP, flame, FLAMES, HEAD, MASK, NOSE, sparkle, TAIL, TAIL_TIP } from './paths'

export type LooMood = 'idle' | 'happy' | 'cheer' | 'sad' | 'thinking' | 'sleeping' | 'wave' | 'fire'
export const LOO_MOODS: readonly LooMood[] = ['idle', 'happy', 'cheer', 'sad', 'thinking', 'sleeping', 'wave', 'fire']

export type LooHat = 'beanie' | 'cap' | 'crown' | 'party' | 'grad'
export type LooGlasses = 'round' | 'shades' | 'nerd'

/** Cosmetics for the future shop. Every field is optional; colors are any CSS color. */
export interface LooSkin {
  hat?: LooHat
  glasses?: LooGlasses
  hoodie?: string
  scarf?: string
}

export const LOO_LABEL: Record<LooMood, string> = {
  idle: 'Лис Loo',
  happy: 'Loo радіє',
  cheer: 'Loo святкує',
  sad: 'Loo сумує',
  thinking: 'Loo думає',
  sleeping: 'Loo спить',
  wave: 'Loo вітається',
  fire: 'Loo палає — серія!',
}

type Eyes = 'open' | 'happy' | 'closed' | 'look' | 'sad'
type Mouth = 'smile' | 'open' | 'frown' | 'hmm' | 'o'
type Brows = 'sad' | 'fierce' | 'raised'
type Arms = 'rest' | 'up' | 'wave' | 'chin'
type Extra = 'zzz' | 'think' | 'tear' | 'sparkle' | 'flame' | 'wave'

interface Pose {
  eyes: Eyes
  mouth: Mouth
  brows?: Brows
  arms: Arms
  blush?: boolean
  extra?: Extra
}

const POSES: Record<LooMood, Pose> = {
  idle: { eyes: 'open', mouth: 'smile', arms: 'rest' },
  happy: { eyes: 'happy', mouth: 'open', arms: 'rest', blush: true },
  cheer: { eyes: 'happy', mouth: 'open', arms: 'up', blush: true, extra: 'sparkle' },
  sad: { eyes: 'sad', mouth: 'frown', brows: 'sad', arms: 'rest', extra: 'tear' },
  thinking: { eyes: 'look', mouth: 'hmm', brows: 'raised', arms: 'chin', extra: 'think' },
  sleeping: { eyes: 'closed', mouth: 'o', arms: 'rest', blush: true, extra: 'zzz' },
  wave: { eyes: 'open', mouth: 'smile', arms: 'wave', blush: true, extra: 'wave' },
  fire: { eyes: 'open', mouth: 'open', brows: 'fierce', arms: 'up', extra: 'flame' },
}

const STROKE = { stroke: C.ink, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const

function Eye({ x, y, ry = 10.5 }: { x: number; y: number; ry?: number }) {
  return (
    <>
      <ellipse cx={x} cy={y} rx={8.5} ry={ry} fill={C.ink} />
      <circle cx={x + 3.5} cy={y - 4.5} r={3.2} fill="#fff" />
      <circle cx={x - 2.5} cy={y + 4.5} r={1.5} fill="#fff" opacity={0.8} />
    </>
  )
}

function EyesArt({ eyes }: { eyes: Eyes }) {
  switch (eyes) {
    case 'open':
      return (
        <>
          <Eye x={78} y={86} />
          <Eye x={122} y={86} />
        </>
      )
    case 'look':
      return (
        <>
          <Eye x={80} y={84} />
          <Eye x={124} y={84} />
        </>
      )
    case 'sad':
      return (
        <>
          <Eye x={78} y={88} ry={9.5} />
          <Eye x={122} y={88} ry={9.5} />
        </>
      )
    case 'happy':
      return <path d="M69 90Q78 77 87 90M113 90Q122 77 131 90" {...STROKE} strokeWidth={5} />
    case 'closed':
      return <path d="M69 87Q78 94 87 87M113 87Q122 94 131 87" {...STROKE} strokeWidth={4.5} />
  }
}

const BROWS: Record<Brows, string> = {
  sad: 'M67 72Q76 71 86 66M133 72Q124 71 114 66',
  fierce: 'M66 65Q76 66 87 73M134 65Q124 66 113 73',
  raised: 'M68 70Q77 67 86 70M114 64Q124 58 134 63',
}

function MouthArt({ mouth }: { mouth: Mouth }) {
  switch (mouth) {
    case 'smile':
      return <path d="M89 111Q94.5 117 100 111Q105.5 117 111 111" {...STROKE} strokeWidth={3.5} />
    case 'open':
      return (
        <>
          <path d="M87 111Q100 113 113 111Q112 128 100 128Q88 128 87 111Z" fill={C.mouth} />
          <path d="M93 122Q100 116 107 122Q105 127 100 127Q95 127 93 122Z" fill={C.tongue} />
        </>
      )
    case 'frown':
      return <path d="M91 121Q100 112 109 121" {...STROKE} strokeWidth={3.5} />
    case 'hmm':
      return <path d="M93 118Q101 115 108 119" {...STROKE} strokeWidth={3.5} />
    case 'o':
      return <ellipse cx={100} cy={117} rx={3.6} ry={3.2} fill={C.mouth} />
  }
}

function Hat({ hat }: { hat: LooHat }) {
  switch (hat) {
    case 'beanie':
      return (
        <g className="loo-hat">
          <path d="M62 56C60 24 140 24 138 56Z" fill="#1CB0F6" />
          <rect x={58} y={47} width={84} height={14} rx={7} fill="#1592CF" />
          <circle cx={100} cy={24} r={10} fill="#F1F7FB" />
        </g>
      )
    case 'cap':
      return (
        <g className="loo-hat">
          <path d="M64 54C64 24 136 24 136 54Z" fill="#FF4B4B" />
          <path d="M126 50C146 46 164 50 170 57C154 60 138 58 124 56Z" fill="#E02F2F" />
          <circle cx={100} cy={27} r={4} fill="#E02F2F" />
        </g>
      )
    case 'crown':
      return (
        <g className="loo-hat">
          <path d="M66 50L70 18L86 34L100 12L114 34L130 18L134 50Z" fill="#FFC800" />
          <path d="M66 43H134V52H66Z" fill="#F2A900" />
          <circle cx={84} cy={47.5} r={3} fill="#1CB0F6" />
          <circle cx={100} cy={47.5} r={3.5} fill="#FF4B4B" />
          <circle cx={116} cy={47.5} r={3} fill="#58CC02" />
        </g>
      )
    case 'party':
      return (
        <g className="loo-hat">
          <path d="M100 2L126 48H74Z" fill="#CE82FF" />
          <path d="M89 22H111L115 30H85Z" fill="#FFC800" />
          <path d="M81 38H119L123 46H77Z" fill="#FF86D0" />
          <circle cx={100} cy={4} r={6} fill="#FFC800" />
        </g>
      )
    case 'grad':
      return (
        <g className="loo-hat">
          <path d="M72 38V54C88 60 112 60 128 54V38Z" fill="#2B2B3A" />
          <path d="M100 20L150 34L100 48L50 34Z" fill="#3D3D52" />
          <path d="M100 34L140 42V60" stroke="#FFC800" strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={100} cy={34} r={3} fill="#FFC800" />
          <circle cx={140} cy={62} r={4} fill="#FFC800" />
        </g>
      )
  }
}

function Glasses({ glasses }: { glasses: LooGlasses }) {
  const arms = <path d="M62 84L48 80M138 84L152 80" {...STROKE} strokeWidth={3.5} />
  switch (glasses) {
    case 'round':
      return (
        <g className="loo-glasses">
          {arms}
          <circle cx={78} cy={87} r={15} fill="#fff" fillOpacity={0.18} stroke={C.ink} strokeWidth={3.5} />
          <circle cx={122} cy={87} r={15} fill="#fff" fillOpacity={0.18} stroke={C.ink} strokeWidth={3.5} />
          <path d="M93 85Q100 80 107 85" {...STROKE} strokeWidth={3.5} />
        </g>
      )
    case 'shades':
      return (
        <g className="loo-glasses">
          {arms}
          <path d="M60 78H96V86C96 96 88 101 78 101C68 101 60 96 60 86ZM104 78H140V86C140 96 132 101 122 101C112 101 104 96 104 86Z" fill="#1D1D25" />
          <path d="M96 81H104" stroke="#1D1D25" strokeWidth={4} />
          <path d="M66 83H76M110 83H120" stroke="#fff" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
        </g>
      )
    case 'nerd':
      return (
        <g className="loo-glasses">
          {arms}
          <rect x={61} y={74} width={34} height={26} rx={8} fill="#fff" fillOpacity={0.15} stroke={C.ink} strokeWidth={4.5} />
          <rect x={105} y={74} width={34} height={26} rx={8} fill="#fff" fillOpacity={0.15} stroke={C.ink} strokeWidth={4.5} />
          <path d="M95 85H105" {...STROKE} strokeWidth={4.5} />
        </g>
      )
  }
}

/** Ears + head + face. Exported for the logo mark. */
export function LooHead({ mood = 'idle', skin }: { mood?: LooMood; skin?: LooSkin }) {
  const pose = POSES[mood]
  return (
    <>
      <path d={EAR_L} fill={C.coat} />
      <path d={EAR_R} fill={C.coat} />
      <path d={EAR_L_INNER} fill={C.earInner} />
      <path d={EAR_R_INNER} fill={C.earInner} />
      <path d={EAR_L_TIP} fill={C.ink} />
      <path d={EAR_R_TIP} fill={C.ink} />
      <path d={HEAD} fill={C.coat} />
      <path d={MASK} fill={C.cream} />
      {pose.blush ? (
        <g fill={C.blush} opacity={0.6}>
          <ellipse cx={62} cy={110} rx={9} ry={5.5} />
          <ellipse cx={138} cy={110} rx={9} ry={5.5} />
        </g>
      ) : null}
      <g className="loo-eyes">
        <EyesArt eyes={pose.eyes} />
      </g>
      {pose.brows ? <path d={BROWS[pose.brows]} {...STROKE} strokeWidth={4} /> : null}
      <path d={NOSE} fill={C.ink} />
      <ellipse cx={97} cy={99} rx={2.4} ry={1.3} fill="#fff" opacity={0.55} />
      <MouthArt mouth={pose.mouth} />
      {pose.extra === 'tear' ? <path className="loo-tear" d="M70 98C70 98 65 105 65 108.5C65 111.5 67.3 113.5 70 113.5C72.7 113.5 75 111.5 75 108.5C75 105 70 98 70 98Z" fill="#6CCBFF" /> : null}
      {skin?.glasses ? <Glasses glasses={skin.glasses} /> : null}
      {skin?.hat ? <Hat hat={skin.hat} /> : null}
    </>
  )
}

function Arm({ d, color, className }: { d: string; color: string; className: string }) {
  return (
    <g className={className}>
      <path d={d} stroke={color} strokeWidth={15} strokeLinecap="round" fill="none" />
    </g>
  )
}

function Extras({ extra }: { extra: Extra }): ReactNode {
  switch (extra) {
    case 'zzz':
      return (
        <g className="loo-zzz" fill="#1CB0F6" fontWeight={900} fontFamily="var(--lu-font)">
          <text x={146} y={60} fontSize={16}>
            z
          </text>
          <text x={158} y={44} fontSize={21}>
            z
          </text>
          <text x={172} y={26} fontSize={26}>
            z
          </text>
        </g>
      )
    case 'think':
      return (
        <g className="loo-think">
          <circle cx={150} cy={62} r={4} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
          <circle cx={161} cy={47} r={6.5} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
          <circle cx={178} cy={25} r={14} fill="#fff" stroke={C.ink} strokeWidth={2.5} />
          <text x={178} y={32} textAnchor="middle" fontSize={20} fontWeight={900} fill="#1CB0F6" fontFamily="var(--lu-font)">
            ?
          </text>
        </g>
      )
    case 'sparkle':
      return (
        <g className="loo-sparks">
          <path d={sparkle(28, 72, 10)} fill="#FFC800" />
          <path d={sparkle(178, 78, 8)} fill="#1CB0F6" />
          <path d={sparkle(38, 32, 7)} fill="#FF86D0" />
          <path d={sparkle(166, 30, 9)} fill="#58CC02" />
        </g>
      )
    case 'wave':
      return <path className="loo-wave-marks" d="M176 84Q183 92 180 102M185 74Q196 88 191 104" stroke="#1CB0F6" strokeWidth={4} strokeLinecap="round" fill="none" />
    default:
      return null
  }
}

interface LooProps {
  mood?: LooMood
  size?: number
  skin?: LooSkin
  /** Turn off idle motion (static illustrations, lists). Reduced-motion users never get it. */
  animated?: boolean
  /** Hide from assistive tech when the surrounding text already says it. */
  decorative?: boolean
  label?: string
  className?: string
}

export function Loo({ mood = 'idle', size = 120, skin, animated = true, decorative, label, className }: LooProps) {
  const pose = POSES[mood]
  const coat = skin?.hoodie ?? C.coat
  const limb = skin?.hoodie ?? C.coatDark
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': label ?? LOO_LABEL[mood] }
  return (
    <svg className={cx('loo', className)} data-mood={mood} data-animated={animated ? '' : undefined} width={size} height={size} viewBox="0 0 200 200" {...a11y}>
      <ellipse className="loo-shadow" cx={100} cy={194} rx={46} ry={5} fill="currentColor" opacity={0.1} />
      <g className="loo-figure">
        {pose.extra === 'flame' ? (
          <g className="loo-flame">
            {FLAMES.map(([x, base, w, h]) => (
              <path key={`o${x}${base}`} d={flame(x, base, w, h)} fill="#FF5B1F" />
            ))}
            {FLAMES.map(([x, base, w, h]) => (
              <path key={`i${x}${base}`} d={flame(x, base, w * 0.58, h * 0.68)} fill="#FFC800" />
            ))}
          </g>
        ) : null}
        <g className="loo-tail">
          <path d={TAIL} fill={C.coat} />
          <path d={TAIL_TIP} fill={C.cream} />
        </g>
        <g className="loo-torso">
          <path d={BODY} fill={coat} />
          {skin?.hoodie ? (
            <>
              <path d="M76 160H124V176C124 182 120 186 114 186H86C80 186 76 182 76 176Z" fill="#000" opacity={0.12} />
              <path d="M58 126C72 142 128 142 142 126L150 136C132 154 68 154 50 136Z" fill={coat} />
              <path d="M58 126C72 142 128 142 142 126L150 136C132 154 68 154 50 136Z" fill="#000" opacity={0.15} />
              <path d="M91 142L89 158M109 142L111 158" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
            </>
          ) : (
            <path d={BELLY} fill={C.cream} />
          )}
          {skin?.scarf ? (
            <>
              <path d="M118 140L130 170L118 173L108 144Z" fill={skin.scarf} />
              <path d="M60 124C78 138 122 138 140 124L143 136C122 150 78 150 57 136Z" fill={skin.scarf} />
              <path d="M60 124C78 138 122 138 140 124L141 129C122 142 78 142 59 129Z" fill="#fff" opacity={0.25} />
            </>
          ) : null}
        </g>
        <g fill={C.coatDark}>
          <ellipse cx={80} cy={190} rx={14} ry={7} />
          <ellipse cx={120} cy={190} rx={14} ry={7} />
        </g>
        {pose.arms === 'rest' || pose.arms === 'chin' ? <Arm className="loo-arm-l" d="M66 148L61 164" color={limb} /> : null}
        {pose.arms === 'rest' ? <Arm className="loo-arm-r" d="M134 148L139 164" color={limb} /> : null}
        {pose.arms === 'up' ? (
          <>
            <Arm className="loo-arm-l" d="M66 144L40 112" color={limb} />
            <Arm className="loo-arm-r" d="M134 144L160 112" color={limb} />
          </>
        ) : null}
        {pose.arms === 'wave' ? (
          <>
            <Arm className="loo-arm-l" d="M66 148L61 164" color={limb} />
            <Arm className="loo-arm-r loo-wave" d="M134 146L162 104" color={limb} />
          </>
        ) : null}
        <g className="loo-head">
          <LooHead mood={mood} skin={skin} />
        </g>
        {pose.arms === 'chin' ? <Arm className="loo-arm-r" d="M136 152C134 142 124 136 114 131" color={limb} /> : null}
        {pose.extra ? <Extras extra={pose.extra} /> : null}
      </g>
    </svg>
  )
}
