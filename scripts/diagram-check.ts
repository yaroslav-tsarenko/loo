// pnpm diagram:check [path…] — parses every `[!diagram]` in the vault (or the given files) and lists errors/warnings,
// plus ASCII box drawings still left in ```text blocks (candidates for a diagram).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { extractDiagrams } from '../src/content/diagram/extract'
import { parseDiagram } from '../src/content/diagram/spec'

const vault = process.env.VAULT_PATH ?? join(process.env.HOME ?? '', 'Documents/Obsidian Vault')
const args = process.argv.slice(2)

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

const files = args.length ? args : walk(join(vault, 'Guides'))
const BOX = /[┌┐└┘│─├┤┬┴┼╔╗╚╝║═]/g
let diagrams = 0
let problems = 0
let ascii = 0
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')
  for (const d of extractDiagrams(src)) {
    diagrams++
    const where = `${file.replace(vault + '/', '')}:${d.line}`
    if (!d.yaml) {
      problems++
      console.log(`✗ ${where} — немає блоку yaml`)
      continue
    }
    const r = parseDiagram(d.title, d.yaml)
    if (!r.ok) {
      problems++
      console.log(`✗ ${where} — ${r.error}`)
    } else if (r.warnings.length) {
      problems++
      for (const w of r.warnings) console.log(`! ${where} — ${w}`)
    }
  }
  // fences may sit inside callouts (`> ```text`)
  for (let i = 0; i < lines.length; i++) {
    const open = /^\s*(?:>\s*)*```(\S*)\s*$/.exec(lines[i]!)
    if (!open) continue
    let j = i + 1
    while (j < lines.length && !/^\s*(?:>\s*)*```\s*$/.test(lines[j]!)) j++
    const lang = open[1]!
    if (['', 'text', 'txt', 'plain', 'ascii'].includes(lang) && (lines.slice(i + 1, j).join('\n').match(BOX) ?? []).length >= 6) {
      ascii++
      console.log(`· ${file.replace(vault + '/', '')}:${i + 1} — ASCII-схема в \`\`\`${lang}`)
    }
    i = j
  }
}
console.log(`\n${diagrams} схем, проблем: ${problems}; ASCII-малюнків лишилось: ${ascii}`)
process.exit(problems ? 1 : 0)
