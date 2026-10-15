import { urlFor } from './define'
import { Frame } from './frame'
import type { AnyScene, DeviceKind, TheaterDevice } from './types'

export function Still({ scene, device, state }: { scene: AnyScene; device: DeviceKind; state: Record<string, unknown> }) {
  const View = scene.View
  return (
    <Frame device={device} bare={scene.frame === 'bare'} url={urlFor(scene, state)}>
      <View s={state} device={device} focus={null} />
    </Frame>
  )
}

// Lightweight placeholder before the scene module loads (also the SSR markup).
export function Poster({ device, url }: { device: TheaterDevice; url: string }) {
  return (
    <Frame device={device} url={url}>
      <div className="th-poster">
        <span className="th-poster-bar" data-w="40" />
        <span className="th-poster-bar" data-w="70" />
        <span className="th-poster-block" />
        <span className="th-poster-bar" data-w="55" />
        <span className="th-poster-bar" data-w="30" />
      </div>
    </Frame>
  )
}
