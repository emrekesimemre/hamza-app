import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateMissingNumberQuestion,
  generateMissingNumberSession,
  getMissingNumberQuestionKey,
} from '@/missions/modules/math/missingNumber/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function MissingNumber({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateMissingNumberSession(count, difficulty).filter(
        (q) => !excludeKeys?.includes(getMissingNumberQuestionKey(q)),
      ),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateMissingNumberQuestion(difficulty),
    generateSession,
    getQuestionKey: getMissingNumberQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Boş kutuyu doldur!</p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <p className="mb-8 text-center font-mono text-4xl font-extrabold text-sky-800 sm:text-5xl">
        {question.prompt}
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
