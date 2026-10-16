// One round trip per statement (docs/PERFORMANCE.md §DB).
//
// With `prepare: false` (required by Supabase's transaction pooler) postgres-js runs every parameterized query in two
// round trips: Parse/Describe/Flush, wait for the parameter types, then Bind/Execute/Sync. Parameterless queries skip
// that: Parse/Describe/Bind/Execute/Sync go out as one message — the ordinary unnamed-statement flow every driver
// (node-postgres, pgx…) uses with poolers.
//
// This wrapper sends parameterized queries the parameterless way: the query is created without arguments (so
// postgres-js takes the one-message path) and the values are attached as its bound parameters with type 0 — the
// server infers each parameter's type from the statement, exactly as it does when answering the describe step
// (postgres-js already sends strings and numbers untyped). Values still travel as bound parameters, never inside the
// SQL text.
//
// NO PIPELINING by default: Supavisor's transaction mode (port 6543) does not support pipelined queries — replies get
// dropped or mismatched (supabase.com/docs/guides/database/postgres-js; supavisor#1061) — and neither does PGlite's
// socket server. So each wrapped handle (the pool, every transaction) runs one statement at a time, in call order: a
// statement is only sent after the previous one's reply. Promise.all over one handle is therefore sequential on the
// wire; collapsing reads into fewer statements is what saves round trips.
//
// DATABASE_PIPELINE: `serial` → as above (opt-in until verified on Supavisor) · `pipeline` → also let concurrent statements share
// round trips (only on a direct connection / session pooler, port 5432, or once Supavisor supports it) · `0` → stock
// postgres-js (the default elsewhere: PGlite's socket server — pnpm db:local — answers an error inside a one-message
// statement with an extra reply and the connection loses step; real Postgres does not).
//
// Only plain values take the one-message path (string, finite number, boolean, null — everything drizzle produces:
// JSON and arrays arrive already serialized); anything else (Date, Buffer, bigint, postgres-js helpers) keeps the stock
// encoding (still serialized).

type Unsafe = (text: string, params?: unknown[], options?: Record<string, unknown>) => unknown

interface ClientLike {
  unsafe: Unsafe
  begin?: (...args: unknown[]) => unknown
  savepoint?: (...args: unknown[]) => unknown
}

interface RawQuery extends PromiseLike<unknown> {
  parameters?: unknown[]
  values(): RawQuery
  execute(): unknown
}

const plain = (v: unknown): boolean => v === null || typeof v === 'string' || typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))
// postgres-js's own boolean serializer
const wire = (v: unknown): unknown => (typeof v === 'boolean' ? (v ? 't' : 'f') : v)

function makeQuery(target: ClientLike, text: string, params: unknown[] | undefined, options: Record<string, unknown> | undefined): RawQuery {
  if (!params || params.length === 0 || options !== undefined || !params.every(plain)) return target.unsafe(text, params, options) as RawQuery
  // simple: false — postgres-js would otherwise pick the simple protocol for an argument-less query
  const query = target.unsafe(text, [], { simple: false }) as RawQuery
  query.parameters = params.map(wire)
  return query
}

// A statement that waits for its turn on the handle: created and sent only when the previous one has settled.
class SerialQuery implements PromiseLike<unknown> {
  private arrayMode = false
  private started: Promise<unknown> | null = null

  constructor(private readonly start: (arrayMode: boolean) => Promise<unknown>) {}

  values(): this {
    this.arrayMode = true
    return this
  }

  // postgres-js: send now (here: take the place in the handle's queue now)
  execute(): this {
    this.run()
    return this
  }

  private run(): Promise<unknown> {
    this.started ??= this.start(this.arrayMode)
    return this.started
  }

  then<A = unknown, B = never>(onfulfilled?: ((value: unknown) => A | PromiseLike<A>) | null, onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null): Promise<A | B> {
    return this.run().then(onfulfilled, onrejected)
  }

  catch<B = never>(onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null): Promise<unknown> {
    return this.run().catch(onrejected)
  }

  finally(onfinally?: (() => void) | null): Promise<unknown> {
    return this.run().finally(onfinally)
  }
}

export type PipelineMode = 'serial' | 'pipeline' | 'off'

export function pipelineMode(env: Record<string, string | undefined> = process.env): PipelineMode {
  const v = env.DATABASE_PIPELINE
  if (v === '0' || v === 'off') return 'off'
  if (v === 'pipeline') return 'pipeline'
  if (v === 'serial' || v === '1') return 'serial'
  // Off unless asked for: the one-message path has not been verified against Supavisor yet (enable with
  // DATABASE_PIPELINE=serial on a preview deployment first).
  return 'off'
}

// Wraps a postgres-js `sql` (and every transaction / savepoint handle it opens) for drizzle: drizzle only calls
// unsafe(), begin() and savepoint() on it and reads its options.
export function pipelined<T extends object>(client: T, mode: PipelineMode = pipelineMode()): T {
  if (mode === 'off') return client
  const c = client as unknown as ClientLike
  // the handle's queue: the settled promise of the statement sent last
  let tail: Promise<unknown> = Promise.resolve()
  const unsafe: Unsafe = (text, params, options) => {
    if (mode === 'pipeline') return makeQuery(c, text, params, options)
    return new SerialQuery((arrayMode) => {
      const run = tail.then(() => {
        const query = makeQuery(c, text, params, options)
        return arrayMode ? query.values() : query
      })
      tail = run.then(
        () => undefined,
        () => undefined,
      )
      return run
    })
  }
  return new Proxy(client, {
    get(target, prop, receiver) {
      if (prop === 'unsafe') return unsafe
      if ((prop === 'begin' || prop === 'savepoint') && typeof c[prop] === 'function') {
        const original = c[prop]!
        return (...args: unknown[]) => {
          const fn = args.at(-1)
          if (typeof fn !== 'function') return original.apply(target, args)
          return original.apply(target, [...args.slice(0, -1), (inner: object) => fn(pipelined(inner, mode))])
        }
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}
