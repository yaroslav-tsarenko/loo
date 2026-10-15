'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { VizProps } from './engine/types'

function Loading() {
  return <div className="viz-loading" aria-hidden="true" />
}

// One chunk per visualization: a chapter only downloads the vizs it embeds.
export const VIZ_COMPONENTS: Record<string, ComponentType<VizProps>> = {
  'call-stack': dynamic(() => import('./call-stack/CallStackViz').then((m) => m.CallStackViz), { loading: Loading }),
  'event-loop': dynamic(() => import('./event-loop/EventLoopViz').then((m) => m.EventLoopViz), { loading: Loading }),
  'scope-chain': dynamic(() => import('./scope-chain/ScopeChainViz').then((m) => m.ScopeChainViz), { loading: Loading }),
  hoisting: dynamic(() => import('./hoisting/HoistingViz').then((m) => m.HoistingViz), { loading: Loading }),
  'this-binding': dynamic(() => import('./this-binding/ThisBindingViz').then((m) => m.ThisBindingViz), { loading: Loading }),
  'prototype-chain': dynamic(() => import('./prototype-chain/PrototypeViz').then((m) => m.PrototypeViz), { loading: Loading }),
  'promise-states': dynamic(() => import('./promise-states/PromiseViz').then((m) => m.PromiseViz), { loading: Loading }),
  coercion: dynamic(() => import('./coercion/CoercionViz').then((m) => m.CoercionViz), { loading: Loading }),
  'memory-refs': dynamic(() => import('./memory-refs/MemoryViz').then((m) => m.MemoryViz), { loading: Loading }),
  gc: dynamic(() => import('./gc/GcViz').then((m) => m.GcViz), { loading: Loading }),
  'debounce-throttle': dynamic(() => import('./debounce-throttle/DebounceThrottleViz').then((m) => m.DebounceThrottleViz), { loading: Loading }),
  'array-pipeline': dynamic(() => import('./array-pipeline/PipelineViz').then((m) => m.PipelineViz), { loading: Loading }),
  generators: dynamic(() => import('./generators/GeneratorViz').then((m) => m.GeneratorViz), { loading: Loading }),
  'float-precision': dynamic(() => import('./float-precision/FloatViz').then((m) => m.FloatViz), { loading: Loading }),
  'regex-engine': dynamic(() => import('./regex-engine/RegexViz').then((m) => m.RegexViz), { loading: Loading }),
  'proxy-traps': dynamic(() => import('./proxy-traps/ProxyTrapsViz').then((m) => m.ProxyTrapsViz), { loading: Loading }),
  'module-graph': dynamic(() => import('./module-graph/ModuleGraphViz').then((m) => m.ModuleGraphViz), { loading: Loading }),
  'unicode-string': dynamic(() => import('./unicode-string/UnicodeViz').then((m) => m.UnicodeViz), { loading: Loading }),
  'event-propagation': dynamic(() => import('./event-propagation/EventPropagationViz').then((m) => m.EventPropagationViz), { loading: Loading }),
  'render-pipeline': dynamic(() => import('./render-pipeline/RenderPipelineViz').then((m) => m.RenderPipelineViz), { loading: Loading }),
  cors: dynamic(() => import('./cors/CorsViz').then((m) => m.CorsViz), { loading: Loading }),
  'http-cache': dynamic(() => import('./http-cache/HttpCacheViz').then((m) => m.HttpCacheViz), { loading: Loading }),
  'service-worker': dynamic(() => import('./service-worker/ServiceWorkerViz').then((m) => m.ServiceWorkerViz), { loading: Loading }),
  'hidden-classes': dynamic(() => import('./hidden-classes/HiddenClassesViz').then((m) => m.HiddenClassesViz), { loading: Loading }),
  'worker-messaging': dynamic(() => import('./worker-messaging/WorkerMessagingViz').then((m) => m.WorkerMessagingViz), { loading: Loading }),
  xss: dynamic(() => import('./xss/XssViz').then((m) => m.XssViz), { loading: Loading }),
  'tc39-stages': dynamic(() => import('./tc39-stages/Tc39Viz').then((m) => m.Tc39Viz), { loading: Loading }),
}
