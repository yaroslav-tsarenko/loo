export type SoundName = 'correct' | 'wrong' | 'flip' | 'level' | 'achievement' | 'goal' | 'xp' | 'combo' | 'complete'

interface Tone {
  freq: number
  at: number
  dur: number
  type: OscillatorType
  gain: number
  slideTo?: number
}

const PATTERNS: Record<Exclude<SoundName, 'flip'>, Tone[]> = {
  correct: [
    { freq: 659.25, at: 0, dur: 0.09, type: 'sine', gain: 0.5 },
    { freq: 987.77, at: 0.075, dur: 0.16, type: 'sine', gain: 0.45 },
  ],
  wrong: [{ freq: 233.08, at: 0, dur: 0.2, type: 'triangle', gain: 0.45, slideTo: 196 }],
  level: [
    { freq: 523.25, at: 0, dur: 0.12, type: 'triangle', gain: 0.4 },
    { freq: 659.25, at: 0.09, dur: 0.12, type: 'triangle', gain: 0.4 },
    { freq: 783.99, at: 0.18, dur: 0.12, type: 'triangle', gain: 0.4 },
    { freq: 1046.5, at: 0.27, dur: 0.38, type: 'sine', gain: 0.45 },
  ],
  achievement: [
    { freq: 880, at: 0, dur: 0.5, type: 'sine', gain: 0.35 },
    { freq: 1318.5, at: 0.06, dur: 0.6, type: 'sine', gain: 0.25 },
  ],
  goal: [
    { freq: 587.33, at: 0, dur: 0.14, type: 'sine', gain: 0.35 },
    { freq: 880, at: 0.12, dur: 0.3, type: 'sine', gain: 0.35 },
  ],
  // Coin "ding": two bright partials, the second a fifth above, very short.
  xp: [
    { freq: 1318.5, at: 0, dur: 0.06, type: 'square', gain: 0.12 },
    { freq: 1975.5, at: 0.05, dur: 0.14, type: 'sine', gain: 0.3 },
  ],
  combo: [
    { freq: 783.99, at: 0, dur: 0.08, type: 'triangle', gain: 0.35 },
    { freq: 987.77, at: 0.06, dur: 0.08, type: 'triangle', gain: 0.35 },
    { freq: 1318.5, at: 0.12, dur: 0.18, type: 'sine', gain: 0.35, slideTo: 1567.98 },
  ],
  // Lesson complete fanfare: major arpeggio + held octave.
  complete: [
    { freq: 523.25, at: 0, dur: 0.14, type: 'triangle', gain: 0.4 },
    { freq: 659.25, at: 0.12, dur: 0.14, type: 'triangle', gain: 0.4 },
    { freq: 783.99, at: 0.24, dur: 0.14, type: 'triangle', gain: 0.4 },
    { freq: 1046.5, at: 0.36, dur: 0.5, type: 'sine', gain: 0.45 },
    { freq: 1318.5, at: 0.36, dur: 0.5, type: 'sine', gain: 0.2 },
  ],
}

export class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private volume = 0.6
  enabled = true

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.master) this.master.gain.value = this.volume * 0.5
  }

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const Ctor = window.AudioContext
      if (!Ctor) return null
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.volume * 0.5
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  play(name: SoundName) {
    if (!this.enabled || this.volume === 0) return
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const t0 = ctx.currentTime + 0.01
    if (name === 'flip') {
      const length = Math.floor(ctx.sampleRate * 0.05)
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3)
      const src = ctx.createBufferSource()
      src.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 2400
      filter.Q.value = 0.8
      const g = ctx.createGain()
      g.gain.value = 0.35
      src.connect(filter).connect(g).connect(this.master)
      src.start(t0)
      return
    }
    for (const tone of PATTERNS[name]) {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = tone.type
      osc.frequency.setValueAtTime(tone.freq, t0 + tone.at)
      if (tone.slideTo) osc.frequency.exponentialRampToValueAtTime(tone.slideTo, t0 + tone.at + tone.dur)
      g.gain.setValueAtTime(0.0001, t0 + tone.at)
      g.gain.exponentialRampToValueAtTime(tone.gain, t0 + tone.at + 0.012)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.at + tone.dur)
      osc.connect(g).connect(this.master)
      osc.start(t0 + tone.at)
      osc.stop(t0 + tone.at + tone.dur + 0.05)
    }
  }
}
