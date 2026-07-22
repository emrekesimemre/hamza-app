import type { Difficulty } from '@/missions/types/mission.types'
import type { ShapesQuestion, QuestionOption } from '@/missions/modules/types'
import { randomInt, shuffle } from '@/missions/modules/math/mathUtils'

const SHAPES = [
  { name: 'Üçgen', emoji: '🔺', corners: 3, sides: 3 },
  { name: 'Kare', emoji: '🟦', corners: 4, sides: 4 },
  { name: 'Dikdörtgen', emoji: '▭', corners: 4, sides: 4 },
  { name: 'Beşgen', emoji: '⬠', corners: 5, sides: 5 },
  { name: 'Altıgen', emoji: '⬡', corners: 6, sides: 6 },
  { name: 'Daire', emoji: '⭕', corners: 0, sides: 0 },
]

type ShapeEntry = (typeof SHAPES)[number]

function buildCountOptions(correctAnswer: number): QuestionOption[] {
  const pool = [0, 1, 2, 3, 4, 5, 6, 8].filter((n) => n !== correctAnswer)
  const distractors = shuffle(pool).slice(0, 2)
  return shuffle([correctAnswer, ...distractors]).map((v) => ({
    value: v,
    label: String(v),
  }))
}

function nameQuestion(shape: ShapeEntry): ShapesQuestion {
  const distractors = shuffle(SHAPES.filter((s) => s.name !== shape.name)).slice(0, 2)
  const choices = shuffle([shape, ...distractors])
  const correctAnswer = choices.findIndex((s) => s.name === shape.name)

  return {
    shape: shape.name,
    emoji: shape.emoji,
    prompt: 'Bu şeklin adı nedir?',
    correctAnswer,
    options: choices.map((s, i) => ({
      value: i,
      label: s.name,
    })),
  }
}

function cornerQuestion(shape: ShapeEntry): ShapesQuestion {
  return {
    shape: shape.name,
    emoji: shape.emoji,
    prompt: `${shape.emoji} ${shape.name} kaç köşelidir?`,
    correctAnswer: shape.corners,
    options: buildCountOptions(shape.corners),
  }
}

function sideQuestion(shape: ShapeEntry): ShapesQuestion {
  return {
    shape: shape.name,
    emoji: shape.emoji,
    prompt: `${shape.emoji} ${shape.name} kaç kenarı vardır?`,
    correctAnswer: shape.sides,
    options: buildCountOptions(shape.sides),
  }
}

function compareCornerQuestion(): ShapesQuestion {
  const withCorners = SHAPES.filter((s) => s.corners > 0)
  const target = withCorners[randomInt(0, withCorners.length - 1)]
  const distractors = shuffle(withCorners.filter((s) => s.corners !== target.corners)).slice(0, 2)
  const choices = shuffle([target, ...distractors])
  const correctAnswer = choices.findIndex((s) => s.name === target.name)

  return {
    shape: target.name,
    emoji: target.emoji,
    prompt: `Hangisinin ${target.corners} köşesi vardır?`,
    correctAnswer,
    options: choices.map((s, i) => ({
      value: i,
      label: s.name,
    })),
  }
}

export function generateShapesQuestion(difficulty: Difficulty = 1): ShapesQuestion {
  const shape = SHAPES[randomInt(0, SHAPES.length - 1)]
  const roll = Math.random()

  if (difficulty >= 3) {
    if (roll < 0.35) return compareCornerQuestion()
    if (roll < 0.65 && shape.sides > 0) return sideQuestion(shape)
    if (shape.corners > 0) return cornerQuestion(shape)
    return nameQuestion(shape)
  }

  if (difficulty >= 2) {
    if (roll < 0.45 && shape.sides > 0) return sideQuestion(shape)
    if (shape.corners > 0) return cornerQuestion(shape)
    return nameQuestion(shape)
  }

  if (roll < 0.4) return nameQuestion(shape)
  if (shape.corners > 0) return cornerQuestion(shape)
  return nameQuestion(shape)
}

export function generateShapesSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): ShapesQuestion[] {
  const questions: ShapesQuestion[] = []
  const used = new Set(excludeKeys)
  let attempts = 0

  while (questions.length < count && attempts < count * 50) {
    const q = generateShapesQuestion(difficulty)
    const key = getShapesQuestionKey(q)
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  while (questions.length < count) {
    questions.push(generateShapesQuestion(difficulty))
  }

  return shuffle(questions)
}

export function getShapesQuestionKey(q: ShapesQuestion): string {
  return `${q.prompt}:${q.emoji}`
}
