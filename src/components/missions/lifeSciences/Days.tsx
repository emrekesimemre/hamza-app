import { useState } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateDaysSession,
  validateDayOrder,
  WEEK_DAYS,
} from '@/missions/modules/life/days/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useMissionStore } from '@/store/useMissionStore'
import { fireStarBurst } from '@/utils/confetti'
import { playSound } from '@/utils/sound'
import { SESSION_QUESTION_COUNT } from '@/missions/modules/types'

export function Days({ mission, onComplete }: MissionModuleProps) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)

  const [questions] = useState(() => generateDaysSession(SESSION_QUESTION_COUNT))
  const [roundIndex, setRoundIndex] = useState(0)
  const [orderSlots, setOrderSlots] = useState<(number | null)[]>(
    Array(WEEK_DAYS.length).fill(null),
  )
  const [showWrong, setShowWrong] = useState(false)
  const [locked, setLocked] = useState(false)

  const question = questions[roundIndex]
  const days = question.days

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
        window.setTimeout(() => {
          if (roundIndex + 1 >= SESSION_QUESTION_COUNT) {
            onComplete()
          } else {
            setRoundIndex((i) => i + 1)
            setOrderSlots(Array(WEEK_DAYS.length).fill(null))
            setLocked(false)
          }
        }, 800)
      } else {
        recordAnswer(false)
        if (soundEnabled) playSound('wrong')
        setShowWrong(true)
        window.setTimeout(() => {
          setShowWrong(false)
          setOrderSlots(Array(WEEK_DAYS.length).fill(null))
          setLocked(false)
        }, 1200)
      }
    }
  }

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">{question.prompt}</p>

      <MissionProgressBar current={roundIndex + 1} total={SESSION_QUESTION_COUNT} />
      <WrongFeedback visible={showWrong} />

      <div className="mb-4 space-y-1">
        {orderSlots.map((slot, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50 px-4 py-2"
          >
            <span className="w-6 text-sm font-bold text-teal-600">{i + 1}.</span>
            <span className="font-bold text-teal-800">
              {slot !== null ? days[slot] : '...'}
            </span>
          </div>
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
    </div>
  )
}
