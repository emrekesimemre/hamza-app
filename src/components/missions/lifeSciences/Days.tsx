import { useCallback, useState } from 'react'
import type { DaysQuestion, MissionModuleProps } from '@/missions/modules/types'
import {
  generateDaysSession,
  validateDayOrder,
  WEEK_DAYS,
} from '@/missions/modules/life/days/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useMissionStore } from '@/store/useMissionStore'
import { fireStarBurst } from '@/utils/confetti'
import { playSound } from '@/utils/sound'
import { SESSION_QUESTION_COUNT } from '@/missions/modules/types'

function DaysOrderRound({
  question,
  onDone,
}: {
  question: DaysQuestion
  onDone: (correct: boolean) => void
}) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)
  const [orderSlots, setOrderSlots] = useState<(number | null)[]>(
    Array(WEEK_DAYS.length).fill(null),
  )
  const [showWrong, setShowWrong] = useState(false)
  const [locked, setLocked] = useState(false)

  const days = question.days ?? []

  const lastFilledSlotIndex = orderSlots.reduce<number>(
    (last, slot, index) => (slot !== null ? index : last),
    -1,
  )
  const hasPlacements = lastFilledSlotIndex >= 0

  const handleUndo = () => {
    if (locked || !hasPlacements) return

    const newSlots = [...orderSlots]
    newSlots[lastFilledSlotIndex] = null
    setOrderSlots(newSlots)
  }

  const handleSlotTap = (slotIndex: number) => {
    if (locked || orderSlots[slotIndex] === null) return

    const newSlots = [...orderSlots]
    for (let i = slotIndex; i < newSlots.length; i += 1) {
      newSlots[i] = null
    }
    setOrderSlots(newSlots)
  }

  const handleDayTap = (dayIndex: number) => {
    if (locked || orderSlots.includes(dayIndex)) return

    const nextSlot = orderSlots.findIndex((s) => s === null)
    if (nextSlot === -1) return

    const newSlots = [...orderSlots]
    newSlots[nextSlot] = dayIndex
    setOrderSlots(newSlots)

    if (nextSlot === WEEK_DAYS.length - 1) {
      setLocked(true)
      const correct = validateDayOrder(newSlots, days)

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
          onDone(false)
        }, 1200)
      }
    }
  }

  return (
    <>
      <WrongFeedback visible={showWrong} />
      {hasPlacements && !locked && (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={handleUndo}
            className="rounded-xl bg-teal-100 px-4 py-2 text-sm font-bold text-teal-800 transition hover:bg-teal-200 active:scale-95"
          >
            ↩ Geri al
          </button>
        </div>
      )}
      <div className="mb-4 space-y-1">
        {orderSlots.map((slot, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSlotTap(i)}
            disabled={locked || slot === null}
            className={`flex w-full items-center gap-2 rounded-xl border-2 border-dashed px-4 py-2 text-left transition ${
              slot !== null
                ? 'cursor-pointer border-teal-300 bg-teal-100 hover:bg-teal-200 active:scale-[0.99] disabled:cursor-default disabled:hover:bg-teal-100'
                : 'cursor-default border-teal-200 bg-teal-50'
            }`}
          >
            <span className="w-6 text-sm font-bold text-teal-600">{i + 1}.</span>
            <span className="font-bold text-teal-800">
              {slot !== null ? days[slot] : '...'}
            </span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {days.map((day, i) => (
          <button
            key={`${day}-${i}`}
            type="button"
            onClick={() => handleDayTap(i)}
            disabled={locked || orderSlots.includes(i)}
            className="rounded-2xl bg-teal-100 py-3 text-sm font-bold text-teal-800 transition hover:bg-teal-200 active:scale-95 disabled:opacity-40"
          >
            {day}
          </button>
        ))}
      </div>
    </>
  )
}

export function Days({ mission, difficulty, onComplete }: MissionModuleProps) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)

  const [questions] = useState<DaysQuestion[]>(() =>
    generateDaysSession(SESSION_QUESTION_COUNT, difficulty),
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
        advanceQuestion()
      }, 1200)
    }
  }

  const handleOrderDone = () => {
    advanceQuestion()
  }

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Haftanın günlerini öğren!</p>

      <MissionProgressBar current={questionIndex + 1} total={SESSION_QUESTION_COUNT} />

      <div className="mb-8 rounded-2xl bg-teal-50 p-6 text-center">
        {question.highlightDay && !isOrderMode && (
          <p className="mb-3 text-2xl font-extrabold text-teal-700">{question.highlightDay}</p>
        )}
        <p className="text-xl font-extrabold leading-snug text-teal-900">{question.prompt}</p>
      </div>

      {isOrderMode ? (
        <DaysOrderRound key={orderKey} question={question} onDone={handleOrderDone} />
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
