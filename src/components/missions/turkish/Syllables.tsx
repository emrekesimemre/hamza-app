import { useCallback } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import { generateSyllablesSession } from '@/missions/modules/turkish/syllables/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { OptionButtons } from '@/components/missions/common/OptionButtons'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useQuestionSession } from '@/hooks/useQuestionSession'

function formatSyllableDisplay(parts: (string | null)[]): string {
  return parts.map((part) => (part === null ? '___' : part)).join(' - ')
}

export function Syllables({ mission, difficulty, onComplete }: MissionModuleProps) {
  const generateSession = useCallback(
    (count: number, excludeKeys: string[] = []) =>
      generateSyllablesSession(count, difficulty, excludeKeys),
    [difficulty],
  )

  const session = useQuestionSession({
    generateQuestion: () => generateSyllablesSession(1, difficulty)[0],
    generateSession,
    getQuestionKey: (q) => q.fullWord,
    onComplete,
    minAccuracy: mission.completionCriteria.minAccuracy,
  })

  const question = session.currentQuestion
  const showListenHint = session.wrongAttemptsOnQuestion >= 3

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question.fullWord)
      utterance.lang = 'tr-TR'
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Eksik heceyi bul!</p>

      {session.showBonusRound && (
        <div className="mb-4 rounded-2xl bg-amber-50 p-3 text-center font-bold text-amber-700">
          Bir tur daha! 💪
        </div>
      )}

      <MissionProgressBar current={session.progress.current} total={session.progress.total} />
      <WrongFeedback visible={session.showWrong} />

      <div className="mb-8 rounded-2xl bg-sky-50 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-500">
          Eksik heceyi tamamla
        </p>
        <p className="mt-4 font-mono text-3xl font-extrabold tracking-wider text-sky-800 sm:text-4xl">
          {formatSyllableDisplay(question.displayParts)}
        </p>
        {showListenHint ? (
          <div className="mt-4 animate-bounce-in">
            <p className="mb-2 text-sm font-semibold text-sky-600">
              İpucu: Kelimeyi dinleyebilirsin!
            </p>
            <button
              type="button"
              onClick={speakWord}
              className="rounded-xl bg-sky-500 px-5 py-3 text-base font-bold text-white shadow-md transition hover:bg-sky-600 active:scale-95"
            >
              🔊 Dinle
            </button>
          </div>
        ) : (
          <p className="mt-4 text-xs text-sky-400">
            Zorlanırsan 3 denemeden sonra dinleme ipucu açılır
          </p>
        )}
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
