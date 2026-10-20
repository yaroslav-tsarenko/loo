import { ogCard, OG_SIZE } from '../og-card'

export const alt = 'Блог Loo'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function BlogIndexOgImage() {
  return ogCard({ eyebrow: 'Блог Loo', title: 'Пояснюємо складне простими словами', subtitle: 'Англійська, JavaScript, SQL, System Design, німецька' })
}
