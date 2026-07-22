import type { Difficulty, MissionType } from '@/missions/types/mission.types'
import type { ProgressLog } from '@/types/progress.types'

const ALL_MISSION_TYPES: MissionType[] = [
  'rhythmic-counting',
  'addition',
  'subtraction',
  'multiplication',
  'opposites',
  'synonyms-homophones',
  'syllables',
  'seasons',
  'healthy-food',
  'algorithm',
  'shapes',
  'rhyme',
  'patterns',
  'days',
  'calendar-time',
  'missing-number',
  'odd-one-out',
  'riddles',
  'true-false',
  'story-order',
  'sequence-memory',
  'sudoku',
  'number-sudoku',
  'stub',
]

export function createDefaultDifficultyMap(): Record<MissionType, Difficulty> {
  return ALL_MISSION_TYPES.reduce(
    (acc, type) => {
      acc[type] = 1
      return acc
    },
    {} as Record<MissionType, Difficulty>,
  )
}

export function resolveDifficulty(
  type: MissionType,
  difficultyByType: Record<MissionType, Difficulty>,
): Difficulty {
  return difficultyByType[type] ?? 1
}

export function adjustDifficulty(
  type: MissionType,
  currentLevel: Difficulty,
  progressLogs: ProgressLog[],
): Difficulty {
  const recent = progressLogs
    .filter((log) => log.missionType === type)
    .slice(-5)

  if (recent.length === 0) return currentLevel

  let correct = 0
  let total = 0
  for (const log of recent) {
    correct += log.correctCount
    total += log.correctCount + log.wrongCount
  }

  if (total === 0) return currentLevel

  const accuracy = correct / total

  if (accuracy >= 0.8 && currentLevel < 3) {
    return (currentLevel + 1) as Difficulty
  }

  if (accuracy < 0.5 && currentLevel > 1) {
    return (currentLevel - 1) as Difficulty
  }

  return currentLevel
}
