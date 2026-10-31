import { readFile, writeFile } from 'node:fs/promises'
import { checkTranslation, segmentDocument, sourceSlugs, stampLock } from '../src/content/i18n/check'
import { findJobs, parseArgs, readLock } from './lib/i18n'

// Usage: pnpm i18n:stamp <guide|topic|file> --lang en [--force]
// After a translation is reviewed: writes `_i18n/<lang>/<file>.lock.json` = { sourceId, segments: { id: sha1 } } —
// the source hashes of the segments the translation covers, so i18n:check can tell when the source moves on.
// Refuses while i18n:check has structure / code errors (--force stamps anyway).

const args = parseArgs(process.argv.slice(2))
if (!args.target || !args.lang) {
  console.error('Usage: pnpm i18n:stamp <guide|topic|file> --lang <lang> [--force]')
  process.exit(1)
}
const { jobs } = await findJobs(args)
if (jobs.length === 0) {
  console.error(`Перекладів для «${args.target}» (${args.lang}) не знайдено`)
  process.exit(1)
}
let failed = 0
for (const job of jobs) {
  const [source, translated, previous] = await Promise.all([readFile(job.absolute.source, 'utf8'), readFile(job.absolute.translation, 'utf8'), readLock(job.absolute.lock)])
  const errors = checkTranslation({ source, translated, lock: previous, glossary: null }).findings.filter((f) => f.severity === 'error')
  if (errors.length > 0 && !args.force) {
    failed++
    console.error(`⛔ ${job.translationPath}: ${errors.length} помилок i18n:check — спершу виправ (або --force)`)
    continue
  }
  const src = segmentDocument(source)
  const lock = stampLock(src, segmentDocument(translated, { headingSlugs: sourceSlugs(src) }))
  await writeFile(job.absolute.lock, `${JSON.stringify(lock, null, 2)}\n`)
  console.log(`✅ ${job.lockPath}: ${Object.keys(lock.segments).length} з ${src.segments.length} сегментів`)
}
process.exit(failed > 0 ? 1 : 0)
