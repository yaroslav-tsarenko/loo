'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { urlFor } from '../define'
import { Frame } from '../frame'
import type { AnyScene, DeviceKind, Step } from '../types'
import type { Point, Rect } from './geometry'
import { createPlayer, type Player, type ScrollPlan, type StageApi } from './runner'

type State = Record<string, unknown>

export interface EngineProps {
  scene: AnyScene
  device: DeviceKind
  playing: boolean
  loop: boolean
  restartKey: number
  onChapter: (index: number, text: string) => void
  onFinish: () => void
}

const PRESS = "button, a, label, [role='button'], [data-demo-press], [data-demo]"

function pickVisible(content: HTMLElement, selector: string): HTMLElement | null {
  for (const el of content.querySelectorAll<HTMLElement>(selector)) if (el.getClientRects().length > 0) return el
  return null
}

// Plays a scene: owns the scene state, a fake cursor, a spotlight and the rAF loop.
export default function TheaterEngine({ scene, device, playing, loop, restartKey, onChapter, onFinish }: EngineProps) {
  const bare = scene.frame === 'bare'
  const [state, setState] = useState<State>(scene.initial)
  const [focus, setFocus] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const callbacks = useRef({ onChapter, onFinish })
  const playerRef = useRef<Player | null>(null)
  const playingRef = useRef(playing)

  useEffect(() => {
    callbacks.current = { onChapter, onFinish }
  })

  useEffect(() => {
    const live = {
      state: scene.initial as State,
      cursor: { x: 0, y: 0 } as Point,
      hovered: null as HTMLElement | null,
      pressed: null as HTMLElement | null,
    }
    const content = () => contentRef.current
    const touch = device === 'phone'
    const scale = () => {
      const c = content()
      if (!c || c.offsetWidth === 0) return 1
      return c.getBoundingClientRect().width / c.offsetWidth
    }
    const rectOf = (el: Element): Rect | null => {
      const c = content()
      if (!c) return null
      const k = scale()
      const cr = c.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      return { left: (r.left - cr.left) / k, top: (r.top - cr.top) / k, width: r.width / k, height: r.height / k }
    }
    const find = (target: string) => {
      const c = content()
      return c ? pickVisible(c, `[data-demo="${target}"]`) : null
    }
    const mode = (m: string) => cursorRef.current?.setAttribute('data-mode', touch ? 'touch' : m)
    const commit = (next: State) => {
      live.state = next
      flushSync(() => setState(next))
    }
    const plan = (scroller: HTMLElement, to: number): ScrollPlan | null => {
      const max = scroller.scrollHeight - scroller.clientHeight
      const y = Math.max(0, Math.min(max, to))
      const from = scroller.scrollTop
      if (Math.abs(y - from) < 1) return null
      return {
        from,
        to: y,
        apply: (v) => {
          scroller.scrollTop = v
        },
      }
    }

    const stage: StageApi<State> = {
      getState: () => live.state,
      setState: commit,
      restore: () => {
        live.hovered?.removeAttribute('data-hover')
        live.pressed?.removeAttribute('data-press')
        live.hovered = null
        live.pressed = null
        flushSync(() => setFocus(null))
        commit(scene.initial)
        content()
          ?.querySelectorAll<HTMLElement>('[data-demo-scroll]')
          .forEach((el) => {
            el.scrollTop = 0
          })
        spotRef.current?.removeAttribute('data-on')
        tipRef.current?.removeAttribute('data-on')
        mode('pointer')
      },
      fade: (a) => {
        const c = content()
        if (c) c.style.opacity = a >= 1 ? '' : String(a)
      },
      locate: (target) => {
        const el = find(target)
        return el ? rectOf(el) : null
      },
      autoScroll: (target) => {
        const el = find(target)
        const scroller = el?.closest<HTMLElement>('[data-demo-scroll]')
        if (!el || !scroller) return null
        const sr = rectOf(scroller)
        const er = rectOf(el)
        if (!sr || !er) return null
        if (er.top >= sr.top + 8 && er.top + er.height <= sr.top + sr.height - 8) return null
        return plan(scroller, scroller.scrollTop + (er.top - sr.top) - sr.height * 0.3)
      },
      scrollPlan: (container, to) => {
        const scroller = content()?.querySelector<HTMLElement>(`[data-demo-scroll="${container}"]`)
        if (!scroller) return null
        if (typeof to === 'number') return plan(scroller, to)
        const el = find(to)
        const sr = rectOf(scroller)
        const er = el ? rectOf(el) : null
        if (!sr || !er) return null
        return plan(scroller, scroller.scrollTop + (er.top - sr.top) - 16)
      },
      home: () => {
        const c = content()
        return c ? { x: c.clientWidth * 0.72, y: c.clientHeight * 0.8 } : { x: 0, y: 0 }
      },
      getCursor: () => live.cursor,
      setCursor: (p) => {
        live.cursor = p
        const el = cursorRef.current
        if (el) el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`
      },
      cursorVisible: (on) => {
        const el = cursorRef.current
        if (!el) return
        if (on) el.setAttribute('data-on', '')
        else el.removeAttribute('data-on')
      },
      cursorMode: (m) => mode(m),
      hover: (target) => {
        live.hovered?.removeAttribute('data-hover')
        live.hovered = null
        if (!target || touch) return
        const el = find(target)?.closest<HTMLElement>(PRESS) ?? null
        el?.setAttribute('data-hover', '')
        live.hovered = el
      },
      press: (target) => {
        cursorRef.current?.setAttribute('data-down', '')
        const ring = ringRef.current
        if (ring) {
          ring.removeAttribute('data-pulse')
          void ring.offsetWidth
          ring.setAttribute('data-pulse', '')
        }
        const el = find(target)
        if (!el) return
        const pressable = el.closest<HTMLElement>(PRESS) ?? el
        if (pressable.getBoundingClientRect().width < 420) {
          pressable.setAttribute('data-press', '')
          live.pressed = pressable
        }
      },
      release: () => {
        cursorRef.current?.removeAttribute('data-down')
        live.pressed?.removeAttribute('data-press')
        live.pressed = null
      },
      focus: (target) => flushSync(() => setFocus(target)),
      highlight: (target, label) => {
        const spot = spotRef.current
        const tip = tipRef.current
        const c = content()
        if (!spot || !tip || !c) return
        const el = target ? find(target) : null
        const r = el ? rectOf(el) : null
        if (!r) {
          spot.removeAttribute('data-on')
          tip.removeAttribute('data-on')
          return
        }
        const pad = 6
        spot.style.left = `${r.left - pad}px`
        spot.style.top = `${r.top - pad}px`
        spot.style.width = `${r.width + pad * 2}px`
        spot.style.height = `${r.height + pad * 2}px`
        tip.textContent = label ?? ''
        const width = Math.min(320, c.clientWidth - 24)
        const below = r.top + r.height + pad + 80 < c.clientHeight
        tip.style.left = `${Math.max(12, Math.min(c.clientWidth - width - 12, r.left))}px`
        tip.style.maxWidth = `${width}px`
        tip.style.top = below ? `${r.top + r.height + pad + 10}px` : ''
        tip.style.bottom = below ? '' : `${c.clientHeight - r.top + pad + 10}px`
        spot.setAttribute('data-on', '')
        tip.setAttribute('data-on', '')
      },
    }

    const player = createPlayer<State>({
      steps: scene.steps as Step<State>[],
      stage,
      loop,
      onChapter: (i, text) => callbacks.current.onChapter(i, text),
      onFinish: () => callbacks.current.onFinish(),
    })
    playerRef.current = player
    if (playingRef.current) player.play()

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      player.tick(Math.min(now - last, 100))
      last = now
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      player.pause()
      playerRef.current = null
    }
  }, [scene, device, loop])

  useEffect(() => {
    playingRef.current = playing
    const player = playerRef.current
    if (!player) return
    if (playing) player.play()
    else player.pause()
  }, [playing])

  const lastRestart = useRef(restartKey)
  useEffect(() => {
    if (lastRestart.current === restartKey) return
    lastRestart.current = restartKey
    playerRef.current?.restart()
  }, [restartKey])

  const View = scene.View
  return (
    <Frame
      device={device}
      bare={bare}
      url={urlFor(scene, state)}
      contentRef={contentRef}
      overlay={
        <>
          <div ref={spotRef} className="th-spot" />
          <div ref={tipRef} className="th-tip" />
          <div ref={cursorRef} className="th-cursor" data-mode={device === 'desktop' ? 'pointer' : 'touch'}>
            <span ref={ringRef} className="th-ring" />
            <svg data-shape="pointer" width="24" height="24" viewBox="0 0 24 24">
              <path d="M4.5 2.8v16.4l4.3-4.1 3 6.9 3-1.3-3-6.8h6z" fill="#14161a" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <svg data-shape="text" width="14" height="24" viewBox="0 0 14 24" fill="none" strokeLinecap="round">
              <path d="M3 2.5h2.5c.9 0 1.5.5 1.5 1.4 0-.9.6-1.4 1.5-1.4H11M7 4v16m-4 1.5h2.5c.9 0 1.5-.5 1.5-1.4 0 .9.6 1.4 1.5 1.4H11" stroke="#fff" strokeWidth="3.4" />
              <path d="M3 2.5h2.5c.9 0 1.5.5 1.5 1.4 0-.9.6-1.4 1.5-1.4H11M7 4v16m-4 1.5h2.5c.9 0 1.5-.5 1.5-1.4 0 .9.6 1.4 1.5 1.4H11" stroke="#14161a" strokeWidth="1.5" />
            </svg>
            <span data-shape="touch" />
          </div>
        </>
      }
    >
      <View s={state} device={device} focus={focus} />
    </Frame>
  )
}
