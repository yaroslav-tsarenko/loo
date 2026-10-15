import { defaultVaultConfig } from '../src/content/config'
import { slugifySegment } from '../src/content/ids'
import { loadSnapshot } from '../src/content/store'

const guideArg = process.argv[2]
const snapshot = await loadSnapshot(defaultVaultConfig(), new Map(), 1)
const guides = guideArg ? snapshot.guides.filter((g) => g.id === guideArg || g.dir === guideArg) : snapshot.guides
if (guides.length === 0) {
  console.error(`Посібник «${guideArg}» не знайдено. Доступні: ${snapshot.guides.map((g) => g.id).join(', ')}`)
  process.exit(1)
}
for (const guide of guides) {
  const prefix = slugifySegment(guide.id).split('-')[0] ?? guide.id
  let printed = false
  guide.chapterIds.forEach((chapterId, index) => {
    const units = (snapshot.unitsByChapter.get(chapterId) ?? []).filter((u) => u.idSource === 'hash')
    if (units.length === 0) return
    const chapter = snapshot.chapters.get(chapterId)!
    const nn = String(chapter.number ?? index + 1).padStart(2, '0')
    if (!printed) {
      console.log(`\n# ${guide.title}`)
      printed = true
    }
    console.log(`\n## ${chapter.path}`)
    units.forEach((u, i) => {
      const n = String(i + 1).padStart(3, '0')
      const id = u.kind === 'flashcard' ? `${prefix}-${nn}-${n}` : `${prefix}-${nn}-${u.kind}-${String(i + 1).padStart(2, '0')}`
      const text = u.kind === 'flashcard' ? u.questionText : u.kind === 'quiz' ? u.promptText : u.titleText
      const how = u.kind === 'flashcard' && u.origin === 'heading' ? `%% id: ${id} %%` : u.kind === 'flashcard' ? `\`${id}\`` : `id: ${id}`
      console.log(`- ${text.slice(0, 90)}\n    ${how}`)
    })
  })
}
