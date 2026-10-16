'use client'

import dynamic from 'next/dynamic'

// Heavy, rarely shown markdown blocks — [!diagram] (its spec parser pulls zod + yaml), [!viz] (every visualisation
// engine) and [!figure] scenes — load their code only when a page actually renders one. Imported straight into the
// server renderer they were part of every page that renders markdown (study sessions, lessons, articles): ~200 KB
// of gzipped JS on pages that show none of them. Still server-rendered (ssr), so the HTML and the layout are the same.
export const LazyDiagram = dynamic(() => import('@/ui/diagram/Diagram').then((m) => m.Diagram))
export const LazyVizBlock = dynamic(() => import('@/ui/viz/VizBlock').then((m) => m.VizBlock))
export const LazyFigureBlock = dynamic(() => import('@/ui/theater/FigureBlock').then((m) => m.FigureBlock))
