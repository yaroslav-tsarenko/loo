// Canonical public origin (metadata, sitemap, OG cards, JSON-LD). SITE_URL pins it per environment.
export const SITE_URL = (process.env.SITE_URL?.trim() || 'https://playloo.app').replace(/\/+$/, '')
export const SITE_NAME = 'Loo'
export const SITE_TAGLINE = 'Навчання як гра: англійська, JavaScript, SQL і не тільки — короткі уроки, серії, ліги й боси'
