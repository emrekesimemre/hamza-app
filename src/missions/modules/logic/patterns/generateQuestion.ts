import type { Difficulty } from '@/missions/types/mission.types'
import type { PatternsQuestion, QuestionOption } from '@/missions/modules/types'
import { buildNumericOptions, randomInt, shuffle } from '@/missions/modules/math/mathUtils'

type PatternDef = {
  id: string
  sequence: string[]
  next: string
  minDifficulty: Difficulty
}

const PATTERN_DEFS: PatternDef[] = [
  { id: 'abab-5', sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'], next: '🔵', minDifficulty: 1 },
  { id: 'abc-5', sequence: ['🐶', '🐱', '🐰', '🐶', '🐱'], next: '🐰', minDifficulty: 1 },
  {
    id: 'aab-6',
    sequence: ['🟡', '🟡', '🟢', '🟡', '🟡', '🟢'],
    next: '🟡',
    minDifficulty: 1,
  },
  { id: 'num-2a', sequence: ['2', '4', '6', '8'], next: '10', minDifficulty: 1 },
  { id: 'num-2b', sequence: ['3', '5', '7', '9'], next: '11', minDifficulty: 1 },

  { id: 'abc-6', sequence: ['🔺', '🟦', '🟨', '🔺', '🟦', '🟨'], next: '🔺', minDifficulty: 2 },
  {
    id: 'aabb-6',
    sequence: ['⭐', '⭐', '🌙', '🌙', '⭐', '⭐'],
    next: '🌙',
    minDifficulty: 2,
  },
  {
    id: 'abb-5',
    sequence: ['🍎', '🍊', '🍊', '🍎', '🍊'],
    next: '🍊',
    minDifficulty: 2,
  },
  { id: 'num-3a', sequence: ['4', '7', '10', '13'], next: '16', minDifficulty: 2 },
  { id: 'num-3b', sequence: ['6', '9', '12', '15'], next: '18', minDifficulty: 2 },
  {
    id: 'abab-7',
    sequence: ['🟢', '🟣', '🟢', '🟣', '🟢', '🟣', '🟢'],
    next: '🟣',
    minDifficulty: 2,
  },

  {
    id: 'abc-7',
    sequence: ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡', '🔴'],
    next: '🔵',
    minDifficulty: 3,
  },
  {
    id: 'aabbc-7',
    sequence: ['🦋', '🦋', '🌸', '🌸', '🌿', '🦋', '🦋'],
    next: '🌸',
    minDifficulty: 3,
  },
  { id: 'num-5a', sequence: ['5', '10', '15', '20'], next: '25', minDifficulty: 3 },
  { id: 'num-5b', sequence: ['10', '15', '20', '25'], next: '30', minDifficulty: 3 },
  {
    id: 'num-mix',
    sequence: ['2', '4', '7', '9', '12'],
    next: '14',
    minDifficulty: 3,
  },
  {
    id: 'abba-5',
    sequence: ['🟠', '🟣', '🟣', '🟠', '🟣'],
    next: '🟣',
    minDifficulty: 3,
  },
]

const EXTRA_EMOJIS = ['🔴', '🔵', '🟡', '🟢', '⭐', '🌙', '🔺', '🟦', '🍎', '🍊', '🐶', '🐱']

function patternsForDifficulty(difficulty: Difficulty): PatternDef[] {
  if (difficulty >= 3) {
    return PATTERN_DEFS.filter((p) => p.minDifficulty >= 2)
  }
  if (difficulty >= 2) {
    return PATTERN_DEFS.filter((p) => p.minDifficulty <= 2)
  }
  return PATTERN_DEFS.filter((p) => p.minDifficulty === 1)
}

function isNumericPattern(sequence: string[]): boolean {
  return sequence.every((item) => /^\d+$/.test(item))
}

function buildEmojiOptions(correct: string, sequence: string[]): QuestionOption[] {
  const fromSequence = [...new Set(sequence)]
  const distractors = new Set<string>()

  for (const symbol of shuffle(fromSequence)) {
    if (symbol !== correct) distractors.add(symbol)
    if (distractors.size >= 3) break
  }

  for (const symbol of shuffle(EXTRA_EMOJIS)) {
    if (symbol !== correct) distractors.add(symbol)
    if (distractors.size >= 3) break
  }

  const choices = shuffle([correct, ...Array.from(distractors).slice(0, 3)])
  return choices.map((label, value) => ({ value, label }))
}

function buildPatternOptions(correct: string, sequence: string[]): QuestionOption[] {
  if (isNumericPattern(sequence)) {
    const numericOptions = buildNumericOptions(Number(correct))
    return numericOptions.map((opt, index) => ({
      value: index,
      label: opt.label,
    }))
  }
  return buildEmojiOptions(correct, sequence)
}

export function generatePatternsQuestion(difficulty: Difficulty = 1): PatternsQuestion {
  const pool = patternsForDifficulty(difficulty)
  const pattern = pool[randomInt(0, pool.length - 1)]
  const options = buildPatternOptions(pattern.next, pattern.sequence)
  const correctAnswer = options.findIndex((opt) => opt.label === pattern.next)

  return {
    sequence: pattern.sequence,
    correctAnswer,
    options,
  }
}

export function generatePatternsSession(
  count: number,
  difficulty: Difficulty = 1,
): PatternsQuestion[] {
  const pool = patternsForDifficulty(difficulty)
  const questions: PatternsQuestion[] = []
  const used = new Set<string>()
  let attempts = 0

  while (questions.length < count && attempts < count * 40) {
    const pattern = pool[randomInt(0, pool.length - 1)]
    if (used.has(pattern.id)) {
      attempts += 1
      continue
    }

    const options = buildPatternOptions(pattern.next, pattern.sequence)
    const correctAnswer = options.findIndex((opt) => opt.label === pattern.next)

    used.add(pattern.id)
    questions.push({
      sequence: pattern.sequence,
      correctAnswer,
      options,
    })
    attempts += 1
  }

  while (questions.length < count) {
    questions.push(generatePatternsQuestion(difficulty))
  }

  return shuffle(questions)
}

export function getPatternsQuestionKey(q: PatternsQuestion): string {
  return q.sequence.join('|')
}
