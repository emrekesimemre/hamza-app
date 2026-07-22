import type { Difficulty } from '@/missions/types/mission.types'
import type { DaysQuestion, QuestionOption } from '@/missions/modules/types'

export const WEEK_DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
]

const WEEKENDS = ['Cumartesi', 'Pazar']
const WEEKDAYS_ONLY = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildDayOptions(correctDay: string): { options: QuestionOption[]; correctAnswer: number } {
  const distractors = shuffle(WEEK_DAYS.filter((day) => day !== correctDay)).slice(0, 2)
  const choices = shuffle([correctDay, ...distractors])
  const correctAnswer = choices.indexOf(correctDay)

  return {
    options: choices.map((label, value) => ({ value, label })),
    correctAnswer,
  }
}

function buildCountOptions(
  correct: number,
  pool: number[] = [1, 2, 3, 4, 5, 6, 7],
): { options: QuestionOption[]; correctAnswer: number } {
  const distractors = shuffle(pool.filter((n) => n !== correct)).slice(0, 2)
  const choices = shuffle([correct, ...distractors])
  const correctAnswer = choices.indexOf(correct)

  return {
    options: choices.map((label, value) => ({ value, label: String(label) })),
    correctAnswer,
  }
}

function buildOrderQuestion(): DaysQuestion {
  const shuffled = shuffle([...WEEK_DAYS])
  return {
    mode: 'order',
    prompt: 'Haftanın günlerini doğru sıraya koy!',
    days: shuffled,
    correctOrder: [],
    correctAnswer: 0,
    options: [],
  }
}

function buildNthDayQuestion(difficulty: Difficulty): DaysQuestion {
  const maxNth = difficulty >= 2 ? 7 : 4
  const nth = Math.floor(Math.random() * maxNth) + 1
  const correctDay = WEEK_DAYS[nth - 1]
  const { options, correctAnswer } = buildDayOptions(correctDay)

  return {
    mode: 'nth',
    prompt: `Haftanın ${nth}. günü hangisidir?`,
    correctAnswer,
    options,
  }
}

function buildAfterQuestion(): DaysQuestion {
  const dayIndex = Math.floor(Math.random() * WEEK_DAYS.length)
  const day = WEEK_DAYS[dayIndex]
  const correctDay = WEEK_DAYS[(dayIndex + 1) % WEEK_DAYS.length]
  const { options, correctAnswer } = buildDayOptions(correctDay)

  return {
    mode: 'after',
    prompt: `${day} gününden sonra hangi gün gelir?`,
    highlightDay: day,
    correctAnswer,
    options,
  }
}

function buildBeforeQuestion(): DaysQuestion {
  const dayIndex = Math.floor(Math.random() * WEEK_DAYS.length)
  const day = WEEK_DAYS[dayIndex]
  const correctDay = WEEK_DAYS[(dayIndex + WEEK_DAYS.length - 1) % WEEK_DAYS.length]
  const { options, correctAnswer } = buildDayOptions(correctDay)

  return {
    mode: 'before',
    prompt: `${day} gününden önce hangi gün gelir?`,
    highlightDay: day,
    correctAnswer,
    options,
  }
}

function buildFirstDayQuestion(): DaysQuestion {
  const { options, correctAnswer } = buildDayOptions('Pazartesi')
  return {
    mode: 'first',
    prompt: 'Haftanın ilk günü hangisidir?',
    correctAnswer,
    options,
  }
}

function buildLastDayQuestion(): DaysQuestion {
  const { options, correctAnswer } = buildDayOptions('Pazar')
  return {
    mode: 'last',
    prompt: 'Haftanın son günü hangisidir?',
    correctAnswer,
    options,
  }
}

function buildWeekendCountQuestion(): DaysQuestion {
  const { options, correctAnswer } = buildCountOptions(2)
  return {
    mode: 'weekend_count',
    prompt: 'Hafta sonu kaç gündür?',
    correctAnswer,
    options,
  }
}

function buildWeekdayCountQuestion(): DaysQuestion {
  const { options, correctAnswer } = buildCountOptions(5)
  return {
    mode: 'weekday_count',
    prompt: 'Hafta içi kaç gündür?',
    correctAnswer,
    options,
  }
}

function buildWhichWeekendQuestion(): DaysQuestion {
  const correctDay = WEEKENDS[Math.floor(Math.random() * WEEKENDS.length)]
  const distractors = shuffle(WEEKDAYS_ONLY).slice(0, 2)
  const choices = shuffle([correctDay, ...distractors])
  const correctAnswer = choices.indexOf(correctDay)

  return {
    mode: 'which_weekend',
    prompt: 'Hangisi hafta sonudur?',
    correctAnswer,
    options: choices.map((label, value) => ({ value, label })),
  }
}

function buildWhichWeekdayQuestion(): DaysQuestion {
  const correctDay = WEEKDAYS_ONLY[Math.floor(Math.random() * WEEKDAYS_ONLY.length)]
  const distractors = shuffle(WEEKENDS).slice(0, 2)
  const choices = shuffle([correctDay, ...distractors])
  const correctAnswer = choices.indexOf(correctDay)

  return {
    mode: 'which_weekday',
    prompt: 'Hangisi hafta içidir?',
    correctAnswer,
    options: choices.map((label, value) => ({ value, label })),
  }
}

type QuestionBuilder = (difficulty: Difficulty) => DaysQuestion

function getBuilders(difficulty: Difficulty): QuestionBuilder[] {
  const builders: QuestionBuilder[] = [
    buildOrderQuestion,
    buildNthDayQuestion,
    buildAfterQuestion,
    buildBeforeQuestion,
    buildWhichWeekendQuestion,
    buildWhichWeekdayQuestion,
  ]

  if (difficulty >= 2) {
    builders.push(
      buildFirstDayQuestion,
      buildLastDayQuestion,
      buildWeekendCountQuestion,
      buildWeekdayCountQuestion,
    )
  }

  return builders
}

export function generateDaysQuestion(difficulty: Difficulty = 1): DaysQuestion {
  const builders = getBuilders(difficulty)
  return builders[Math.floor(Math.random() * builders.length)](difficulty)
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
  if (q.mode === 'order') {
    return `order:${q.days?.join('|') ?? ''}`
  }
  return `${q.mode}:${q.prompt}`
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
