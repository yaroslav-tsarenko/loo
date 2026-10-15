'use client'

import { Pause, Play, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { captionsOf, resolveEnd } from './define'
import { useElection, usePageHidden, useReducedMotionPref, useWideViewport } from './election'
import type { EngineProps } from './engine/engine'
import { loadScene } from './scenes'
import { Poster, Still } from './still'
import { useTheaterSync } from './sync'
import type { AnyScene, DeviceKind, TheaterDevice } from './types'

let enginePromise: Promise<ComponentType<EngineProps>> | null = null
const loadEngine = () => (enginePromise ??= import('./engine/engine').then((m) => m.default))

export interface TheaterStageProps {
  sceneId: string
  scenario: string
  device: TheaterDevice
  url: string
  title: string
  caption?: ReactNode
  autoPlay?: boolean
  loop?: boolean
  exclusive?: boolean
  showSteps?: boolean
  className?: string
}

export function TheaterStage({ sceneId, scenario, device, url, title, caption, autoPlay = true, loop = true, exclusive = true, showSteps = false, className }: TheaterStageProps) {
  const rootRef = useRef<HTMLElement>(null)
  const sync = useTheaterSync()
  const reduced = useReducedMotionPref()
  const hidden = usePageHidden()
  const wide = useWideViewport()
  const { ratio, elected } = useElection(rootRef, exclusive)
  const [near, setNear] = useState(false)
  const [scene, setScene] = useState<AnyScene | null>(null)
  const [Engine, setEngine] = useState<ComponentType<EngineProps> | null>(null)
  const [userPaused, setUserPaused] = useState(false)
  const [started, setStarted] = useState(autoPlay)
  const [finished, setFinished] = useState(false)
  const [chapter, setChapter] = useState(-1)
  const [restartKey, setRestartKey] = useState(0)
  const setSyncChapter = sync?.setChapter

  // load the scene (and the engine) only when the figure is about to scroll in
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        setNear(true)
        io.disconnect()
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!near) return
    let cancelled = false
    const tasks: Promise<unknown>[] = [loadScene(sceneId, scenario)]
    if (!reduced) tasks.push(loadEngine())
    Promise.all(tasks)
      .then(([s, E]) => {
        if (cancelled) return
        setScene(s as AnyScene)
        if (E) setEngine(() => E as ComponentType<EngineProps>)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [near, reduced, sceneId, scenario])

  const onChapter = useCallback(
    (i: number) => {
      setChapter(i)
      setSyncChapter?.(i)
    },
    [setSyncChapter],
  )
  const onFinish = useCallback(() => setFinished(true), [])

  const resolved: DeviceKind = device === 'auto' ? (wide ? 'desktop' : 'phone') : device
  const captions = scene ? captionsOf(scene) : []
  const live = Boolean(Engine && scene && !reduced)
  const playing = live && started && !userPaused && !finished && ratio > 0.05 && elected && !hidden

  const toggle = () => {
    if (finished) {
      setFinished(false)
      setUserPaused(false)
      setRestartKey((k) => k + 1)
      return
    }
    if (!started) {
      setStarted(true)
      setUserPaused(false)
      return
    }
    setUserPaused((p) => !p)
  }

  let content: ReactNode = <Poster device={device} url={url} />
  if (scene && reduced) content = <Still scene={scene} device={resolved} state={resolveEnd(scene)} />
  else if (scene && Engine)
    content = <Engine scene={scene} device={resolved} playing={playing} loop={loop} restartKey={restartKey} onChapter={onChapter} onFinish={onFinish} />
  else if (scene) content = <Still scene={scene} device={resolved} state={scene.initial} />

  const label = finished ? 'Переглянути ще раз' : !playing && (userPaused || !started) ? 'Відтворити' : 'Пауза'
  const shown = reduced ? -1 : chapter
  const current = reduced ? title : (captions[Math.max(0, shown)] ?? title)

  return (
    <figure ref={rootRef} className={`th-root${className ? ` ${className}` : ''}`} data-paused={!playing ? '' : undefined} aria-label={title}>
      <div className="th-box" data-box={device} aria-hidden="true" inert>
        {content}
      </div>
      <div className="th-bar-row">
        <p className="th-chapter" aria-hidden="true">
          {captions.length > 0 && !reduced ? (
            <span className="th-chapter-num tabular">
              {String(Math.max(1, shown + 1)).padStart(2, '0')}/{String(captions.length).padStart(2, '0')}
            </span>
          ) : null}
          <span key={shown} className="th-chapter-text">
            {current}
          </span>
        </p>
        {!reduced ? (
          <button type="button" className="th-toggle" onClick={toggle} aria-label={label} title={label}>
            {finished ? <RotateCcw size={18} /> : label === 'Відтворити' ? <Play size={18} /> : <Pause size={18} />}
          </button>
        ) : null}
      </div>
      <figcaption className={caption ? 'th-caption' : 'sr-only'}>
        {caption ?? title}
        <span className="sr-only"> Ілюстрація з демонстраційними даними.</span>
      </figcaption>
      {captions.length > 0 ? (
        <ol className="th-steps" data-visible={showSteps || reduced ? '' : undefined}>
          {captions.map((c, i) => (
            <li key={c} aria-current={!reduced && i === chapter ? 'step' : undefined}>
              <span className="th-steps-num" aria-hidden="true">
                {i + 1}
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </figure>
  )
}
