import path from 'node:path'

const { resolve } = path

export function absolutePath(...parts: string[]): string {
  return resolve(...parts)
}
