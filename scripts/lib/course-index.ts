import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { courseIndex, parseBundles } from '../../src/server/courses/bundles'

// content/courses/index.json: the catalog the server reads instead of every bundle (src/server/courses/registry.ts).
// Rebuilt from the bundles on disk after every course:build, so it always lists exactly what ships.
export const INDEX_FILE = 'index.json'

export async function courseIndexText(dir: string): Promise<string> {
  const names = (await readdir(dir)).filter((n) => n.endsWith('.json') && n !== INDEX_FILE)
  const files = await Promise.all(names.map(async (name) => ({ name, text: await readFile(path.join(dir, name), 'utf8') })))
  const { courses, errors } = parseBundles(files, 'official')
  if (errors.length > 0) throw new Error(`course index: ${errors.join('; ')}`)
  return `${JSON.stringify(courseIndex(courses.values()))}\n`
}

export async function writeCourseIndex(dir: string): Promise<number> {
  const text = await courseIndexText(dir)
  await writeFile(path.join(dir, INDEX_FILE), text)
  return text.length
}
