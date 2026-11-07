'use client'

import { ErrorScreen } from '@/ui/errors/ErrorScreen'

export default function TestError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorScreen {...props} title="Тест не завантажився" text="Збережені відповіді нікуди не зникли — спроба продовжиться з того ж місця." back={{ href: '/path', label: 'До карти' }} />
}
