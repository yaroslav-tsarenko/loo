import { describe, expect, it } from 'vitest'
import { diagramFrames, parseDiagram } from '@/content/diagram/spec'

const FLOW = `
layout: flow
nodes:
  - { id: in, label: аргументи, text: 5 }
  - { id: fn, label: функція, code: "function double(x) {\\n  return x * 2\\n}" }
  - { id: out, label: результат, text: 10, tone: green }
edges:
  - { from: in, to: fn, label: виклик }
  - { from: fn, to: out, label: return }
steps:
  - { show: in, note: Передаємо 5 }
  - { show: fn, note: x = 5, рахуємо x * 2 }
  - { show: out, note: return віддає 10 }
`

describe('[!diagram] spec', () => {
  it('parses a flow with numbers coerced to text', () => {
    const r = parseDiagram('Функція', FLOW)
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.warnings).toEqual([])
    expect(r.spec.nodes[0]).toMatchObject({ id: 'in', text: '5' })
    expect(r.spec.steps?.[0]?.show).toEqual(['in'])
  })

  it('walks frames cumulatively and focuses what was just shown', () => {
    const r = parseDiagram('', FLOW)
    if (!r.ok) throw new Error(r.error)
    const frames = diagramFrames(r.spec)
    expect(frames.map((f) => [...f.visible])).toEqual([['in'], ['in', 'fn'], ['in', 'fn', 'out']])
    expect([...frames[1]!.focus]).toEqual(['fn'])
  })

  it('hide removes a node (a popped stack frame)', () => {
    const r = parseDiagram('', 'layout: stack\nnodes: [{id: a, text: main}, {id: b, text: f}]\nsteps: [{show: a}, {show: b}, {hide: b, focus: a}]')
    if (!r.ok) throw new Error(r.error)
    expect([...diagramFrames(r.spec)[2]!.visible]).toEqual(['a'])
  })

  it('without steps everything is visible', () => {
    const r = parseDiagram('', 'nodes: [{id: a, text: x}]')
    if (!r.ok) throw new Error(r.error)
    expect(diagramFrames(r.spec)).toHaveLength(1)
  })

  it('reports unknown ids and bad yaml', () => {
    const r = parseDiagram('', 'nodes: [{id: a, text: x}]\nedges: [{from: a, to: zzz}]')
    expect(r.ok && r.warnings[0]).toContain('zzz')
    expect(parseDiagram('', 'nodes: [').ok).toBe(false)
    expect(parseDiagram('', 'layout: spiral\nnodes: [{id: a}]').ok).toBe(false)
  })
})
