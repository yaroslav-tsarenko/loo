import { COLORS as C, EAR_L, EAR_L_INNER, EAR_L_TIP, EAR_R, EAR_R_INNER, EAR_R_TIP, HEAD, MASK, NOSE } from '../mascot/paths'

// Loo's head as a standalone SVG string (idle face) — for next/og icons and anywhere React can't render.
export function logoMarkSvg(size = 132): string {
  const eye = (x: number) => `<ellipse cx="${x}" cy="86" rx="8.5" ry="10.5" fill="${C.ink}"/><circle cx="${x + 3.5}" cy="81.5" r="3.2" fill="#fff"/><circle cx="${x - 2.5}" cy="90.5" r="1.5" fill="#fff" opacity=".8"/>`
  const p = (d: string, fill: string) => `<path d="${d}" fill="${fill}"/>`
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="34 4 132 134">`,
    p(EAR_L, C.coat),
    p(EAR_R, C.coat),
    p(EAR_L_INNER, C.earInner),
    p(EAR_R_INNER, C.earInner),
    p(EAR_L_TIP, C.ink),
    p(EAR_R_TIP, C.ink),
    p(HEAD, C.coat),
    p(MASK, C.cream),
    eye(78),
    eye(122),
    p(NOSE, C.ink),
    `<path d="M89 111Q94.5 117 100 111Q105.5 117 111 111" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`,
    '</svg>',
  ].join('')
}

export function logoMarkDataUri(size?: number): string {
  return `data:image/svg+xml;base64,${btoa(logoMarkSvg(size))}`
}
