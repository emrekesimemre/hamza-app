import { useCallback, useState } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import type { Direction } from '@/missions/modules/logic/algorithm/generateLevel'
import {
  generateAlgorithmLevel,
  simulateCommands,
} from '@/missions/modules/logic/algorithm/generateLevel'
import { useMissionStore } from '@/store/useMissionStore'
import { fireStarBurst } from '@/utils/confetti'
import { playSound } from '@/utils/sound'

const LEVEL_COUNT = 3
const DIRECTION_LABELS: Record<Direction, string> = {
  up: '⬇️ İleri',
  right: '➡️ Sağ',
  left: '⬅️ Sol',
}

export function Algorithm({ mission, onComplete }: MissionModuleProps) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)

  const [levelIndex, setLevelIndex] = useState(0)
  const [commands, setCommands] = useState<Direction[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [dinoPos, setDinoPos] = useState<{ row: number; col: number } | null>(null)
  const [showWrong, setShowWrong] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const level = generateAlgorithmLevel(levelIndex)

  const addCommand = (dir: Direction) => {
    if (isRunning || commands.length >= level.maxCommands) return
    setCommands((prev) => [...prev, dir])
  }

  const clearCommands = () => {
    if (isRunning) return
    setCommands([])
    setDinoPos(null)
    setShowWrong(false)
    setShowSuccess(false)
  }

  const runSimulation = useCallback(async () => {
    if (isRunning || commands.length === 0) return

    setIsRunning(true)
    setShowWrong(false)
    setShowSuccess(false)

    const result = simulateCommands(level, commands)

    for (const pos of result.path) {
      setDinoPos(pos)
      await new Promise((r) => setTimeout(r, 400))
    }

    setIsRunning(false)

    if (result.reachedGoal) {
      recordAnswer(true)
      if (soundEnabled) playSound('correct')
      fireStarBurst()
      setShowSuccess(true)

      await new Promise((r) => setTimeout(r, 1000))

      if (levelIndex + 1 >= LEVEL_COUNT) {
        onComplete()
      } else {
        setLevelIndex((i) => i + 1)
        setCommands([])
        setDinoPos(null)
        setShowSuccess(false)
      }
    } else {
      recordAnswer(false)
      if (soundEnabled) playSound('wrong')
      setShowWrong(true)
      await new Promise((r) => setTimeout(r, 1500))
      setDinoPos(null)
      setShowWrong(false)
    }
  }, [isRunning, commands, level, levelIndex, recordAnswer, soundEnabled, onComplete])

  const displayPos = dinoPos ?? level.start

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-1 text-center text-sm text-gray-500">
        Dinozoru yeme ulaştır! Seviye {levelIndex + 1}/{LEVEL_COUNT}
      </p>
      <p className="mb-4 text-center text-sm font-semibold text-sky-600">
        Hamle: {commands.length}/{level.maxCommands}
      </p>

      <div
        className="mx-auto mb-6 grid gap-1 rounded-2xl bg-green-100 p-2"
        style={{
          gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
          maxWidth: level.gridSize * 56,
        }}
      >
        {level.grid.map((row, r) =>
          row.map((cell, c) => {
            const isDino = displayPos.row === r && displayPos.col === c
            let content = ''
            if (isDino) content = '🦕'
            else if (cell === 'goal') content = '🍖'
            else if (cell === 'wall') content = '🪨'
            else if (cell === 'start' && !dinoPos) content = '🦕'

            return (
              <div
                key={`${r}-${c}`}
                className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-all duration-300 sm:h-14 sm:w-14 ${
                  cell === 'wall'
                    ? 'bg-stone-300'
                    : isDino
                      ? 'bg-yellow-200 scale-110'
                      : 'bg-green-50'
                }`}
              >
                {content}
              </div>
            )
          }),
        )}
      </div>

      <div className="mb-4 flex min-h-[48px] flex-wrap justify-center gap-2 rounded-2xl bg-gray-50 p-3">
        {commands.length === 0 ? (
          <span className="text-sm text-gray-400">Komutları seç...</span>
        ) : (
          commands.map((cmd, i) => (
            <span key={i} className="rounded-xl bg-sky-100 px-3 py-1 text-lg">
              {cmd === 'up' ? '⬇️' : cmd === 'right' ? '➡️' : '⬅️'}
            </span>
          ))
        )}
      </div>

      {showWrong && (
        <div className="mb-4 rounded-2xl bg-red-50 p-3 text-center font-bold text-red-600">
          Bir daha deneyelim! 💪
        </div>
      )}

      {showSuccess && (
        <div className="mb-4 rounded-2xl bg-green-50 p-3 text-center font-bold text-green-600">
          Harika! Yolu buldun! 🎉
        </div>
      )}

      <div className="mb-4 grid grid-cols-3 gap-2">
        {(Object.keys(DIRECTION_LABELS) as Direction[]).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => addCommand(dir)}
            disabled={isRunning || commands.length >= level.maxCommands}
            className="rounded-2xl bg-sky-100 py-3 text-sm font-bold text-sky-700 transition hover:bg-sky-200 active:scale-95 disabled:opacity-40"
          >
            {DIRECTION_LABELS[dir]}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={clearCommands}
          disabled={isRunning}
          className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold text-gray-600 transition hover:bg-gray-200 active:scale-95 disabled:opacity-40"
        >
          Temizle
        </button>
        <button
          type="button"
          onClick={() => void runSimulation()}
          disabled={isRunning || commands.length === 0}
          className="flex-1 rounded-2xl bg-grass py-4 font-bold text-white shadow-lg transition hover:bg-grass-dark active:scale-95 disabled:opacity-40"
        >
          {isRunning ? 'Koşuyor...' : '▶️ Çalıştır'}
        </button>
      </div>
    </div>
  )
}
