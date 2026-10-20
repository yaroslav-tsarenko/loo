import { ogCard, OG_SIZE } from './og-card'

export const alt = 'Loo — навчання як гра'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpengraphImage() {
  return ogCard({
    eyebrow: 'Навчання як гра',
    title: 'Вчися щодня по 5 хвилин — і рости від Новобранця до Легенди',
    subtitle: 'Англійська, JavaScript і не тільки: уроки, серії, ліги й боси',
  })
}
