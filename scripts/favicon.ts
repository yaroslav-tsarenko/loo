// Writes src/app/favicon.ico from Loo's pixels (src/ui/design/brand/favicon.ts). Run after changing the logo mark.
import { writeFileSync } from 'node:fs'
import { faviconIco } from '../src/ui/design/brand/favicon'

writeFileSync(new URL('../src/app/favicon.ico', import.meta.url), faviconIco())
console.log('src/app/favicon.ico updated')
