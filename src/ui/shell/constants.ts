export const SIDEBAR_KEY = 'sidebar'

export const SIDEBAR_BOOT = `try{if(localStorage.getItem('${SIDEBAR_KEY}')==='closed')document.documentElement.dataset.sidebar='closed'}catch(e){}`

export const OPEN_PALETTE = 'palette:open'

// Shell stats ride along with nav badge counts (same /api/counts refresh); '@' keys never match a nav href.
export const STREAK_KEY = '@streak'
export const STREAK_TODAY_KEY = '@streak-today'
