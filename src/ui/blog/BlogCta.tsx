import { blogCategory } from '@/blog/categories'
import { Button } from '@/ui/design/Button'
import { LooSays } from '@/ui/design/mascot/LooSays'

// The conversion block under posts and lists: what Loo is, one button.
export function BlogCta({ category }: { category: string | null }) {
  const course = category ? blogCategory(category)?.course : null
  const title = course ? `Закріпи на практиці: курс «${course}» у Loo` : 'Вчися в Loo — як у грі'
  return (
    <aside className="blog-cta lu-card" data-variant="raised" data-pad="lg">
      <LooSays mood="cheer" size={120} side="top" text="Погнали?" />
      <div className="blog-cta-text">
        <h2>{title}</h2>
        <p>Короткі уроки по 5 хвилин, вправи з миттєвою перевіркою, серії, ліги й боси. Безкоштовно.</p>
        <Button href="/signup" size="lg">
          Почати безкоштовно
        </Button>
      </div>
    </aside>
  )
}
