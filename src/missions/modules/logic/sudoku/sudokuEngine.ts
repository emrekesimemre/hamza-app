import type { Difficulty } from '@/missions/types/mission.types'
import type { SudokuQuestion } from '@/missions/modules/types'
import { shuffle } from '@/missions/modules/math/mathUtils'

export interface SudokuConfig {
  size: number
  boxHeight: number
  boxWidth: number
  symbols: string[]
  givensForDifficulty: (difficulty: Difficulty) => number
}

function isValid(
  grid: (string | null)[][],
  row: number,
  col: number,
  sym: string,
  config: SudokuConfig,
): boolean {
  const { size, boxHeight, boxWidth } = config

  for (let c = 0; c < size; c += 1) {
    if (grid[row][c] === sym) return false
  }
  for (let r = 0; r < size; r += 1) {
    if (grid[r][col] === sym) return false
  }

  const br = Math.floor(row / boxHeight) * boxHeight
  const bc = Math.floor(col / boxWidth) * boxWidth
  for (let r = br; r < br + boxHeight; r += 1) {
    for (let c = bc; c < bc + boxWidth; c += 1) {
      if (grid[r][c] === sym) return false
    }
  }
  return true
}

function fillGrid(grid: (string | null)[][], config: SudokuConfig): boolean {
  const { size, symbols } = config

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row][col]) continue
      for (const sym of shuffle([...symbols])) {
        if (!isValid(grid, row, col, sym, config)) continue
        grid[row][col] = sym
        if (fillGrid(grid, config)) return true
        grid[row][col] = null
      }
      return false
    }
  }
  return true
}

function generateSolution(config: SudokuConfig): string[][] {
  const { size } = config
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  fillGrid(grid, config)
  return grid as string[][]
}

function cloneGrid(grid: string[][]): (string | null)[][] {
  return grid.map((row) => [...row])
}

function countSolutions(puzzle: (string | null)[][], config: SudokuConfig, limit = 2): number {
  let count = 0

  function solve(): void {
    if (count >= limit) return
    for (let row = 0; row < config.size; row += 1) {
      for (let col = 0; col < config.size; col += 1) {
        if (puzzle[row][col]) continue
        for (const sym of config.symbols) {
          if (!isValid(puzzle, row, col, sym, config)) continue
          puzzle[row][col] = sym
          solve()
          puzzle[row][col] = null
          if (count >= limit) return
        }
        return
      }
    }
    count += 1
  }

  solve()
  return count
}

export function generateSudokuQuestionWithConfig(
  config: SudokuConfig,
  difficulty: Difficulty = 1,
): SudokuQuestion {
  const { size, symbols } = config
  const givens = config.givensForDifficulty(difficulty)
  const removeCount = size * size - givens

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const solution = generateSolution(config)
    const puzzle = cloneGrid(solution)
    const cells = shuffle(
      Array.from({ length: size * size }, (_, i) => ({
        row: Math.floor(i / size),
        col: i % size,
      })),
    )

    const removed: { row: number; col: number }[] = []
    for (const cell of cells.slice(0, removeCount)) {
      puzzle[cell.row][cell.col] = null
      removed.push(cell)
    }

    if (removed.length === 0) continue
    if (countSolutions(puzzle.map((r) => [...r]), config) !== 1) continue

    return {
      grid: puzzle,
      solution,
      symbols,
    }
  }

  const solution = generateSolution(config)
  const puzzle = cloneGrid(solution)
  puzzle[size - 1][size - 1] = null

  return {
    grid: puzzle,
    solution,
    symbols,
  }
}

export function generateSudokuSessionWithConfig(
  config: SudokuConfig,
  count: number,
  difficulty: Difficulty = 1,
): SudokuQuestion[] {
  const questions: SudokuQuestion[] = []
  const used = new Set<string>()
  let attempts = 0
  while (questions.length < count && attempts < count * 50) {
    const q = generateSudokuQuestionWithConfig(config, difficulty)
    const key = q.grid.flat().join('')
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }
  return shuffle(questions)
}

export function getSudokuQuestionKeyFromQuestion(q: SudokuQuestion): string {
  return q.grid.flat().join('')
}

export function isSudokuGridComplete(
  userGrid: (string | null)[][],
  solution: string[][],
): boolean {
  for (let row = 0; row < solution.length; row += 1) {
    for (let col = 0; col < solution[row].length; col += 1) {
      if (userGrid[row][col] !== solution[row][col]) return false
    }
  }
  return true
}

export function isSudokuGridFilled(grid: (string | null)[][]): boolean {
  return grid.every((row) => row.every((cell) => cell !== null))
}
