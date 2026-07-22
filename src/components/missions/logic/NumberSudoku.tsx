import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  generateNumberSudokuQuestion,
  generateNumberSudokuSession,
  getNumberSudokuQuestionKey,
} from '@/missions/modules/logic/numberSudoku/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { SudokuBoard } from '@/components/missions/logic/SudokuBoard'
import { useQuestionSession } from '@/hooks/useQuestionSession'

export function NumberSudoku({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys?: string[]) =>
      generateNumberSudokuSession(count, difficulty).filter(
        (q) => !excludeKeys?.includes(getNumberSudokuQuestionKey(q)),
      ),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateNumberSudokuQuestion(difficulty),
    generateSession,
    getQuestionKey: getNumberSudokuQuestionKey,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <SudokuBoard
        key={getNumberSudokuQuestionKey(question)}
        question={question}
        disabled={session.locked}
        onSubmit={session.handleResult}
        instruction="Boş kutuları 1–6 ile doldur! Her satır, sütun ve 2×3 karede sayılar bir kez!"
        cellClass="h-10 w-10 text-xl sm:h-11 sm:w-11 sm:text-2xl"
      />
    </div>
  )
}
