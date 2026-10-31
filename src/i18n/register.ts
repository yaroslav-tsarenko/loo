import { en } from './en'
import { registerDictionary } from './index'

// Registers the non-default dictionaries on the server (src/server/locale.ts imports this). The browser gets a
// dictionary only through <LocaleProvider dict> — see src/i18n/index.ts.
registerDictionary('en', en)

export { en }
