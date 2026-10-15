// Loo's geometry on a 200×200 canvas. Shared by <Loo/> and the logo mark so the brand fox never drifts.

export const COLORS = {
  coat: '#FF8A1F',
  coatDark: '#E46C06',
  cream: '#FFF4E3',
  earInner: '#FFD3B8',
  ink: '#2B1B12',
  mouth: '#7A2414',
  tongue: '#FF7B8E',
  blush: '#FF8FA3',
} as const

export const HEAD = 'M100 34C137 34 162 56 162 88C162 101 157 112 148 120L159 129L136 128C125 133 113 135 100 135C87 135 75 133 64 128L41 129L52 120C43 112 38 101 38 88C38 56 63 34 100 34Z'
export const EAR_L = 'M60 60C53 46 48 30 50 15C51 10 55 9 59 12C71 22 82 32 91 43Z'
export const EAR_R = 'M140 60C147 46 152 30 150 15C149 10 145 9 141 12C129 22 118 32 109 43Z'
export const EAR_L_INNER = 'M64 53C60 43 57 33 57 23C66 30 74 37 81 45Z'
export const EAR_R_INNER = 'M136 53C140 43 143 33 143 23C134 30 126 37 119 45Z'
export const EAR_L_TIP = 'M50 15C51 10 55 9 59 12C63 15 67 19 71 22L52 30C50 25 49 20 50 15Z'
export const EAR_R_TIP = 'M150 15C149 10 145 9 141 12C137 15 133 19 129 22L148 30C150 25 151 20 150 15Z'
export const MASK = 'M100 93C112 93 122 98 134 100C146 102 153 108 151 116C141 127 122 134 100 134C78 134 59 127 49 116C47 108 54 102 66 100C78 98 88 93 100 93Z'
export const NOSE = 'M92 100C92 96 108 96 108 100C108 104 103 108 100 108C97 108 92 104 92 100Z'

export const BODY = 'M100 118C128 118 146 138 146 162C146 182 128 192 100 192C72 192 54 182 54 162C54 138 72 118 100 118Z'
export const BELLY = 'M100 142C115 142 125 153 125 167C125 180 114 188 100 188C86 188 75 180 75 167C75 153 85 142 100 142Z'
export const TAIL = 'M138 178C168 184 190 166 190 138C190 118 179 103 166 99C170 116 166 134 152 145C143 152 135 162 138 178Z'
export const TAIL_TIP = 'M166 99C179 103 190 118 190 138C183 130 175 124 168 122C170 114 169 106 166 99Z'

// Flame tongues behind Loo in the `fire` mood: [centerX, baseY, width, height].
export const FLAMES: readonly (readonly [number, number, number, number])[] = [
  [100, 112, 96, 108],
  [50, 150, 56, 108],
  [150, 150, 56, 108],
  [26, 174, 40, 84],
  [174, 174, 40, 84],
]

export function flame(cx: number, base: number, w: number, h: number): string {
  const l = cx - w / 2
  const r = cx + w / 2
  const round = base + w * 0.42
  return `M${l} ${base}C${l} ${base - h * 0.5} ${cx - w * 0.12} ${base - h * 0.62} ${cx} ${base - h}C${cx + w * 0.12} ${base - h * 0.62} ${r} ${base - h * 0.5} ${r} ${base}C${r} ${round} ${l} ${round} ${l} ${base}Z`
}

export function sparkle(cx: number, cy: number, r: number): string {
  const k = r * 0.28
  return `M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`
}
