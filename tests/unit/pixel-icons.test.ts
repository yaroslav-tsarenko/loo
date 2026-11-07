import { describe, expect, it } from 'vitest'
import { PIXEL_ICONS } from '@/ui/design/pixel-icons/names'
import { PIXEL_ART, pixelLayers, pixelSprite } from '@/ui/design/pixel-sprite'

// The browser knows the icons by name only (names.ts); the art is drawn on the server into /pixel-icons.svg.
describe('pixel icon sprite', () => {
  it('names.ts lists exactly the drawn icons', () => {
    expect([...PIXEL_ICONS].sort()).toEqual(Object.keys(PIXEL_ART).sort())
  })

  it('has one symbol per icon, every one with paths', () => {
    const sprite = pixelSprite()
    for (const name of PIXEL_ICONS) {
      expect(sprite, name).toContain(`<symbol id="${name}" viewBox="0 0 16 16">`)
      expect(pixelLayers(name).length, name).toBeGreaterThan(0)
    }
    expect(sprite.match(/<symbol /g)?.length).toBe(PIXEL_ICONS.length)
    // ids are used in a URL fragment and an XML attribute
    for (const name of PIXEL_ICONS) expect(name).toMatch(/^[A-Za-z][\w-]*$/)
  })
})
