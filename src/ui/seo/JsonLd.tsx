// Structured data for search engines (schema.org JSON-LD). A data block, never executed, so the CSP doesn't apply;
// `<` is escaped so no string in the data can close the tag (docs/SECURITY.md).
export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
