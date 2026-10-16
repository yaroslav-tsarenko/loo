export const SIDEBAR_KEY = 'sidebar'

export const SIDEBAR_BOOT = `try{if(localStorage.getItem('${SIDEBAR_KEY}')==='closed')document.documentElement.dataset.sidebar='closed'}catch(e){}`

export const OPEN_PALETTE = 'palette:open'

// Shell stats ride along with nav badge counts (same /api/counts refresh); '@' keys never match a nav href.
export const STREAK_KEY = '@streak'
export const STREAK_TODAY_KEY = '@streak-today'
export const STREAK_FREEZES_KEY = '@freezes'
export const GEMS_KEY = '@gems'
export const HEARTS_KEY = '@hearts'
// epoch ms of the next heart refill (0 = full)
export const HEARTS_NEXT_KEY = '@hearts-next'
// epoch ms the ⚡ double-XP window ends (0 = off)
export const BOOST_KEY = '@boost'
export const RANK_KEY = '@rank'
