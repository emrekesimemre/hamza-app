import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generatePatternsQuestion,
  generatePatternsSession,
  getPatternsQuestionKey,
} from '@/missions/modules/logic/patterns/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function Patterns({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generatePatternsSession(count, difficulty).filter(
        (q) => !excludeKeys?.includes(getPatternsQuestionKey(q)),
      ),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generatePatternsQuestion(difficulty),
    generateSession,
    getQuestionKey: getPatternsQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        Örüntüyü tamamla! Renk, şekil veya sayı kuralını bul.
      </p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <div className="mb-8 flex flex-wrap justify-center gap-2 rounded-2xl bg-violet-50 p-6">
        {question.sequence.map((item, i) => (
          <span
            key={i}
            className={/^\d+$/.test(item) ? 'min-w-10 text-center text-3xl font-extrabold tabular-nums text-violet-800' : 'text-4xl'}
          >
            {item}
          </span>
        ))}
        <span className="text-4xl font-bold text-violet-600">?</span>
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
