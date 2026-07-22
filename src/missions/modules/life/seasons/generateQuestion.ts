import type { SeasonsQuestion, QuestionOption } from '@/missions/modules/types'
import type { Difficulty } from '@/missions/types/mission.types'

interface Season {
  name: string
  emoji: string
}

const SEASONS: Season[] = [
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

function nextIndex(index: number): number {
  return (index + 1) % SEASONS.length
}

function prevIndex(index: number): number {
  return (index + SEASONS.length - 1) % SEASONS.length
}

function buildOptions(correctSeason: Season): { options: QuestionOption[]; correctAnswer: number } {
  const distractors = shuffle(SEASONS.filter((s) => s.name !== correctSeason.name)).slice(0, 2)
  const choices = shuffle([correctSeason, ...distractors])
  const correctAnswer = choices.findIndex((s) => s.name === correctSeason.name)

  const options: QuestionOption[] = choices.map((season, index) => ({
    value: index,
    label: `${season.emoji} ${season.name}`,
  }))

  return { options, correctAnswer }
}

export function generateSeasonsQuestion(difficulty: Difficulty = 1): SeasonsQuestion {
  if (difficulty >= 2 && Math.random() > 0.4) {
    const shuffled = shuffle(SEASONS.map((_, i) => i))
    return {
      mode: 'order',
      prompt: 'Mevsimleri doğru sıraya koy!',
      seasons: shuffled.map((i) => SEASONS[i]),
      correctOrder: [0, 1, 2, 3].map(
        (target) => shuffled.indexOf(SEASONS.indexOf(SEASONS[target])),
      ),
      correctAnswer: 0,
      options: [],
    }
  }

  const seasonIndex = Math.floor(Math.random() * SEASONS.length)
  const season = SEASONS[seasonIndex]
  const questionType = Math.floor(Math.random() * 3)

  if (questionType === 0) {
    const correct = SEASONS[nextIndex(seasonIndex)]
    const { options, correctAnswer } = buildOptions(correct)
    return {
      mode: 'identify',
      prompt: `${season.emoji} ${season.name} mevsiminden sonra hangisi gelir?`,
      highlightEmoji: season.emoji,
      correctAnswer,
      options,
    }
  }

  if (questionType === 1) {
    const correct = SEASONS[prevIndex(seasonIndex)]
    const { options, correctAnswer } = buildOptions(correct)
    return {
      mode: 'identify',
      prompt: `${season.emoji} ${season.name} mevsiminden önce hangisi gelir?`,
      highlightEmoji: season.emoji,
      correctAnswer,
      options,
    }
  }

  const { options, correctAnswer } = buildOptions(season)
  return {
    mode: 'identify',
    prompt: 'Bu mevsim hangisidir?',
    highlightEmoji: season.emoji,
    correctAnswer,
    options,
  }
}

export function generateSeasonsSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): SeasonsQuestion[] {
  const questions: SeasonsQuestion[] = []
  const used = new Set(excludeKeys)
  let attempts = 0

  while (questions.length < count && attempts < count * 50) {
    const q = generateSeasonsQuestion(difficulty)
    const key = getSeasonsQuestionKey(q)
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  while (questions.length < count) {
    questions.push(generateSeasonsQuestion(difficulty))
  }

  return shuffle(questions)
}

export function getSeasonsQuestionKey(q: SeasonsQuestion): string {
  if (q.mode === 'order') {
    return `order:${q.seasons?.map((s) => s.name).join('|') ?? ''}`
  }
  return `identify:${q.prompt}`
}

export const SEASON_ORDER = SEASONS
