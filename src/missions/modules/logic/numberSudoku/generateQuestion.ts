import type { Difficulty } from '@/missions/types/mission.types'
import type { SudokuQuestion } from '@/missions/modules/types'
import {
  generateSudokuQuestionWithConfig,
  generateSudokuSessionWithConfig,
  getSudokuQuestionKeyFromQuestion,
  type SudokuConfig,
} from '@/missions/modules/logic/sudoku/sudokuEngine'

export const NUMBER_SUDOKU_SYMBOLS = ['1', '2', '3', '4', '5', '6']

const NUMBER_SUDOKU_CONFIG: SudokuConfig = {
  size: 6,
  boxHeight: 2,
  boxWidth: 3,
  symbols: NUMBER_SUDOKU_SYMBOLS,
  givensForDifficulty: (difficulty) => {
    if (difficulty >= 3) return 14
    if (difficulty >= 2) return 17
    return 20
  },
}

export function generateNumberSudokuQuestion(difficulty: Difficulty = 1): SudokuQuestion {
  return generateSudokuQuestionWithConfig(NUMBER_SUDOKU_CONFIG, difficulty)
}

export function generateNumberSudokuSession(
  count: number,
  difficulty: Difficulty = 1,
): SudokuQuestion[] {
  return generateSudokuSessionWithConfig(NUMBER_SUDOKU_CONFIG, count, difficulty)
}

export function getNumberSudokuQuestionKey(q: SudokuQuestion): string {
  return getSudokuQuestionKeyFromQuestion(q)
}
