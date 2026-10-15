import { ChevronLeft, ChevronRight, Lock, RotateCw } from 'lucide-react'
import type { ReactNode, Ref } from 'react'
import type { DeviceKind, TheaterDevice } from './types'

function BrowserBar({ url }: { url: string }) {
  const secure = !url.startsWith('http://')
  const shown = url.replace(/^https?:\/\//, '')
  const slash = shown.indexOf('/')
  const host = slash < 0 ? shown : shown.slice(0, slash)
  const path = slash < 0 ? '' : shown.slice(slash)
  return (
    <div className="th-bar-inner">
      <span className="th-lights" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="th-nav" aria-hidden="true">
        <ChevronLeft size={18} />
        <ChevronRight size={18} className="th-dim" />
        <RotateCw size={15} />
      </span>
      <span className="th-url">
        {secure ? <Lock size={12} aria-hidden="true" /> : null}
        <span className="th-url-text">
          <span className="th-url-host">{host}</span>
          {path}
        </span>
      </span>
      <span className="th-bar-spacer" />
    </div>
  )
}

function StatusBar() {
  return (
    <div className="th-status-inner">
      <span>9:41</span>
      <span className="th-status-icons" aria-hidden="true">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="5" y="5" width="3" height="6" rx="1" />
          <rect x="10" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="15" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.45" />
          <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
          <rect x="23" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  )
}

export interface FrameProps {
  device: DeviceKind | TheaterDevice
  bare?: boolean
  url: string
  contentRef?: Ref<HTMLDivElement>
  overlay?: ReactNode
  children: ReactNode
}

// Device chrome drawn at a fixed "device pixel" size and scaled to the box by CSS.
export function Frame({ device, bare = false, url, contentRef, overlay, children }: FrameProps) {
  const phone = device === 'phone'
  return (
    <div className="th-frame" data-device={device} data-bare={bare ? '' : undefined}>
      {!bare ? (
        <>
          <div className="th-shell" />
          {phone ? null : (
            <div className="th-bar">
              <BrowserBar url={url} />
            </div>
          )}
        </>
      ) : null}
      <div className="th-screen">
        {!bare ? (
          <div className="th-status">
            <StatusBar />
          </div>
        ) : null}
        <div ref={contentRef} className="th-content">
          {children}
          {overlay}
        </div>
        {!bare ? (
          <div className="th-phone-deco" aria-hidden="true">
            <span className="th-island" />
            <span className="th-home" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
