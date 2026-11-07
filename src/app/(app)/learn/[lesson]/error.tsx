'use client'

import { ErrorScreen } from '@/ui/errors/ErrorScreen'

export default function LessonError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} title="Урок не завантажився" text="Відповіді, які ти вже дав, збережені. Спробуй ще раз або повернись на карту." back={{ href: '/path', label: 'До карти' }} />
}
