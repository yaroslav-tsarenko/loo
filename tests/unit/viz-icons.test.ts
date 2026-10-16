import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { VIZ_CATALOG } from '@/content/blocks/viz/catalog'
import { PIXEL_ICONS } from '@/ui/design/PixelIcon'
import { parseIconRef } from '@/ui/icons/ref'
import { PI } from '@/ui/icons/sets/pi'

// Visualizations draw their props with pixel icons and library glyphs, never with emoji.
const ROOTS = ['src/ui/viz', 'src/content/blocks/viz', 'src/ui/theater', 'src/app/viz']
const PICTO = /\p{Extended_Pictographic}|\p{Regional_Indicator}|️/u

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? files(path) : /\.(ts|tsx)$/.test(name) ? [path] : []
  })
}

describe('viz icons', () => {
  it('catalog icons are known pixel or Phosphor refs', () => {
    for (const viz of VIZ_CATALOG) {
      const ref = parseIconRef(viz.icon)
      expect(ref, viz.id).not.toBeNull()
      if (ref!.set === 'px') expect(PIXEL_ICONS, viz.id).toContain(ref!.name)
      else expect(ref!.set === 'pi' && ref!.name in PI, `${viz.id}: ${viz.icon}`).toBe(true)
    }
  })

  it('no emoji in scenes, scenarios and the catalog', () => {
    const offenders: string[] = []
    for (const file of ROOTS.flatMap(files)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (!PICTO.test(line)) return
          // unicode-string presets: emoji there are the lesson data ('👍🏽'.length)
          if (file.endsWith('unicode-string/analyze.ts') && /^\s*\{ id: '/.test(line)) return
          offenders.push(`${file}:${i + 1}`)
        })
    }
    expect(offenders).toEqual([])
  })
})
