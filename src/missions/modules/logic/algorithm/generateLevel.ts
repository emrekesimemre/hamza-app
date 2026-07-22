export type Direction = 'up' | 'right' | 'left'

export type CellType = 'empty' | 'wall' | 'start' | 'goal'

export interface GridPosition {
  row: number
  col: number
}

export interface AlgorithmLevel {
  gridSize: number
  grid: CellType[][]
  start: GridPosition
  goal: GridPosition
  maxCommands: number
}

export interface SimulationResult {
  success: boolean
  path: GridPosition[]
  reachedGoal: boolean
}

const DIRECTION_DELTAS: Record<Direction, GridPosition> = {
  up: { row: 1, col: 0 },
  right: { row: 0, col: 1 },
  left: { row: 0, col: -1 },
}

export function generateAlgorithmLevel(levelIndex: number): AlgorithmLevel {
  if (levelIndex === 0) {
    return {
      gridSize: 3,
      grid: [
        ['start', 'empty', 'empty'],
        ['wall', 'empty', 'empty'],
        ['empty', 'empty', 'goal'],
      ],
      start: { row: 0, col: 0 },
      goal: { row: 2, col: 2 },
      maxCommands: 5,
    }
  }

  if (levelIndex === 1) {
    return {
      gridSize: 3,
      grid: [
        ['start', 'empty', 'wall'],
        ['empty', 'empty', 'empty'],
        ['wall', 'empty', 'goal'],
      ],
      start: { row: 0, col: 0 },
      goal: { row: 2, col: 2 },
      maxCommands: 6,
    }
  }

  return {
    gridSize: 4,
    grid: [
      ['start', 'empty', 'empty', 'empty'],
      ['wall', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'wall', 'empty'],
      ['empty', 'empty', 'empty', 'goal'],
    ],
    start: { row: 0, col: 0 },
    goal: { row: 3, col: 3 },
    maxCommands: 8,
  }
}

function isInBounds(pos: GridPosition, size: number): boolean {
  return pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size
}

function isWalkable(grid: CellType[][], pos: GridPosition): boolean {
  const cell = grid[pos.row][pos.col]
  return cell !== 'wall'
}

export function simulateCommands(
  level: AlgorithmLevel,
  commands: Direction[],
): SimulationResult {
  const path: GridPosition[] = [{ ...level.start }]
  let current = { ...level.start }

  for (const command of commands) {
    const delta = DIRECTION_DELTAS[command]
    const next = { row: current.row + delta.row, col: current.col + delta.col }

    if (!isInBounds(next, level.gridSize) || !isWalkable(level.grid, next)) {
      break
    }

    current = next
    path.push({ ...current })

    if (current.row === level.goal.row && current.col === level.goal.col) {
      return { success: true, path, reachedGoal: true }
    }
  }

  const reachedGoal =
    current.row === level.goal.row && current.col === level.goal.col

  return { success: reachedGoal, path, reachedGoal }
}

export function validatePath(level: AlgorithmLevel, commands: Direction[]): boolean {
  return simulateCommands(level, commands).reachedGoal
}
