export type MissionType =
  | 'rhythmic-counting'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'opposites'
  | 'synonyms-homophones'
  | 'syllables'
  | 'seasons'
  | 'healthy-food'
  | 'algorithm'
  | 'shapes'
  | 'rhyme'
  | 'patterns'
  | 'days'
  | 'calendar-time'
  | 'missing-number'
  | 'odd-one-out'
  | 'riddles'
  | 'true-false'
  | 'story-order'
  | 'sequence-memory'
  | 'sudoku'
  | 'number-sudoku'
  | 'stub'

export type Subject = 'math' | 'turkish' | 'life' | 'logic'
export type Difficulty = 1 | 2 | 3
export type MissionStatus = 'pending' | 'active' | 'done'
export type LockReason = 'missions' | 'time' | null

export interface CompletionCriteria {
  minQuestions: number
  minAccuracy: number
}

export interface Mission {
  id: string
  type: MissionType
  subject: Subject
  title: string
  description?: string
  icon: string
  difficulty: Difficulty
  rewardStars: number
  estimatedMinutes: number
  completionCriteria: CompletionCriteria
}

export interface DailyMission {
  missionId: string
  order: number
  status: MissionStatus
  resolvedDifficulty: Difficulty
}

export interface RecentMissionEntry {
  missionId: string
  completedDate: string
}

export interface MissionProgress {
  missionId: string
  step: number
  correctCount: number
  wrongCount: number
  startedAt: string
  isCompleted: boolean
  timedOutBeforeComplete: boolean
}

export const SUBJECT_LABELS: Record<Subject, string> = {
  math: 'Matematik',
  turkish: 'Türkçe',
  life: 'Hayat Bilgisi',
  logic: 'Mantık',
}

export const SUBJECT_EMOJI: Record<Subject, string> = {
  math: '🔢',
  turkish: '📖',
  life: '🌍',
  logic: '🧩',
}

export const SUBJECT_CHIP_CLASS: Record<Subject, string> = {
  math: 'bg-sky-100 text-sky-800',
  turkish: 'bg-emerald-100 text-emerald-800',
  life: 'bg-amber-100 text-amber-800',
  logic: 'bg-purple-100 text-purple-800',
}
