// Pure icon-ref check (mirrors src/ui/icons/ref.ts without pulling React icon sets into the domain).
// `si:SiJavascript` · `pi:PiFireFill` · `tb:TbBrain` · `lucide:Flame` · `px:flagUk` · `emoji:🔥` · bare emoji

export const ICON_LIBRARY_SETS = ['si', 'pi', 'tb', 'lucide', 'px'] as const
export type IconLibrarySet = (typeof ICON_LIBRARY_SETS)[number]

export type CourseIconRef = { set: 'emoji'; name: string } | { set: IconLibrarySet; name: string }

// Known library icon names per set; the CLI reads them from src/ui/icons/sets/*.tsx
export type IconCatalog = Partial<Record<IconLibrarySet, ReadonlySet<string>>>

const NAME = /^[A-Z][A-Za-z0-9]*$/
const PX_NAME = /^[a-z][A-Za-z0-9]*$/
const PICTO = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u

export function parseCourseIcon(raw: string | null | undefined): CourseIconRef | null {
  const value = raw?.trim()
  if (!value) return null
  const colon = value.indexOf(':')
  if (colon > 0) {
    const set = value.slice(0, colon)
    const name = value.slice(colon + 1).trim()
    if (set === 'emoji') return name && PICTO.test(name) ? { set: 'emoji', name } : null
    if ((ICON_LIBRARY_SETS as readonly string[]).includes(set)) return (set === 'px' ? PX_NAME : NAME).test(name) ? { set: set as IconLibrarySet, name } : null
  }
  return PICTO.test(value) && [...value].length <= 8 ? { set: 'emoji', name: value } : null
}

// Syntax always; names only when the catalog for that set is known.
export function iconExists(raw: string, catalog?: IconCatalog): boolean {
  const ref = parseCourseIcon(raw)
  if (!ref) return false
  if (ref.set === 'emoji') return true
  const names = catalog?.[ref.set]
  return names ? names.has(ref.name) : true
}

// Extracts keys of `export const SI = { SiReact, SiVue: {...}, … }` from an icon set source file.
export function iconNamesFromSource(source: string, exportName: string): Set<string> {
  const start = source.indexOf(`export const ${exportName} = {`)
  const names = new Set<string>()
  if (start < 0) return names
  const body = source.slice(start).split('\n').slice(1)
  for (const line of body) {
    if (/^\}/.test(line)) break
    const m = /^\s{2}([A-Za-z][A-Za-z0-9]*)\s*[,:]/.exec(line)
    if (m) names.add(m[1]!)
  }
  return names
}
