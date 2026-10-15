import { mkdirSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'

// Offline Postgres for local dev and e2e (Postgres compiled to WASM, data in .data/pglite).
// Usage: pnpm db:local [dataDir] [port]  →  DATABASE_URL=postgres://postgres@127.0.0.1:54329/postgres
const dataDir = process.argv[2] ?? '.data/pglite'
const port = Number(process.argv[3] ?? 54329)
if (dataDir !== 'memory://') mkdirSync(dataDir, { recursive: true })
const db = await PGlite.create(dataDir)
const server = new PGLiteSocketServer({ db, port, host: '127.0.0.1', maxConnections: 10 })
await server.start()
console.log(`🐘 PGlite: postgres://postgres@127.0.0.1:${port}/postgres (${dataDir})`)
const stop = async () => {
  await server.stop()
  await db.close()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
