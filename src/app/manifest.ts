import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Levelup — навчання як гра',
    short_name: 'Levelup',
    description: 'Курси як гра: уроки, серії, стрічка фішок і повторення FSRS. З піксельним Loo 💡',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#191919',
    theme_color: '#191919',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
