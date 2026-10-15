export const SIDEBAR_KEY = 'sidebar'

export const SIDEBAR_BOOT = `try{if(localStorage.getItem('${SIDEBAR_KEY}')==='closed')document.documentElement.dataset.sidebar='closed'}catch(e){}`

export const OPEN_PALETTE = 'palette:open'
