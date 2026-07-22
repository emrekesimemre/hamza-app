import type { QuestionOption } from '@/missions/modules/types'

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function hasCarry(a: number, b: number): boolean {
  return (a % 10) + (b % 10) >= 10
}

export function needsBorrow(minuend: number, subtrahend: number): boolean {
  return (minuend % 10) < (subtrahend % 10)
}

/** Büyük sayılar için ±10 gibi daha zor çeldiriciler */
export function buildNumericOptions(correctAnswer: number): QuestionOption[] {
  const distractors = new Set<number>()
  const spread =
    correctAnswer >= 50
      ? [1, -1, 10, -10, 2, -2]
      : correctAnswer >= 20
        ? [1, -1, 10, -10, 2]
        : [1, -1, 2, -2, 3]

  for (const delta of spread) {
    const candidate = correctAnswer + delta
    if (candidate >= 0 && candidate !== correctAnswer && distractors.size < 2) {
      distractors.add(candidate)
    }
  }

  let offset = 4
  while (distractors.size < 2) {
    const candidate = correctAnswer + offset
    if (candidate >= 0 && candidate !== correctAnswer) distractors.add(candidate)
    offset += 1
  }

  return shuffle([correctAnswer, ...distractors]).map((value) => ({
    value,
    label: String(value),
  }))
}
