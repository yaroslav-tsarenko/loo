'use client'

import { useLayoutEffect } from 'react'

// <html> attributes that depend on the signed-in learner (theme, language). The root layout is static (it also serves
// the prerendered public pages), so they're set here: htmlAttrsBoot (./constants) as an inline script before first paint, and this
// component on client navigations (a boot script in an RSC payload doesn't run) and when the settings change.

type Theme = 'system' | 'light' | 'dark'

export function HtmlAttrs({ theme, lang }: { theme: Theme; lang: string }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.lang = lang
  }, [theme, lang])
  return null
}
