import { transform } from 'sucrase'

// TypeScript for [!task] exercises: types are stripped, never checked. Sucrase keeps line numbers
// (removed types become blanks), and disableESTransforms leaves modern JS (?., ??, class fields) as written.
// This module is bundled into the runner worker (scripts/build-ts-strip.ts → ts-strip.bundle.generated.ts)
// and imported directly by the Node task checks, so the browser and content:check strip the same way.
// Never import it from client components: sucrase must stay out of page bundles.

export type Prepared = { ok: true; code: string; tests: string } | { ok: false; error: string }

export function stripTypes(source: string): string {
  return transform(source, { transforms: ['typescript'], disableESTransforms: true }).code
}

// Same wording as the harness's own syntax errors, so a TS typo looks like any other syntax error.
export function prepareTypeScript(code: string, tests: string): Prepared {
  const text = (e: unknown) => (e instanceof Error ? `${e.name}: ${e.message}` : String(e))
  let strippedCode: string
  try {
    strippedCode = stripTypes(code)
  } catch (e) {
    return { ok: false, error: `Синтаксична помилка у твоєму коді: ${text(e)}` }
  }
  try {
    return { ok: true, code: strippedCode, tests: stripTypes(tests) }
  } catch (e) {
    return { ok: false, error: `Синтаксична помилка в тестах: ${text(e)}` }
  }
}
