import { useCallback, useEffect, useState } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateSequenceMemoryQuestion,
  generateSequenceMemorySession,
  getSequenceMemoryQuestionKey,
} from '@/missions/modules/logic/sequenceMemory/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function SequenceMemory({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateSequenceMemorySession(count, difficulty).filter(
        (q) => !excludeKeys?.includes(getSequenceMemoryQuestionKey(q)),
      ),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateSequenceMemoryQuestion(difficulty),
    generateSession,
    getQuestionKey: getSequenceMemoryQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion
  const [revealing, setRevealing] = useState(true)

  useEffect(() => {
    setRevealing(true)
    const ms = difficulty >= 3 ? 2200 : difficulty >= 2 ? 2800 : 3500
    const timer = window.setTimeout(() => setRevealing(false), ms)
    return () => window.clearTimeout(timer)
  }, [question, difficulty])

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        {revealing ? 'Dikkatle izle ve hatırla!' : `${question.askIndex + 1}. sırada ne vardı?`}
      </p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <div className="mb-8 flex justify-center gap-2">
        {question.sequence.map((symbol, i) => (
          <div
            key={i}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl font-bold sm:h-16 sm:w-16 sm:text-3xl ${
              !revealing && i === question.askIndex
                ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-300'
                : 'border-sky-200 bg-sky-50'
            }`}
          >
            {revealing ? symbol : i === question.askIndex ? '?' : '·'}
          </div>
        ))}
      </div>

      {!revealing && (
        <OptionButtons
          options={question.options}
          onSelect={(value) => session.handleAnswer(value, question.correctAnswer)}
          disabled={session.locked}
          selectedValue={session.selectedValue}
          correctValue={session.answeredCorrectly}
        />
      )}
    </div>
  )
}
