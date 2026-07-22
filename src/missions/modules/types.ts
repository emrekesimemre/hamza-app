import type { Difficulty, Mission } from '@/missions/types/mission.types'

export interface MissionModuleProps {
  mission: Mission
  difficulty: Difficulty
  onComplete: () => void
}

export interface QuestionOption {
  value: number
  label: string
}

export interface RhythmicCountingQuestion {
  step: number
  sequence: (number | null)[]
  missingIndex: number
  correctAnswer: number
  options: QuestionOption[]
}

export interface MultiplicationQuestion {
  multiplier: number
  multiplicand: number
  correctAnswer: number
  options: QuestionOption[]
}

export interface AdditionQuestion {
  augend: number
  addend: number
  correctAnswer: number
  options: QuestionOption[]
}

export interface SubtractionQuestion {
  minuend: number
  subtrahend: number
  correctAnswer: number
  options: QuestionOption[]
}

export interface AntonymsQuestion {
  promptWord: string
  correctWord: string
  correctAnswer: number
  options: QuestionOption[]
}

export interface HealthyFoodQuestion {
  emoji: string
  label: string
  isHealthy: boolean
  correctAnswer: number
}

export interface SyllablesQuestion {
  fullWord: string
  displayParts: (string | null)[]
  correctAnswer: number
  options: QuestionOption[]
}

export interface SeasonsQuestion {
  mode: 'identify' | 'order'
  prompt: string
  highlightEmoji?: string
  seasons?: { name: string; emoji: string }[]
  correctOrder?: number[]
  correctAnswer: number
  options: QuestionOption[]
}

export interface ShapesQuestion {
  shape: string
  emoji: string
  prompt: string
  correctAnswer: number
  options: QuestionOption[]
}

export interface RhymeQuestion {
  promptWord: string
  correctAnswer: number
  options: QuestionOption[]
}

export interface PatternsQuestion {
  sequence: string[]
  correctAnswer: number
  options: QuestionOption[]
}

export interface DaysQuestion {
  prompt: string
  days: string[]
  correctOrder: number[]
  correctAnswer: number
}

export interface CalendarTimeQuestion {
  prompt: string
  emoji: string
  category: 'time' | 'calendar' | 'season' | 'month'
  correctAnswer: number
  options: QuestionOption[]
}

export interface MissingNumberQuestion {
  prompt: string
  correctAnswer: number
  options: QuestionOption[]
}

export interface OddOneOutQuestion {
  prompt: string
  items: { emoji: string; label: string }[]
  correctAnswer: number
  options: QuestionOption[]
}

export interface RiddleQuestion {
  riddle: string
  correctAnswer: number
  options: QuestionOption[]
}

export interface TrueFalseQuestion {
  statement: string
  emoji: string
  isTrue: boolean
  correctAnswer: number
  options: QuestionOption[]
}

export interface StoryOrderQuestion {
  title: string
  steps: { emoji: string; label: string }[]
  correctAnswer: number
  options: QuestionOption[]
}

export interface SequenceMemoryQuestion {
  sequence: string[]
  askIndex: number
  correctAnswer: number
  options: QuestionOption[]
}

export interface SudokuQuestion {
  grid: (string | null)[][]
  solution: string[][]
  symbols: string[]
}

export const SESSION_QUESTION_COUNT = 5
export const BONUS_QUESTION_COUNT = 2
