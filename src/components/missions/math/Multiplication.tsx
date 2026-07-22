import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateMultiplicationQuestion,
  generateMultiplicationSession,
  getMultiplicationQuestionKey,
} from '@/missions/modules/math/multiplication/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function Multiplication({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateMultiplicationSession(count, difficulty).filter(
        (q) => !excludeKeys?.includes(getMultiplicationQuestionKey(q)),
      ),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateMultiplicationQuestion(difficulty),
    generateSession,
    getQuestionKey: getMultiplicationQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion
  const showGroups = question.multiplicand <= 5 && question.multiplier <= 5

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">2 ve 3&apos;ün çarpım tablosu!</p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      {showGroups ? (
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          {Array.from({ length: question.multiplicand }).map((_, groupIndex) => (
            <div
              key={groupIndex}
              className="rounded-2xl border-2 border-green-200 bg-green-50 p-3"
            >
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from({ length: question.multiplier }).map((_, appleIndex) => (
                  <span key={appleIndex} className="text-3xl">
                    🍎
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-6 text-center text-lg font-bold text-green-800">
          {question.multiplicand} grup · her grupta {question.multiplier} tane
        </p>
      )}

      <p className="mb-6 text-center text-4xl font-extrabold text-gray-800">
        {question.multiplier} × {question.multiplicand} = ?
      </p>

      <OptionButtons
        options={question.options}
        onSelect={(value) => session.handleAnswer(value, question.correctAnswer)}
        disabled={session.locked}
        selectedValue={session.selectedValue}
        correctValue={session.answeredCorrectly}
      />
    </div>
  )
}
