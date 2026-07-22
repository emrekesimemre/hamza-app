import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateHealthyFoodQuestion,
  generateHealthyFoodSession,
  getHealthyFoodQuestionKey,
} from '@/missions/modules/life/healthyFood/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function HealthyChoices({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateHealthyFoodSession(count, difficulty, excludeKeys ?? []),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateHealthyFoodQuestion(difficulty),
    generateSession,
    getQuestionKey: getHealthyFoodQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion

  const handleBasketSelect = (basketIndex: number) => {
    session.handleAnswer(basketIndex, question.correctAnswer)
  }

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Yiyeceği doğru sepete koy!</p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <div className="mb-8 rounded-2xl bg-yellow-50 p-8 text-center">
        <p className="text-7xl">{question.emoji}</p>
        <p className="mt-3 text-2xl font-extrabold text-gray-800">{question.label}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleBasketSelect(0)}
          disabled={session.locked}
          className={`rounded-3xl border-4 p-6 transition active:scale-95 disabled:opacity-60 ${
            session.selectedValue === 0
              ? session.answeredCorrectly === 0
                ? 'border-green-400 bg-green-50'
                : 'border-red-400 bg-red-50'
              : 'border-green-200 bg-green-50 hover:border-green-400'
          }`}
        >
          <p className="text-5xl">🧺</p>
          <p className="mt-2 font-extrabold text-green-700">Sağlıklı</p>
        </button>

        <button
          type="button"
          onClick={() => handleBasketSelect(1)}
          disabled={session.locked}
          className={`rounded-3xl border-4 p-6 transition active:scale-95 disabled:opacity-60 ${
            session.selectedValue === 1
              ? session.answeredCorrectly === 1
                ? 'border-green-400 bg-green-50'
                : 'border-red-400 bg-red-50'
              : 'border-red-200 bg-red-50 hover:border-red-400'
          }`}
        >
          <p className="text-5xl">🗑️</p>
          <p className="mt-2 font-extrabold text-red-700">Sağlıksız</p>
        </button>
      </div>
    </div>
  )
}
