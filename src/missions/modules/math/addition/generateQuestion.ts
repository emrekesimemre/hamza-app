import type { Difficulty } from '@/missions/types/mission.types'
import type { AdditionQuestion } from '@/missions/modules/types'
import {
  buildNumericOptions,
  hasCarry,
  randomInt,
} from '@/missions/modules/math/mathUtils'

/** 2. sınıf: eldesiz 20–60, eldeli 100'e kadar */
function pickOperands(
  difficulty: Difficulty,
  requireCarry: boolean,
): { augend: number; addend: number } {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    let augend: number
    let addend: number

    if (difficulty >= 3) {
      augend = randomInt(28, 89)
      addend = randomInt(11, 100 - augend)
    } else if (difficulty >= 2) {
      augend = randomInt(18, 72)
      addend = randomInt(9, Math.min(48, 100 - augend))
    } else {
      augend = randomInt(12, 38)
      addend = randomInt(6, Math.min(28, 60 - augend))
    }

    const sum = augend + addend
    if (difficulty >= 2 && sum > 100) continue
    if (difficulty === 1 && sum > 60) continue
    if (requireCarry && !hasCarry(augend, addend)) continue
    if (!requireCarry && hasCarry(augend, addend) && difficulty === 1 && Math.random() > 0.25) {
      continue
    }

    return { augend, addend }
  }

  return { augend: 27, addend: 15 }
}

export function generateAdditionQuestion(difficulty: Difficulty = 1): AdditionQuestion {
  const requireCarry = difficulty >= 2 ? Math.random() > 0.25 : Math.random() > 0.65
  const { augend, addend } = pickOperands(difficulty, requireCarry)
  const correctAnswer = augend + addend

  return {
    augend,
    addend,
    correctAnswer,
    options: buildNumericOptions(correctAnswer),
  }
}
