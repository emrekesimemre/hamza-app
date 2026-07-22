import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import { generateSubtractionQuestion } from '@/missions/modules/math/subtraction/generateQuestion'
import {
  generateSubtractionSession,
  getSubtractionQuestionKey,
} from '@/missions/modules/math/subtraction/session'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

const VISUAL_DOT_LIMIT = 20

export function Subtraction({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateSubtractionSession(count, difficulty).filter(
        (q) => !excludeKeys?.includes(getSubtractionQuestionKey(q)),
      ),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateSubtractionQuestion(difficulty),
    generateSession,
    getQuestionKey: getSubtractionQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion
  const showDots =
    question.minuend <= VISUAL_DOT_LIMIT && question.subtrahend <= VISUAL_DOT_LIMIT

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Onluk bozarak çıkarma da olabilir!</p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      {showDots ? (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-3">
            <div className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: question.minuend }).map((_, i) => (
                <span key={i} className="text-3xl">
                  🔵
                </span>
              ))}
            </div>
          </div>
          <span className="text-3xl font-extrabold text-gray-400">−</span>
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3">
            <div className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: question.subtrahend }).map((_, i) => (
                <span key={i} className="text-3xl opacity-50 line-through">
                  🔵
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-sky-50 px-6 py-4 font-mono text-right text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl">
            <div className="border-b-2 border-gray-300 pb-2">{question.minuend}</div>
            <div>− {question.subtrahend}</div>
          </div>
        </div>
      )}

      <p className="mb-6 text-center text-4xl font-extrabold text-gray-800">
        {question.minuend} − {question.subtrahend} = ?
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
