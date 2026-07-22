export type SoundType = 'correct' | 'wrong' | 'complete' | 'streak'

interface Note {
  freq: number
  startOffset: number
  duration: number
  type: OscillatorType
  volume: number
  /** İkinci bir oscillator aynı anda harmonik ekler */
  harmonic?: { freq: number; type: OscillatorType; volume: number }
}

/**
 * Eğlenceli çocuk oyunu ses efektleri.
 *
 * correct  → Neşeli üçlü "ding ding ding!" yükselen arpej
 * wrong    → Kısa, nazik "bwamp" — cezalandırıcı değil
 * complete → 5 notlu zafer fanfarı, katmanlı harmonik
 * streak   → Retro video oyunu "süper kombo" yükselen run
 */
const SOUND_PATTERNS: Record<SoundType, Note[]> = {
  correct: [
    { freq: 784, startOffset: 0,    duration: 0.10, type: 'triangle', volume: 0.22 },
    { freq: 1047, startOffset: 0.09, duration: 0.10, type: 'triangle', volume: 0.22 },
    {
      freq: 1319, startOffset: 0.18, duration: 0.20, type: 'triangle', volume: 0.26,
      harmonic: { freq: 1568, type: 'sine', volume: 0.09 },
    },
  ],

  wrong: [
    { freq: 349, startOffset: 0,    duration: 0.14, type: 'sawtooth', volume: 0.13 },
    { freq: 262, startOffset: 0.12, duration: 0.20, type: 'sawtooth', volume: 0.10 },
  ],

  complete: [
    { freq: 523,  startOffset: 0,    duration: 0.11, type: 'triangle', volume: 0.20 },
    { freq: 659,  startOffset: 0.10, duration: 0.11, type: 'triangle', volume: 0.21 },
    { freq: 784,  startOffset: 0.20, duration: 0.11, type: 'triangle', volume: 0.22 },
    { freq: 1047, startOffset: 0.31, duration: 0.11, type: 'triangle', volume: 0.23 },
    {
      freq: 1319, startOffset: 0.44, duration: 0.38, type: 'triangle', volume: 0.27,
      harmonic: { freq: 1047, type: 'sine', volume: 0.13 },
    },
  ],

  streak: [
    { freq: 784,  startOffset: 0,     duration: 0.07, type: 'square', volume: 0.14 },
    { freq: 880,  startOffset: 0.065, duration: 0.07, type: 'square', volume: 0.14 },
    { freq: 988,  startOffset: 0.130, duration: 0.07, type: 'square', volume: 0.14 },
    { freq: 1047, startOffset: 0.195, duration: 0.07, type: 'square', volume: 0.15 },
    { freq: 1175, startOffset: 0.260, duration: 0.07, type: 'square', volume: 0.15 },
    { freq: 1319, startOffset: 0.325, duration: 0.10, type: 'triangle', volume: 0.20 },
    {
      freq: 1568, startOffset: 0.390, duration: 0.28, type: 'triangle', volume: 0.24,
      harmonic: { freq: 1976, type: 'sine', volume: 0.09 },
    },
  ],
}

let audioContext: AudioContext | null = null

function getContext(): AudioContext {
  audioContext ??= new AudioContext()
  return audioContext
}

function playNote(note: Note, baseTime: number): void {
  const ctx = getContext()
  const startTime = baseTime + note.startOffset

  const playOsc = (freq: number, type: OscillatorType, volume: number): void => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.value = freq

    // Soft attack + exponential decay
    gain.gain.setValueAtTime(0.001, startTime)
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(startTime + note.duration + 0.01)
  }

  playOsc(note.freq, note.type, note.volume)

  if (note.harmonic) {
    playOsc(note.harmonic.freq, note.harmonic.type, note.harmonic.volume)
  }
}

export function playSound(type: SoundType): void {
  try {
    const ctx = getContext()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }
    const now = ctx.currentTime
    SOUND_PATTERNS[type].forEach((note) => playNote(note, now))
  } catch {
    // Ses API kullanılabilir değil
  }
}
