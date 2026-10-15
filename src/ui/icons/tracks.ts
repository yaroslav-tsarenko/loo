import type { IconName } from './Icon'

// Library icons for course tracks and guides, so tech names never show up as Apple emoji.
const TRACK_ICONS: Record<string, IconName> = {
  javascript: 'si:SiJavascript',
  typescript: 'si:SiTypescript',
  cs: 'tb:TbBinaryTree',
  react: 'si:SiReact',
  nextjs: 'si:SiNextdotjs',
  nodejs: 'si:SiNodedotjs',
  postgresql: 'si:SiPostgresql',
  docker: 'si:SiDocker',
  'system-design': 'tb:TbSitemap',
  ai: 'tb:TbBrain',
  android: 'si:SiAndroid',
  kotlin: 'si:SiKotlin',
  algorithms: 'tb:TbBinaryTree',
}

const GUIDE_PREFIX: Array<[RegExp, IconName]> = [
  [/^(js|javascript)/, 'si:SiJavascript'],
  [/^(ts|typescript)/, 'si:SiTypescript'],
  [/^react/, 'si:SiReact'],
  [/^next/, 'si:SiNextdotjs'],
  [/^node/, 'si:SiNodedotjs'],
  [/^(postgres|sql)/, 'si:SiPostgresql'],
  [/^docker/, 'si:SiDocker'],
  [/^kotlin/, 'si:SiKotlin'],
  [/^android/, 'si:SiAndroid'],
  [/^(algo|cs)/, 'tb:TbBinaryTree'],
  [/^system/, 'tb:TbSitemap'],
  [/^ai/, 'tb:TbBrain'],
]

/** Icon ref for a track id; falls back to the track's emoji. */
export function trackIcon(id: string, emoji: string): IconName | string {
  return TRACK_ICONS[id] ?? `emoji:${emoji}`
}

/** Icon ref for a guide id (by known prefixes), else a book. */
export function guideIcon(id: string): IconName {
  const lower = id.toLowerCase()
  return TRACK_ICONS[lower] ?? GUIDE_PREFIX.find(([re]) => re.test(lower))?.[1] ?? 'pi:PiBookOpenTextFill'
}
