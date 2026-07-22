import confetti from 'canvas-confetti'

export function fireConfetti(): void {
  const duration = 2000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ffd43b', '#51cf66', '#4dabf7', '#ff8787', '#9775fa'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ffd43b', '#51cf66', '#4dabf7', '#ff8787', '#9775fa'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  frame()
}

export function fireStarBurst(): void {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ffd43b', '#fab005'],
  })
}
