import type { Difficulty } from '@/missions/types/mission.types'
import type { SequenceMemoryQuestion } from '@/missions/modules/types'
import { randomInt, shuffle } from '@/missions/modules/math/mathUtils'

const POOL = ['🔴', '🟡', '🔵', '🟢', '🟣', '🟠', '⭐', '❤️']

function sequenceLength(difficulty: Difficulty): number {
  if (difficulty >= 3) return 5
  if (difficulty >= 2) return 4
  return 3
}

export function generateSequenceMemoryQuestion(difficulty: Difficulty = 1): SequenceMemoryQuestion {
  const len = sequenceLength(difficulty)
  const symbols = shuffle([...POOL]).slice(0, 4)
  const sequence: string[] = []
  for (let i = 0; i < len; i += 1) {
    sequence.push(symbols[randomInt(0, symbols.length - 1)])
  }

  const askIndex = randomInt(0, len - 1)
  const correctSymbol = sequence[askIndex]
  const distractors = shuffle(symbols.filter((s) => s !== correctSymbol)).slice(0, 2)
  const options = shuffle([correctSymbol, ...distractors]).map((label, value) => ({
    value,
    label,
  }))
  const correctAnswer = options.findIndex((o) => o.label === correctSymbol)

  return {
    sequence,
    askIndex,
    correctAnswer,
    options,
  }
}

export function generateSequenceMemorySession(
  count: number,
  difficulty: Difficulty = 1,
): SequenceMemoryQuestion[] {
  const questions: SequenceMemoryQuestion[] = []
  const used = new Set<string>()
  let attempts = 0
  while (questions.length < count && attempts < count * 40) {
    const q = generateSequenceMemoryQuestion(difficulty)
    const key = `${q.sequence.join('')}:${q.askIndex}`
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }
  return shuffle(questions)
}

export function getSequenceMemoryQuestionKey(q: SequenceMemoryQuestion): string {
  return `${q.sequence.join('')}:${q.askIndex}`
}
