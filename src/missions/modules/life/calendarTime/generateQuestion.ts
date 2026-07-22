import type { Difficulty } from '@/missions/types/mission.types'
import type { CalendarTimeQuestion, QuestionOption } from '@/missions/modules/types'

const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

const SEASONS = [
  { name: 'İlkbahar', emoji: '🌸' },
  { name: 'Yaz', emoji: '☀️' },
  { name: 'Sonbahar', emoji: '🍂' },
  { name: 'Kış', emoji: '❄️' },
]

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function numericQuestion(
  category: CalendarTimeQuestion['category'],
  emoji: string,
  prompt: string,
  correct: number,
  distractors: number[],
): CalendarTimeQuestion {
  const others = shuffle(distractors.filter((d) => d !== correct)).slice(0, 2)
  const values = shuffle([correct, ...others])
  const options: QuestionOption[] = values.map((value, index) => ({
    value: index,
    label: String(value),
  }))
  return {
    category,
    emoji,
    prompt,
    correctAnswer: values.indexOf(correct),
    options,
  }
}

function labelQuestion(
  category: CalendarTimeQuestion['category'],
  emoji: string,
  prompt: string,
  correctLabel: string,
  distractorLabels: string[],
  formatLabel?: (label: string) => string,
): CalendarTimeQuestion {
  const uniqueDistractors = [...new Set(distractorLabels.filter((d) => d !== correctLabel))]
  let choices = shuffle([correctLabel, ...uniqueDistractors])

  if (choices.length < 3) {
    const extras = MONTHS.filter((m) => !choices.includes(m))
    choices = shuffle([...choices, ...extras]).slice(0, 3)
  } else {
    choices = choices.slice(0, 3)
  }

  const format = formatLabel ?? ((label: string) => label)
  const options: QuestionOption[] = choices.map((label, index) => ({
    value: index,
    label: format(label),
  }))

  return {
    category,
    emoji,
    prompt,
    correctAnswer: choices.indexOf(correctLabel),
    options,
  }
}

type QuestionFactory = () => CalendarTimeQuestion

const FACTORIES: QuestionFactory[] = [
  () =>
    numericQuestion('calendar', '📅', 'Bir haftada kaç gün vardır?', 7, [5, 6, 10]),

  () =>
    numericQuestion('season', '🌍', 'Bir yılda kaç mevsim vardır?', 4, [3, 2, 12]),

  () =>
    numericQuestion('month', '🗓️', 'Bir yılda kaç ay vardır?', 12, [10, 11, 14]),

  () =>
    numericQuestion('time', '⏱️', '1 dakika kaç saniyedir?', 60, [30, 45, 100]),

  () =>
    numericQuestion('time', '🕐', '1 saat kaç dakikadır?', 60, [30, 45, 100]),

  () =>
    numericQuestion('calendar', '📆', 'Bir yılda kaç gün vardır?', 365, [360, 350, 400]),

  () =>
    numericQuestion('calendar', '🌙', 'Bir ayda yaklaşık kaç gün vardır?', 30, [7, 15, 60]),

  () =>
    numericQuestion('time', '☀️', 'Bir günde kaç saat vardır?', 24, [12, 20, 30]),

  () =>
    numericQuestion('calendar', '📅', 'Ocak ayında kaç gün vardır?', 31, [28, 30, 29]),

  () =>
    numericQuestion('calendar', '📅', 'Şubat ayında kaç gün vardır?', 28, [30, 31, 29]),

  () => {
    const monthIndex = Math.floor(Math.random() * (MONTHS.length - 1))
    const month = MONTHS[monthIndex]
    const nextMonth = MONTHS[monthIndex + 1]
    return labelQuestion(
      'month',
      '🗓️',
      `${month} ayından sonra hangi ay gelir?`,
      nextMonth,
      [MONTHS[monthIndex + 2] ?? MONTHS[0], MONTHS[monthIndex - 1] ?? MONTHS[11]],
    )
  },

  () => {
    const seasonIndex = Math.floor(Math.random() * SEASONS.length)
    const season = SEASONS[seasonIndex]
    const nextSeason = SEASONS[(seasonIndex + 1) % SEASONS.length]
    const distractors = SEASONS.filter(
      (s) => s.name !== nextSeason.name && s.name !== season.name,
    ).map((s) => s.name)
    return labelQuestion(
      'season',
      season.emoji,
      `${season.emoji} ${season.name} mevsiminden sonra hangisi gelir?`,
      nextSeason.name,
      distractors,
      (name) => {
        const s = SEASONS.find((item) => item.name === name)!
        return `${s.emoji} ${s.name}`
      },
    )
  },

  () => {
    const season = SEASONS[Math.floor(Math.random() * SEASONS.length)]
    const distractors = SEASONS.filter((s) => s.name !== season.name).map((s) => s.name)
    return labelQuestion(
      'season',
      season.emoji,
      `${season.emoji} Bu mevsim hangisidir?`,
      season.name,
      distractors.slice(0, 2),
      (name) => {
        const s = SEASONS.find((item) => item.name === name)!
        return `${s.emoji} ${s.name}`
      },
    )
  },
]

const DIFFICULTY_POOL: Record<Difficulty, number[]> = {
  1: [0, 1, 2, 3, 6],
  2: [0, 1, 2, 3, 4, 5, 6, 10, 11],
  3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
}

export function generateCalendarTimeQuestion(difficulty: Difficulty = 1): CalendarTimeQuestion {
  const pool = DIFFICULTY_POOL[difficulty]
  const factoryIndex = pool[Math.floor(Math.random() * pool.length)]
  return FACTORIES[factoryIndex]()
}

export function generateCalendarTimeSession(
  count: number,
  difficulty: Difficulty = 1,
  excludePrompts: string[] = [],
): CalendarTimeQuestion[] {
  const pool = shuffle([...DIFFICULTY_POOL[difficulty]])
  const questions: CalendarTimeQuestion[] = []
  const usedPrompts = new Set(excludePrompts)

  for (const factoryIndex of pool) {
    if (questions.length >= count) break
    const question = FACTORIES[factoryIndex]()
    if (usedPrompts.has(question.prompt)) continue
    questions.push(question)
    usedPrompts.add(question.prompt)
  }

  let attempts = 0
  while (questions.length < count && attempts < 40) {
    const question = generateCalendarTimeQuestion(difficulty)
    if (!usedPrompts.has(question.prompt)) {
      questions.push(question)
      usedPrompts.add(question.prompt)
    }
    attempts += 1
  }

  return questions
}

export { MONTHS, SEASONS }
