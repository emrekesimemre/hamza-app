import { useEffect, useMemo, useState } from 'react'
import type { SudokuQuestion } from '@/missions/modules/types'
import {
  isSudokuGridComplete,
  isSudokuGridFilled,
} from '@/missions/modules/logic/sudoku/sudokuEngine'

interface SudokuBoardProps {
  question: SudokuQuestion
  disabled?: boolean
  onSubmit: (isCorrect: boolean) => void
  instruction: string
  cellClass?: string
}

function boxBorderClass(row: number, col: number, boxHeight: number, boxWidth: number, size: number): string {
  let classes = ''

  if (col % boxWidth === boxWidth - 1 && col < size - 1) {
    classes += ' border-r-2 border-gray-600'
  }
  if (row % boxHeight === boxHeight - 1 && row < size - 1) {
    classes += ' border-b-2 border-gray-600'
  }

  return classes
}

function clonePuzzleGrid(grid: (string | null)[][]): (string | null)[][] {
  return grid.map((row) => [...row])
}

export function SudokuBoard({
  question,
  disabled = false,
  onSubmit,
  instruction,
  cellClass = 'h-14 w-14 text-2xl sm:h-16 sm:w-16 sm:text-3xl',
}: SudokuBoardProps) {
  const size = question.grid.length
  const boxHeight = 2
  const boxWidth = size === 6 ? 3 : 2

  const [userGrid, setUserGrid] = useState(() => clonePuzzleGrid(question.grid))
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    setUserGrid(clonePuzzleGrid(question.grid))
    setSelectedCell(null)
  }, [question])

  const isGiven = useMemo(
    () => question.grid.map((row) => row.map((cell) => cell !== null)),
    [question.grid],
  )

  const allFilled = isSudokuGridFilled(userGrid)

  const handleCellClick = (row: number, col: number) => {
    if (disabled || isGiven[row][col]) return
    setSelectedCell({ row, col })
  }

  const handleSymbolSelect = (symbol: string) => {
    if (disabled || !selectedCell) return

    const { row, col } = selectedCell
    if (isGiven[row][col]) return

    setUserGrid((prev) => {
      const next = prev.map((r) => [...r])
      next[row][col] = symbol
      return next
    })
  }

  const handleClearCell = () => {
    if (disabled || !selectedCell) return

    const { row, col } = selectedCell
    if (isGiven[row][col]) return

    setUserGrid((prev) => {
      const next = prev.map((r) => [...r])
      next[row][col] = null
      return next
    })
  }

  const handleCheck = () => {
    if (disabled || !allFilled) return
    onSubmit(isSudokuGridComplete(userGrid, question.solution))
  }

  const symbolButtonClass =
    size >= 6
      ? 'rounded-2xl py-4 text-xl font-extrabold shadow-md transition active:scale-95 disabled:opacity-60 sm:text-2xl'
      : 'rounded-2xl py-5 text-3xl font-extrabold shadow-md transition active:scale-95 disabled:opacity-60'

  return (
    <>
      <p className="mb-6 text-center text-sm text-gray-500">{instruction}</p>

      <div className="mb-6 flex justify-center overflow-x-auto">
        <div
          className="inline-grid gap-1 rounded-xl border-4 border-gray-800 bg-gray-800 p-1"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {userGrid.map((row, r) =>
            row.map((cell, c) => {
              const given = isGiven[r][c]
              const isSelected = selectedCell?.row === r && selectedCell?.col === c

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  disabled={disabled || given}
                  onClick={() => handleCellClick(r, c)}
                  className={`flex items-center justify-center font-extrabold tabular-nums ${cellClass}${boxBorderClass(r, c, boxHeight, boxWidth, size)} ${
                    isSelected
                      ? 'bg-yellow-100 ring-2 ring-yellow-400'
                      : given
                        ? 'bg-white text-gray-800'
                        : cell
                          ? 'bg-sky-50 text-sky-900'
                          : 'bg-gray-100 text-gray-400'
                  } ${given ? 'cursor-default' : 'cursor-pointer hover:bg-sky-100'}`}
                >
                  {cell ?? ''}
                </button>
              )
            }),
          )}
        </div>
      </div>

      <div className={`mb-4 grid gap-2 ${size >= 6 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {question.symbols.map((symbol) => (
          <button
            key={symbol}
            type="button"
            disabled={disabled || !selectedCell}
            onClick={() => handleSymbolSelect(symbol)}
            className={`${symbolButtonClass} bg-sky-100 text-sky-800 hover:bg-sky-200`}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled || !selectedCell || isGiven[selectedCell.row][selectedCell.col]}
          onClick={handleClearCell}
          className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-600 transition hover:bg-gray-200 active:scale-95 disabled:opacity-40"
        >
          Sil
        </button>
        <button
          type="button"
          disabled={disabled || !allFilled}
          onClick={handleCheck}
          className="flex-2 rounded-2xl bg-grass py-4 font-bold text-white shadow-lg transition hover:bg-grass-dark active:scale-95 disabled:opacity-40"
        >
          Kontrol Et
        </button>
      </div>
    </>
  )
}
