import type { LeagueTier } from '@/game'

// League tier look: shield color + emoji (names live in i18n: game.leagues.tiers.*).
export const TIER_LOOK: Record<LeagueTier, { emoji: string; color: string; ink: string }> = {
  bronze: { emoji: '🥉', color: '#CD7F32', ink: '#8A4F1C' },
  silver: { emoji: '🥈', color: '#A8B2BD', ink: '#5E6873' },
  gold: { emoji: '🥇', color: '#FFC800', ink: '#B38800' },
  sapphire: { emoji: '💠', color: '#1CB0F6', ink: '#0B6FA0' },
  ruby: { emoji: '♦️', color: '#FF4B4B', ink: '#B32626' },
  emerald: { emoji: '💚', color: '#58CC02', ink: '#3A8A00' },
  amethyst: { emoji: '🔮', color: '#A560E8', ink: '#6B2FB0' },
  pearl: { emoji: '🦪', color: '#E9DCCB', ink: '#8C7A63' },
  obsidian: { emoji: '🌑', color: '#3D3D52', ink: '#1E1E2A' },
  diamond: { emoji: '💎', color: '#7FDBFF', ink: '#1E8FB8' },
}
