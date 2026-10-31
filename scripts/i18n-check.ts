import { readFile } from 'node:fs/promises'
import { checkTranslation, type Finding } from '../src/content/i18n/check'
import { findJobs, parseArgs, readGlossary, readLock } from './lib/i18n'

// Usage: pnpm i18n:check [guide|topic|file] [--lang en]
// Checks every translation (`<Guide>/_i18n/<lang>/*.md`) against its source topic: untranslated and stale segments,
// segments not stamped yet, structure (headings, block ids and order), code outside comments / test titles /
// (in theory examples) string literals and JSX text, glossary (content/glossary/uk-<lang>.yaml).
// Exit 1 on structure or code errors; the rest are warnings (docs/COURSE_FORMAT.md «Переклад курсів (i18n)»).

const SOURCE_LANG = process.env.I18N_SOURCE_LANG ?? 'uk'
const args = parseArgs(process.argv.slice(2))
const { jobs, vault, issues } = await findJobs(args)
for (const issue of issues) console.log(`⚠️  ${issue}`)
if (jobs.length === 0) {
  console.log(args.target ? `Перекладів для «${args.target}»${args.lang ? ` (${args.lang})` : ''} не знайдено` : 'Перекладів немає')
  process.exit(0)
}

const ICON: Record<Finding['kind'], string> = { structure: '⛔', code: '⛔', untranslated: '🈳', stale: '♻️', unstamped: '📝', glossary: '📖' }
let errors = 0
let warnings = 0
for (const job of jobs) {
  const [source, translated, lock, glossary] = await Promise.all([readFile(job.absolute.source, 'utf8'), readFile(job.absolute.translation, 'utf8'), readLock(job.absolute.lock), readGlossary(vault, SOURCE_LANG, job.lang)])
  const result = checkTranslation({ source, translated, lock, glossary })
  const e = result.findings.filter((f) => f.severity === 'error').length
  const w = result.findings.length - e
  errors += e
  warnings += w
  const counts = Object.entries(Object.groupBy(result.findings, (f) => f.kind)).map(([k, list]) => `${k} ${list!.length}`)
  console.log(`\n# ${job.translationPath} (${job.lang} ← ${job.chapter.id})`)
  console.log(`  сегментів ${result.segments} · перекладено ${result.translated}${counts.length ? ` · ${counts.join(' · ')}` : ''}`)
  for (const f of result.findings) console.log(`  ${ICON[f.kind]} [${f.severity}] ${f.kind}${f.segment ? ` · ${f.segment}` : ''} · ${f.message}`)
}
console.log(errors > 0 ? `\n⛔ Помилок: ${errors}, попереджень: ${warnings}` : warnings > 0 ? `\n✅ Помилок немає · попереджень: ${warnings}` : '\n✅ Усе гаразд')
process.exit(errors > 0 ? 1 : 0)
