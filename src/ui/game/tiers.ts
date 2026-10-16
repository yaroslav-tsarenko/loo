import type { LeagueTier } from '@/game'
import type { PixelIconName } from '@/ui/design/PixelIcon'

// League tier look: pixel badge + accent colours (names live in i18n: game.leagues.tiers.*).
// Fixed hexes (same in both themes), tuned to the «Loo Pixel-soft» palette (tokens.css light values).
export const TIER_LOOK: Record<LeagueTier, { icon: PixelIconName; color: string; ink: string }> = {
  bronze: { icon: 'leagueBronze', color: '#F0A36B', ink: '#B8682F' },
  silver: { icon: 'leagueSilver', color: '#C9C4DC', ink: '#8F88AB' },
  gold: { icon: 'leagueGold', color: '#FFC23D', ink: '#DB9B12' },
  sapphire: { icon: 'leagueSapphire', color: '#3B9EFF', ink: '#2179D6' },
  ruby: { icon: 'leagueRuby', color: '#FF5A6E', ink: '#D93C52' },
  emerald: { icon: 'leagueEmerald', color: '#22B56C', ink: '#178A51' },
  amethyst: { icon: 'leagueAmethyst', color: '#7C4DFF', ink: '#5A30D6' },
  pearl: { icon: 'leaguePearl', color: '#EFE6F5', ink: '#A99BB8' },
  obsidian: { icon: 'leagueObsidian', color: '#3A3157', ink: '#1E1838' },
  diamond: { icon: 'leagueDiamond', color: '#4FE3CC', ink: '#23AB98' },
}
