import type { Difficulty } from '@/missions/types/mission.types'
import type { RhythmicCountingQuestion } from '@/missions/modules/types'
import { buildNumericOptions, randomInt, shuffle } from '@/missions/modules/math/mathUtils'

const GRADE2_STEPS = [2, 3, 5, 10]

function pickStep(difficulty: Difficulty): number {
  if (difficulty >= 3) return randomInt(2, 10)
  if (difficulty >= 2) return randomInt(2, 7)
  return GRADE2_STEPS[randomInt(0, GRADE2_STEPS.length - 1)]
}

function sequenceLength(difficulty: Difficulty): number {
  return difficulty >= 3 ? 6 : 5
}

function maxStart(difficulty: Difficulty, step: number): number {
  const length = sequenceLength(difficulty)
  const maxEnd =
    difficulty >= 3 ? 120 : difficulty >= 2 ? 70 : 50
  const maxStartValue = maxEnd - (length - 1) * step
  return Math.max(step, Math.floor(maxStartValue / step) * step)
}

export function generateRhythmicQuestion(difficulty: Difficulty = 1): RhythmicCountingQuestion {
  const step = pickStep(difficulty)
  const length = sequenceLength(difficulty)
  const startMax = maxStart(difficulty, step)
  const start = randomInt(1, Math.max(1, Math.floor(startMax / step))) * step
  const missingIndex = randomInt(1, length - 2)

  const sequence: (number | null)[] = Array.from({ length }, (_, i) =>
    i === missingIndex ? null : start + i * step,
  )

  const correctAnswer = start + missingIndex * step

  return {
    step,
    sequence,
    missingIndex,
    correctAnswer,
    options: buildNumericOptions(correctAnswer),
  }
}

export function generateRhythmicSession(
  count: number,
  difficulty: Difficulty = 1,
): RhythmicCountingQuestion[] {
  const questions: RhythmicCountingQuestion[] = []
  const used = new Set<string>()

  let attempts = 0
  while (questions.length < count && attempts < count * 30) {
    const q = generateRhythmicQuestion(difficulty)
    const key = `${q.step}:${q.sequence.map((v) => v ?? '?').join(',')}`
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  return shuffle(questions)
}

export function getRhythmicQuestionKey(q: RhythmicCountingQuestion): string {
  return `${q.step}:${q.sequence.map((v) => v ?? '?').join(',')}`
}
