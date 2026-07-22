import type { Difficulty } from '@/missions/types/mission.types'
import type { SubtractionQuestion } from '@/missions/modules/types'
import { shuffle } from '@/missions/modules/math/mathUtils'
import { generateSubtractionQuestion } from '@/missions/modules/math/subtraction/generateQuestion'

export function generateSubtractionSession(
  count: number,
  difficulty: Difficulty = 1,
): SubtractionQuestion[] {
  const questions: SubtractionQuestion[] = []
  const used = new Set<string>()

  let attempts = 0
  while (questions.length < count && attempts < count * 30) {
    const q = generateSubtractionQuestion(difficulty)
    const key = `${q.minuend}-${q.subtrahend}`
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  return shuffle(questions)
}

export function getSubtractionQuestionKey(q: SubtractionQuestion): string {
  return `${q.minuend}-${q.subtrahend}`
}
