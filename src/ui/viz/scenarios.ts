// All step-through scenario data in one place (tests and tooling; components
// import their own files so each viz stays a separate chunk).
import { pipelineScenarios } from './array-pipeline/scenarios'
import { callStackScenarios } from './call-stack/scenarios'
import { corsScenarios } from './cors/scenarios'
import { eventPropagationScenarios } from './event-propagation/scenarios'
import { hiddenClassScenarios } from './hidden-classes/scenarios'
import { httpCacheScenarios } from './http-cache/scenarios'
import { moduleGraphScenarios } from './module-graph/scenarios'
import { proxyTrapsScenarios } from './proxy-traps/scenarios'
import { REGEX_EXAMPLES, buildRegexScenario } from './regex-engine/scenarios'
import { renderPipelineScenarios } from './render-pipeline/scenarios'
import { serviceWorkerScenarios } from './service-worker/scenarios'
import { tc39Scenarios } from './tc39-stages/scenarios'
import { workerMessagingScenarios } from './worker-messaging/scenarios'
import { xssScenarios } from './xss/scenarios'
import type { StepScenario } from './engine/types'
import { eventLoopScenarios } from './event-loop/scenarios'
import { gcScenarios } from './gc/scenarios'
import { generatorScenarios } from './generators/scenarios'
import { hoistingScenarios } from './hoisting/scenarios'
import { memoryScenarios } from './memory-refs/scenarios'
import { promiseScenarios } from './promise-states/scenarios'
import { LOOKUP_PROPS, buildLookupScenario, prototypeScenarios } from './prototype-chain/scenarios'
import { scopeChainScenarios } from './scope-chain/scenarios'
import { thisScenarios } from './this-binding/scenarios'

export const STEP_SCENARIOS: Record<string, Record<string, StepScenario>> = {
  'call-stack': callStackScenarios,
  'event-loop': eventLoopScenarios,
  'scope-chain': scopeChainScenarios,
  hoisting: hoistingScenarios,
  'this-binding': thisScenarios,
  'prototype-chain': prototypeScenarios,
  'promise-states': promiseScenarios,
  'memory-refs': memoryScenarios,
  gc: gcScenarios,
  'array-pipeline': pipelineScenarios,
  generators: generatorScenarios,
  'proxy-traps': proxyTrapsScenarios,
  'module-graph': moduleGraphScenarios,
  'event-propagation': eventPropagationScenarios,
  'render-pipeline': renderPipelineScenarios,
  cors: corsScenarios,
  'http-cache': httpCacheScenarios,
  'service-worker': serviceWorkerScenarios,
  'hidden-classes': hiddenClassScenarios,
  'worker-messaging': workerMessagingScenarios,
  xss: xssScenarios,
  'tc39-stages': tc39Scenarios,
}

// Interactive scenarios that are still driven by generated frames.
export const GENERATED_SCENARIOS: Array<{ viz: string; scenario: string; variant: string; data: StepScenario }> = [
  ...LOOKUP_PROPS.map((prop) => ({ viz: 'prototype-chain', scenario: 'lookup', variant: prop, data: buildLookupScenario(prop) })),
  ...REGEX_EXAMPLES.map((e) => ({ viz: 'regex-engine', scenario: 'backtracking', variant: e.id, data: buildRegexScenario(e.id) as StepScenario })),
]
