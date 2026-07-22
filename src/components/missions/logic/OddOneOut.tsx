import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateOddOneOutQuestion,
  generateOddOneOutSession,
  getOddOneOutQuestionKey,
} from '@/missions/modules/logic/oddOneOut/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function OddOneOut({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateOddOneOutSession(count, difficulty, excludeKeys ?? []),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateOddOneOutQuestion(difficulty),
    generateSession,
    getQuestionKey: getOddOneOutQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">{question.prompt}</p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.items.map((item, i) => (
          <button
            key={`${item.emoji}-${i}`}
            type="button"
            disabled={session.locked}
            onClick={() => session.handleAnswer(i, question.correctAnswer)}
            className={`rounded-2xl border-2 p-4 transition active:scale-95 disabled:opacity-60 ${
              session.selectedValue === i && session.answeredCorrectly === question.correctAnswer
                ? 'border-green-400 bg-green-100'
                : session.selectedValue === i
                  ? 'border-orange-400 bg-orange-100'
                  : 'border-violet-200 bg-violet-50 hover:border-violet-400'
            }`}
          >
            <span className="text-4xl">{item.emoji}</span>
            <p className="mt-1 text-xs font-bold text-gray-600">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
