import type { Difficulty } from '@/missions/types/mission.types'
import type { AdditionQuestion } from '@/missions/modules/types'
import { shuffle } from '@/missions/modules/math/mathUtils'
import { generateAdditionQuestion } from '@/missions/modules/math/addition/generateQuestion'

export function generateAdditionSession(
  count: number,
  difficulty: Difficulty = 1,
): AdditionQuestion[] {
  const questions: AdditionQuestion[] = []
  const used = new Set<string>()

  let attempts = 0
  while (questions.length < count && attempts < count * 30) {
    const q = generateAdditionQuestion(difficulty)
    const key = `${q.augend}+${q.addend}`
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  return shuffle(questions)
}

export function getAdditionQuestionKey(q: AdditionQuestion): string {
  return `${q.augend}+${q.addend}`
}
