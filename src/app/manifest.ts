import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Interview Prep — тренажер мегамозку',
    short_name: 'Prep',
    description: 'Статті, візуалізації, щоденні місії, стрічка фішок і повторення FSRS',
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
