import type { Difficulty } from '@/missions/types/mission.types'
import type { MultiplicationQuestion } from '@/missions/modules/types'
import { buildNumericOptions, randomInt, shuffle } from '@/missions/modules/math/mathUtils'

/** 2. sınıf: ×2 ve ×3 tabloları — tablo sayısı her zaman solda (2×5, 3×4) */
const TABLES = [2, 3] as const

function pickFactor(difficulty: Difficulty): number {
  if (difficulty >= 3) return randomInt(2, 10)
  if (difficulty >= 2) return randomInt(2, 8)
  return randomInt(2, 6)
}

export function generateMultiplicationQuestion(difficulty: Difficulty = 1): MultiplicationQuestion {
  /** Tablo: 2 veya 3 (gösterimde sol) */
  const multiplier = TABLES[randomInt(0, TABLES.length - 1)]
  /** Kaç kez / kaçlı gruplar (gösterimde sağ) */
  const multiplicand = pickFactor(difficulty)
  const correctAnswer = multiplier * multiplicand

  return {
    multiplier,
    multiplicand,
    correctAnswer,
    options: buildNumericOptions(correctAnswer),
  }
}

/** Oturumda aynı çarpım tekrar etmesin */
export function generateMultiplicationSession(
  count: number,
  difficulty: Difficulty = 1,
): MultiplicationQuestion[] {
  const questions: MultiplicationQuestion[] = []
  const used = new Set<string>()

  let attempts = 0
  while (questions.length < count && attempts < count * 30) {
    const q = generateMultiplicationQuestion(difficulty)
    const key = `${q.multiplier}x${q.multiplicand}`
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  return shuffle(questions)
}

export function getMultiplicationQuestionKey(q: MultiplicationQuestion): string {
  return `${q.multiplier}x${q.multiplicand}`
}
