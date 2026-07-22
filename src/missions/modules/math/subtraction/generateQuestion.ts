import type { SubtractionQuestion } from '@/missions/modules/types'
import type { Difficulty } from '@/missions/types/mission.types'
import {
  buildNumericOptions,
  needsBorrow,
  randomInt,
} from '@/missions/modules/math/mathUtils'

/** 2. sınıf: onluk bozmadan / onluk bozarak 100'e kadar */
function pickOperands(
  difficulty: Difficulty,
  requireBorrow: boolean,
): { minuend: number; subtrahend: number } {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    let minuend: number
    let subtrahend: number

    if (difficulty >= 3) {
      minuend = randomInt(45, 99)
      subtrahend = randomInt(12, minuend - 5)
    } else if (difficulty >= 2) {
      minuend = randomInt(32, 99)
      subtrahend = randomInt(8, minuend - 4)
    } else {
      minuend = randomInt(22, 58)
      subtrahend = randomInt(5, minuend - 3)
    }

    const correctAnswer = minuend - subtrahend
    if (correctAnswer < 3) continue
    if (requireBorrow && !needsBorrow(minuend, subtrahend)) continue
    if (!requireBorrow && needsBorrow(minuend, subtrahend) && difficulty === 1 && Math.random() > 0.3) {
      continue
    }

    return { minuend, subtrahend }
  }

  return { minuend: 52, subtrahend: 17 }
}

export function generateSubtractionQuestion(difficulty: Difficulty = 1): SubtractionQuestion {
  const requireBorrow = difficulty >= 2 ? Math.random() > 0.2 : Math.random() > 0.6
  const { minuend, subtrahend } = pickOperands(difficulty, requireBorrow)
  const correctAnswer = minuend - subtrahend

  return {
    minuend,
    subtrahend,
    correctAnswer,
    options: buildNumericOptions(correctAnswer),
  }
}
