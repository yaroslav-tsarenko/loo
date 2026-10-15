'use client'

import { PiMonitorFill, PiMoonFill, PiSpeakerHighFill, PiSpeakerSlashFill, PiSunFill } from 'react-icons/pi'
import { useState } from 'react'
import { updateSetting } from '@/server/actions/settings'
import type { ThemeSetting } from '@/server/settings'
import { useFeedback } from '@/ui/feedback/FeedbackProvider'
import { applyTheme } from './theme'

const NEXT: Record<ThemeSetting, ThemeSetting> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<ThemeSetting, string> = { system: 'Тема: як у системі', light: 'Тема: світла', dark: 'Тема: темна' }

export function ThemeToggle({ initial }: { initial: ThemeSetting }) {
  const [theme, setTheme] = useState<ThemeSetting>(initial)
  const Icon = theme === 'light' ? PiSunFill : theme === 'dark' ? PiMoonFill : PiMonitorFill
  return (
    <button
      type="button"
      className="sb-icon-button theme-toggle"
      aria-label={`${LABEL[theme]}. Змінити`}
      title={LABEL[theme]}
      onClick={() => {
        const next = NEXT[theme]
        setTheme(next)
        applyTheme(next)
        void updateSetting('theme', next)
      }}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  )
}

export function SoundToggle() {
  const { sound, toggleSound } = useFeedback()
  const Icon = sound ? PiSpeakerHighFill : PiSpeakerSlashFill
  return (
    <button type="button" className="sb-icon-button" aria-pressed={sound} aria-label={sound ? 'Вимкнути звук' : 'Увімкнути звук'} title={sound ? 'Звук увімкнено' : 'Звук вимкнено'} onClick={toggleSound}>
      <Icon size={20} aria-hidden="true" />
    </button>
  )
}
