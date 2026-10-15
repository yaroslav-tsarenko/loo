// Roadmap tracks: each is a "zero → Pro" path built from one or more guides.
// The global engineer map orders tracks by stage. Tracks without guides yet show as «скоро».

export type TrackStage = 'foundations' | 'frontend' | 'backend' | 'data' | 'platform' | 'ai' | 'mobile'

export interface Track {
  id: string
  emoji: string
  title: string
  tagline: string
  stage: TrackStage
  // Guides in learning order; the first is the core course, later ones extend it (e.g. interview bank).
  guides: string[]
  // Other tracks worth finishing first.
  after: string[]
}

export const STAGES: Record<TrackStage, { emoji: string; title: string }> = {
  foundations: { emoji: '🧱', title: 'Фундамент' },
  frontend: { emoji: '🎨', title: 'Frontend' },
  backend: { emoji: '⚙️', title: 'Backend' },
  data: { emoji: '🗄️', title: 'Дані' },
  platform: { emoji: '🚢', title: 'Платформа і DevOps' },
  ai: { emoji: '🤖', title: 'AI-інженерія' },
  mobile: { emoji: '📱', title: 'Mobile' },
}

export const TRACKS: readonly Track[] = [
  { id: 'javascript', emoji: '🟨', title: 'JavaScript', tagline: 'Від нуля до Pro: мова, рушій, браузер, співбесіди', stage: 'foundations', guides: ['js-start', 'javascript', 'js-katas', 'js-projects', 'js-interview'], after: [] },
  { id: 'typescript', emoji: '🔷', title: 'TypeScript', tagline: 'Типи, дженерики, архітектура на типах', stage: 'foundations', guides: ['typescript'], after: ['javascript'] },
  { id: 'cs', emoji: '🧮', title: 'Алгоритми й CS', tagline: 'Структури даних, складність, задачі з лайвкодингу', stage: 'foundations', guides: ['algorithms'], after: ['javascript'] },
  { id: 'react', emoji: '⚛️', title: 'React', tagline: 'Компоненти, стан, рендеринг, хуки', stage: 'frontend', guides: ['react'], after: ['javascript'] },
  { id: 'nextjs', emoji: '▲', title: 'Next.js', tagline: 'App Router, Server Components, кешування', stage: 'frontend', guides: ['nextjs'], after: ['react'] },
  { id: 'nodejs', emoji: '🟩', title: 'Node.js', tagline: 'Рантайм, стріми, HTTP, продакшн', stage: 'backend', guides: ['nodejs'], after: ['javascript'] },
  { id: 'postgresql', emoji: '🐘', title: 'PostgreSQL', tagline: 'SQL, індекси, транзакції, тюнінг', stage: 'data', guides: ['postgresql'], after: [] },
  { id: 'docker', emoji: '🐳', title: 'Docker', tagline: 'Образи, контейнери, compose, продакшн', stage: 'platform', guides: ['docker'], after: ['nodejs'] },
  { id: 'system-design', emoji: '🏗️', title: 'System Design', tagline: 'Масштабування, кеші, черги, співбесіди', stage: 'platform', guides: ['system-design'], after: ['nodejs', 'postgresql'] },
  { id: 'ai', emoji: '🤖', title: 'AI для інженерів', tagline: 'LLM, промпти, RAG, агенти, евали', stage: 'ai', guides: ['ai'], after: ['javascript'] },
  { id: 'android', emoji: '🤖', title: 'Android + Kotlin', tagline: 'Kotlin, Compose, архітектура', stage: 'mobile', guides: ['kotlin', 'android'], after: [] },
]

export function trackFor(guideId: string): Track | undefined {
  return TRACKS.find((t) => t.guides.includes(guideId))
}
