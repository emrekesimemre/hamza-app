import type { Difficulty } from '@/missions/types/mission.types'
import type { SudokuQuestion } from '@/missions/modules/types'
import {
  generateSudokuQuestionWithConfig,
  generateSudokuSessionWithConfig,
  getSudokuQuestionKeyFromQuestion,
  type SudokuConfig,
} from '@/missions/modules/logic/sudoku/sudokuEngine'

export const SUDOKU_SYMBOLS = ['🔴', '🟡', '🔵', '🟢']

const COLOR_SUDOKU_CONFIG: SudokuConfig = {
  size: 4,
  boxHeight: 2,
  boxWidth: 2,
  symbols: SUDOKU_SYMBOLS,
  givensForDifficulty: (difficulty) => {
    if (difficulty >= 3) return 5
    if (difficulty >= 2) return 6
    return 7
  },
}

export function generateSudokuQuestion(difficulty: Difficulty = 1): SudokuQuestion {
  return generateSudokuQuestionWithConfig(COLOR_SUDOKU_CONFIG, difficulty)
}

export function generateSudokuSession(count: number, difficulty: Difficulty = 1): SudokuQuestion[] {
  return generateSudokuSessionWithConfig(COLOR_SUDOKU_CONFIG, count, difficulty)
}

export function getSudokuQuestionKey(q: SudokuQuestion): string {
  return getSudokuQuestionKeyFromQuestion(q)
}
