import { useState } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import { generateAntonymsMatchSession } from '@/missions/modules/turkish/antonyms/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useMissionStore } from '@/store/useMissionStore'
import { fireStarBurst } from '@/utils/confetti'
import { playSound } from '@/utils/sound'
import { SESSION_QUESTION_COUNT } from '@/missions/modules/types'

export function Antonyms({ mission, onComplete }: MissionModuleProps) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)

  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds] = useState(() => generateAntonymsMatchSession(SESSION_QUESTION_COUNT))
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matchedLeft, setMatchedLeft] = useState<Set<number>>(new Set())
  const [showWrong, setShowWrong] = useState(false)
  const [locked, setLocked] = useState(false)

  const currentRound = rounds[roundIndex]
  const leftWords = currentRound.pairs.map(([a]) => a)
  const rightWords = [...currentRound.pairs.map(([, b]) => b)].sort(() => Math.random() - 0.5)

  const handleRightSelect = (rightIndex: number) => {
    if (locked || selectedLeft === null) return

    const leftWord = leftWords[selectedLeft]
    const rightWord = rightWords[rightIndex]
    const pair = currentRound.pairs.find(([a]) => a === leftWord)
    const isCorrect = pair?.[1] === rightWord

    setLocked(true)

    if (isCorrect) {
      recordAnswer(true)
      if (soundEnabled) playSound('correct')
      fireStarBurst()
      const newMatched = new Set(matchedLeft)
      newMatched.add(selectedLeft)
      setMatchedLeft(newMatched)
      setSelectedLeft(null)

      window.setTimeout(() => {
        if (newMatched.size >= 3) {
          if (roundIndex + 1 >= SESSION_QUESTION_COUNT) {
            onComplete()
          } else {
            setRoundIndex((i) => i + 1)
            setMatchedLeft(new Set())
            setSelectedLeft(null)
          }
        }
        setLocked(false)
      }, 800)
    } else {
      recordAnswer(false)
      if (soundEnabled) playSound('wrong')
      setShowWrong(true)
      window.setTimeout(() => {
        setShowWrong(false)
        setSelectedLeft(null)
        setLocked(false)
      }, 1200)
    }
  }

  const progress = { current: roundIndex + 1, total: SESSION_QUESTION_COUNT }

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Zıt kelimeleri eşleştir!</p>

      <MissionProgressBar current={progress.current} total={progress.total} />
      <WrongFeedback visible={showWrong} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-center text-xs font-bold uppercase text-purple-500">Kelime</p>
          {leftWords.map((word, i) => (
            <button
              key={word}
              type="button"
              onClick={() => !matchedLeft.has(i) && !locked && setSelectedLeft(i)}
              disabled={matchedLeft.has(i) || locked}
              className={`w-full rounded-2xl py-4 text-lg font-extrabold transition active:scale-95 disabled:opacity-50 ${
                matchedLeft.has(i)
                  ? 'bg-green-100 text-green-700 line-through'
                  : selectedLeft === i
                    ? 'bg-purple-200 text-purple-800 ring-2 ring-purple-400'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              {word}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-center text-xs font-bold uppercase text-sky-500">Zıt Anlam</p>
          {rightWords.map((word, i) => (
            <button
              key={`${word}-${i}`}
              type="button"
              onClick={() => handleRightSelect(i)}
              disabled={selectedLeft === null || locked}
              className="w-full rounded-2xl bg-sky-50 py-4 text-lg font-extrabold text-sky-800 transition hover:bg-sky-100 active:scale-95 disabled:opacity-40"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
