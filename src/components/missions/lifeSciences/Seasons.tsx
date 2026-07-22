import { useCallback, useState } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import type { SeasonsQuestion } from '@/missions/modules/types'
import {
  generateSeasonsSession,
  SEASON_ORDER,
} from '@/missions/modules/life/seasons/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useMissionStore } from '@/store/useMissionStore'
import { fireStarBurst } from '@/utils/confetti'
import { playSound } from '@/utils/sound'
import { SESSION_QUESTION_COUNT } from '@/missions/modules/types'

function SeasonsOrderRound({
  question,
  onDone,
}: {
  question: SeasonsQuestion
  onDone: (correct: boolean) => void
}) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)
  const [orderSlots, setOrderSlots] = useState<(number | null)[]>([null, null, null, null])
  const [showWrong, setShowWrong] = useState(false)
  const [locked, setLocked] = useState(false)

  const seasons = question.seasons ?? []

  const handleSeasonTap = (seasonIndex: number) => {
    if (locked || orderSlots.includes(seasonIndex)) return

    const nextSlot = orderSlots.findIndex((s) => s === null)
    if (nextSlot === -1) return

    const newSlots = [...orderSlots]
    newSlots[nextSlot] = seasonIndex
    setOrderSlots(newSlots)

    if (nextSlot === 3) {
      setLocked(true)
      const correct = SEASON_ORDER.every(
        (s, i) => seasons[newSlots[i]!]?.name === s.name,
      )

      if (correct) {
        recordAnswer(true)
        if (soundEnabled) playSound('correct')
        fireStarBurst()
        window.setTimeout(() => onDone(true), 800)
      } else {
        recordAnswer(false)
        if (soundEnabled) playSound('wrong')
        setShowWrong(true)
        window.setTimeout(() => {
          setShowWrong(false)
          setOrderSlots([null, null, null, null])
          setLocked(false)
          onDone(false)
        }, 1200)
      }
    }
  }

  return (
    <>
      <WrongFeedback visible={showWrong} />
      <div className="mb-4 flex justify-center gap-2">
        {orderSlots.map((slot, i) => (
          <div
            key={i}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 text-3xl"
          >
            {slot !== null ? seasons[slot]?.emoji : i + 1}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {seasons.map((season, i) => (
          <button
            key={`${season.name}-${i}`}
            type="button"
            onClick={() => handleSeasonTap(i)}
            disabled={locked || orderSlots.includes(i)}
            className="rounded-2xl bg-orange-50 py-4 text-lg font-bold text-orange-800 transition hover:bg-orange-100 active:scale-95 disabled:opacity-40"
          >
            {season.emoji} {season.name}
          </button>
        ))}
      </div>
    </>
  )
}

export function Seasons({ mission, difficulty, onComplete }: MissionModuleProps) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)

  const [questions] = useState<SeasonsQuestion[]>(() =>
    generateSeasonsSession(SESSION_QUESTION_COUNT, difficulty),
  )
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showWrong, setShowWrong] = useState(false)
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [answeredCorrectly, setAnsweredCorrectly] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [orderKey, setOrderKey] = useState(0)

  const question = questions[questionIndex]
  const isOrderMode = question.mode === 'order'

  const advanceQuestion = useCallback(() => {
    if (questionIndex + 1 >= SESSION_QUESTION_COUNT) {
      onComplete()
    } else {
      setQuestionIndex((i) => i + 1)
      setOrderKey((k) => k + 1)
      setSelectedValue(null)
      setAnsweredCorrectly(null)
      setLocked(false)
    }
  }, [questionIndex, onComplete])

  const handleAnswer = (value: number, correctAnswer: number) => {
    if (locked) return
    setSelectedValue(value)
    setLocked(true)

    if (value === correctAnswer) {
      recordAnswer(true)
      if (soundEnabled) playSound('correct')
      setAnsweredCorrectly(correctAnswer)
      fireStarBurst()
      window.setTimeout(advanceQuestion, 800)
    } else {
      recordAnswer(false)
      if (soundEnabled) playSound('wrong')
      setShowWrong(true)
      window.setTimeout(() => {
        setShowWrong(false)
        setSelectedValue(null)
        setLocked(false)
      }, 1200)
    }
  }

  const handleOrderDone = (correct: boolean) => {
    if (correct) advanceQuestion()
  }

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Mevsimleri öğren!</p>

      <MissionProgressBar current={questionIndex + 1} total={SESSION_QUESTION_COUNT} />

      <div className="mb-8 rounded-2xl bg-orange-50 p-6 text-center">
        {question.highlightEmoji && !isOrderMode && (
          <p className="mb-3 text-5xl">{question.highlightEmoji}</p>
        )}
        <p className="text-xl font-extrabold text-orange-800">{question.prompt}</p>
      </div>

      {isOrderMode ? (
        <SeasonsOrderRound key={orderKey} question={question} onDone={handleOrderDone} />
      ) : (
        <>
          <WrongFeedback visible={showWrong} />
          <OptionButtons
            options={question.options}
            onSelect={(value) => handleAnswer(value, question.correctAnswer)}
            disabled={locked}
            selectedValue={selectedValue}
            correctValue={answeredCorrectly}
          />
        </>
      )}
    </div>
  )
}
