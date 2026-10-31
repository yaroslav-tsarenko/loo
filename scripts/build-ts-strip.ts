import { writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { getVersion } from 'sucrase'
import { bundleTsStrip, generatedModule, OUTPUT } from './lib/ts-strip-bundle'

// Regenerates the TypeScript stripper inlined into /runner/worker.js. Run after bumping sucrase or editing
// src/ui/code/ts-strip.ts; tests/unit/ts-strip.test.ts fails while the generated file is stale.
const expression = await bundleTsStrip()
writeFileSync(new URL(`../${OUTPUT}`, import.meta.url), generatedModule(expression, getVersion()))
console.log(`${OUTPUT}: ${(expression.length / 1024).toFixed(1)} KB, ${(gzipSync(expression).length / 1024).toFixed(1)} KB gzip`)
