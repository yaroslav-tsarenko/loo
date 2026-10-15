import os from 'node:os'
import path from 'node:path'
import { absolutePath } from '@/lib/paths'

export interface VaultConfig {
  vaultPath: string
  guidesDir: string
}

function expandHome(p: string): string {
  if (p === '~') return os.homedir()
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2))
  return p
}

export function defaultVaultConfig(): VaultConfig {
  // On Vercel the guides ship in ./content (pnpm content:sync); locally they come from the Obsidian vault.
  const raw = process.env.VAULT_PATH ?? (process.env.VERCEL ? 'content' : path.join(os.homedir(), 'Documents', 'Obsidian Vault'))
  return { vaultPath: absolutePath(expandHome(raw)), guidesDir: process.env.GUIDES_DIR ?? 'Guides' }
}

export function normalizeVaultPath(p: string): string {
  return absolutePath(expandHome(p.trim()))
}
