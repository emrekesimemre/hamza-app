type SoundType = 'correct' | 'wrong' | 'complete' | 'streak'

const frequencies: Record<SoundType, number[]> = {
  correct: [523, 659],
  wrong: [330, 262],
  complete: [523, 659, 784],
  streak: [523, 659, 784, 1047],
}

let audioContext: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function playTone(freq: number, startTime: number, duration = 0.12): void {
  const ctx = getContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = freq
  gain.gain.setValueAtTime(0.15, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + duration)
}

export function playSound(type: SoundType): void {
  try {
    const ctx = getContext()
    if (ctx.state === 'suspended') {
      void ctx.resume()
    }
    const now = ctx.currentTime
    frequencies[type].forEach((freq, i) => {
      playTone(freq, now + i * 0.1)
    })
  } catch {
    // Audio not available
  }
}
