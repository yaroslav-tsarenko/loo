// Roadmap tracks: each is a "zero → Pro" path built from one or more guides.
// The global engineer map orders tracks by stage. Tracks without guides yet show as «скоро».

export type TrackStage = 'foundations' | 'frontend' | 'backend' | 'data' | 'platform' | 'ai' | 'mobile'

export interface Track {
  id: string
  // icon ref for <Icon name>: brand mark of the technology where one exists
  icon: string
  title: string
  tagline: string
  stage: TrackStage
  // Guides in learning order; the first is the core course, later ones extend it (e.g. interview bank).
  guides: string[]
  // Other tracks worth finishing first.
  after: string[]
}

export const STAGES: Record<TrackStage, { icon: string; title: string }> = {
  foundations: { icon: 'px:bricks', title: 'Фундамент' },
  frontend: { icon: 'tb:TbPalette', title: 'Frontend' },
  backend: { icon: 'px:gear', title: 'Backend' },
  data: { icon: 'px:database', title: 'Дані' },
  platform: { icon: 'tb:TbCloud', title: 'Платформа і DevOps' },
  ai: { icon: 'tb:TbBrain', title: 'AI-інженерія' },
  mobile: { icon: 'px:phone', title: 'Mobile' },
}

export const TRACKS: readonly Track[] = [
  { id: 'javascript', icon: 'si:SiJavascript', title: 'JavaScript', tagline: 'Від нуля до Pro: мова, рушій, браузер, співбесіди', stage: 'foundations', guides: ['js-start', 'javascript', 'js-katas', 'js-projects', 'js-interview'], after: [] },
  { id: 'typescript', icon: 'si:SiTypescript', title: 'TypeScript', tagline: 'Типи, дженерики, архітектура на типах', stage: 'foundations', guides: ['typescript'], after: ['javascript'] },
  { id: 'cs', icon: 'tb:TbBinaryTree', title: 'Алгоритми й CS', tagline: 'Структури даних, складність, задачі з лайвкодингу', stage: 'foundations', guides: ['algorithms'], after: ['javascript'] },
  { id: 'react', icon: 'si:SiReact', title: 'React', tagline: 'Компоненти, стан, рендеринг, хуки', stage: 'frontend', guides: ['react'], after: ['javascript'] },
  { id: 'nextjs', icon: 'si:SiNextdotjs', title: 'Next.js', tagline: 'App Router, Server Components, кешування', stage: 'frontend', guides: ['nextjs'], after: ['react'] },
  { id: 'nodejs', icon: 'si:SiNodedotjs', title: 'Node.js', tagline: 'Рантайм, стріми, HTTP, продакшн', stage: 'backend', guides: ['nodejs'], after: ['javascript'] },
  { id: 'postgresql', icon: 'si:SiPostgresql', title: 'PostgreSQL', tagline: 'SQL, індекси, транзакції, тюнінг', stage: 'data', guides: ['postgresql'], after: [] },
  { id: 'docker', icon: 'si:SiDocker', title: 'Docker', tagline: 'Образи, контейнери, compose, продакшн', stage: 'platform', guides: ['docker'], after: ['nodejs'] },
  { id: 'system-design', icon: 'tb:TbSitemap', title: 'System Design', tagline: 'Масштабування, кеші, черги, співбесіди', stage: 'platform', guides: ['system-design'], after: ['nodejs', 'postgresql'] },
  { id: 'ai', icon: 'tb:TbBrain', title: 'AI для інженерів', tagline: 'LLM, промпти, RAG, агенти, евали', stage: 'ai', guides: ['ai'], after: ['javascript'] },
  { id: 'android', icon: 'si:SiAndroid', title: 'Android + Kotlin', tagline: 'Kotlin, Compose, архітектура', stage: 'mobile', guides: ['kotlin', 'android'], after: [] },
]
