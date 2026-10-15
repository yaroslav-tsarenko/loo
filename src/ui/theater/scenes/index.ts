import type { AnyScene } from '../types'

type SceneModule = Record<string, AnyScene>

// One chunk per scene family; a scenario is a named export inside it.
export const SCENE_LOADERS: Record<string, () => Promise<SceneModule>> = {
  'devtools-console': () => import('./devtools-console').then((m) => m.scenes),
  'devtools-network': () => import('./devtools-network').then((m) => m.scenes),
  'devtools-performance': () => import('./devtools-performance').then((m) => m.scenes),
  'devtools-memory': () => import('./devtools-memory').then((m) => m.scenes),
  'code-editor-run': () => import('./code-editor-run').then((m) => m.scenes),
  'browser-render': () => import('./browser-render').then((m) => m.scenes),
  'event-bubbling': () => import('./event-bubbling').then((m) => m.scenes),
}

export async function loadScene(id: string, scenario: string): Promise<AnyScene> {
  const load = SCENE_LOADERS[id]
  if (!load) throw new Error(`Unknown scene ${id}`)
  const all = await load()
  const scene = all[scenario] ?? Object.values(all)[0]
  if (!scene) throw new Error(`Scene ${id} has no scenarios`)
  return scene
}
