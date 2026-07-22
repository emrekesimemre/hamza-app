import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateStoryOrderQuestion,
  generateStoryOrderSession,
  getStoryOrderQuestionKey,
} from '@/missions/modules/logic/storyOrder/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function StoryOrder({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateStoryOrderSession(count, difficulty, excludeKeys ?? []),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateStoryOrderQuestion(difficulty),
    generateSession,
    getQuestionKey: getStoryOrderQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-2 text-center text-sm text-gray-500">Olayların doğru sırasını seç!</p>
      <p className="mb-6 text-center text-xs font-bold text-violet-600">{question.title}</p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <div className="mb-6 flex flex-wrap justify-center gap-3 rounded-2xl bg-violet-50 p-4">
        {question.steps.map((step, i) => (
          <div key={i} className="rounded-xl bg-white px-3 py-2 text-center shadow-sm">
            <span className="text-3xl">{step.emoji}</span>
            <p className="mt-1 max-w-[80px] text-[10px] font-semibold text-gray-600">{step.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option) => {
          const isSelected = session.selectedValue === option.value
          const showCorrect =
            session.answeredCorrectly !== null && isSelected && option.value === question.correctAnswer
          const showWrong = isSelected && session.answeredCorrectly !== null && !showCorrect

          return (
            <button
              key={option.value}
              type="button"
              disabled={session.locked}
              onClick={() => session.handleAnswer(option.value, question.correctAnswer)}
              className={`rounded-2xl py-4 text-lg font-extrabold shadow-md transition active:scale-95 disabled:opacity-60 sm:text-xl ${
                showCorrect
                  ? 'bg-green-500 text-white'
                  : showWrong
                    ? 'bg-orange-300 text-white'
                    : 'bg-violet-100 text-violet-900 hover:bg-violet-200'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
