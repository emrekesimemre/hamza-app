import type { Difficulty } from '@/missions/types/mission.types'
import type { DaysQuestion } from '@/missions/modules/types'

export const WEEK_DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function generateDaysQuestion(_difficulty: Difficulty = 1): DaysQuestion {
  const shuffled = shuffle([...WEEK_DAYS])
  return {
    prompt: 'Haftanın günlerini doğru sıraya koy!',
    days: shuffled,
    correctOrder: [],
    correctAnswer: 0,
  }
}

export function generateDaysSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): DaysQuestion[] {
  const questions: DaysQuestion[] = []
  const used = new Set(excludeKeys)
  let attempts = 0

  while (questions.length < count && attempts < count * 50) {
    const q = generateDaysQuestion(difficulty)
    const key = getDaysQuestionKey(q)
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  while (questions.length < count) {
    questions.push(generateDaysQuestion(difficulty))
  }

  return shuffle(questions)
}

export function getDaysQuestionKey(q: DaysQuestion): string {
  return q.days.join('|')
}

export function validateDayOrder(
  slotSelections: (number | null)[],
  shuffledDays: string[],
): boolean {
  if (slotSelections.some((s) => s === null)) return false
  return WEEK_DAYS.every(
    (day, slotIndex) => shuffledDays[slotSelections[slotIndex]!] === day,
  )
}
