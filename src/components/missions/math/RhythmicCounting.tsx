import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateRhythmicQuestion,
  generateRhythmicSession,
  getRhythmicQuestionKey,
} from '@/missions/modules/math/rhythmicCounting/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function RhythmicCounting({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateRhythmicSession(count, difficulty).filter(
        (q) => !excludeKeys?.includes(getRhythmicQuestionKey(q)),
      ),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateRhythmicQuestion(difficulty),
    generateSession,
    getQuestionKey: getRhythmicQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        {question.step}&apos;er ritmik say — eksik vagonu bul!
      </p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max items-center justify-center gap-2 px-2">
          {question.sequence.map((value, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 text-2xl font-extrabold transition-all sm:h-20 sm:w-20 sm:text-3xl ${
                  value === null
                    ? 'scale-105 border-yellow-400 bg-yellow-50 text-yellow-600'
                    : session.answeredCorrectly !== null && index === question.missingIndex
                      ? 'border-green-400 bg-green-100 text-green-700'
                      : 'border-sky-300 bg-sky-50 text-sky-800'
                }`}
              >
                {value === null ? '?' : value}
              </div>
              {index < question.sequence.length - 1 && (
                <span className="mx-1 text-xl text-gray-300">—</span>
              )}
            </div>
          ))}
        </div>
      </div>

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
