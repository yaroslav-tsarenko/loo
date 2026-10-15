import { describe, expect, it } from 'vitest'
import { hasIcon, ICON_NAMES } from '@/ui/icons/catalog'
import { brandFill, formatIconRef, parseIconRef } from '@/ui/icons/ref'

describe('parseIconRef', () => {
  it('parses library refs', () => {
    expect(parseIconRef('si:SiJavascript')).toEqual({ set: 'si', name: 'SiJavascript' })
    expect(parseIconRef(' pi:PiFireFill ')).toEqual({ set: 'pi', name: 'PiFireFill' })
    expect(parseIconRef('lucide:Flame')).toEqual({ set: 'lucide', name: 'Flame' })
  })

  it('parses emoji with or without prefix', () => {
    expect(parseIconRef('emoji:🔥')).toEqual({ set: 'emoji', name: '🔥' })
    expect(parseIconRef('🦊')).toEqual({ set: 'emoji', name: '🦊' })
    expect(parseIconRef('🇺🇦')).toEqual({ set: 'emoji', name: '🇺🇦' })
  })

  it('rejects junk', () => {
    expect(parseIconRef('')).toBeNull()
    expect(parseIconRef(undefined)).toBeNull()
    expect(parseIconRef('fa:FaBeer')).toBeNull()
    expect(parseIconRef('si:<script>')).toBeNull()
    expect(parseIconRef('emoji:abc')).toBeNull()
    expect(parseIconRef('hello')).toBeNull()
  })

  it('round-trips', () => {
    expect(formatIconRef(parseIconRef('tb:TbBrain')!)).toBe('tb:TbBrain')
  })
})

describe('catalog', () => {
  it('knows curated icons only', () => {
    expect(hasIcon('si:SiReact')).toBe(true)
    expect(hasIcon('si:SiNotARealBrand')).toBe(false)
    expect(hasIcon('🔥')).toBe(true)
    expect(ICON_NAMES.si.length).toBeGreaterThan(50)
  })
})

describe('brandFill', () => {
  it('keeps colorful brands and maps near-black ones to currentColor', () => {
    expect(brandFill('#F7DF1E')).toBe('#F7DF1E')
    expect(brandFill('61dafb')).toBe('#61DAFB')
    expect(brandFill('#000000')).toBe('currentColor')
    expect(brandFill('#181717')).toBe('currentColor')
    expect(brandFill('nope')).toBe('currentColor')
  })
})
