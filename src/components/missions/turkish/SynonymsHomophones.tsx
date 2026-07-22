import { useMemo, useState } from 'react'
import type { MissionModuleProps } from '@/missions/modules/types'
import {
  formatHomophoneLabel,
  generateSynonymsHomophonesSession,
  getHomophoneRoundHint,
  type WordPairRound,
} from '@/missions/modules/turkish/synonymsHomophones/generateQuestion'
import { MissionProgressBar } from '@/components/missions/common/MissionProgressBar'
import { WrongFeedback } from '@/components/missions/common/WrongFeedback'
import { useMissionStore } from '@/store/useMissionStore'
import { fireStarBurst } from '@/utils/confetti'
import { playSound } from '@/utils/sound'
import { SESSION_QUESTION_COUNT } from '@/missions/modules/types'

function buildRightLabels(round: WordPairRound): string[] {
  if (round.mode === 'synonym' && round.synonymPairs) {
    return round.synonymPairs.map(([, match]) => match)
  }
  if (round.mode === 'homophone' && round.homophonePairs) {
    return round.homophonePairs.map((pair) => formatHomophoneLabel(pair, 'B'))
  }
  return []
}

function buildLeftLabels(round: WordPairRound): string[] {
  if (round.mode === 'synonym' && round.synonymPairs) {
    return round.synonymPairs.map(([word]) => word)
  }
  if (round.mode === 'homophone' && round.homophonePairs) {
    return round.homophonePairs.map((pair) => formatHomophoneLabel(pair, 'A'))
  }
  return []
}

function isCorrectMatch(round: WordPairRound, leftIndex: number, rightLabel: string): boolean {
  if (round.mode === 'synonym' && round.synonymPairs) {
    const [, match] = round.synonymPairs[leftIndex]
    return match === rightLabel
  }
  if (round.mode === 'homophone' && round.homophonePairs) {
    const pair = round.homophonePairs[leftIndex]
    return rightLabel === formatHomophoneLabel(pair, 'B')
  }
  return false
}

export function SynonymsHomophones({ mission, difficulty, onComplete }: MissionModuleProps) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)

  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds] = useState(() =>
    generateSynonymsHomophonesSession(SESSION_QUESTION_COUNT, difficulty),
  )
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matchedLeft, setMatchedLeft] = useState<Set<number>>(new Set())
  const [showWrong, setShowWrong] = useState(false)
  const [locked, setLocked] = useState(false)

  const currentRound = rounds[roundIndex]
  const leftLabels = buildLeftLabels(currentRound)
  const rightLabels = useMemo(
    () => shuffleLabels(buildRightLabels(currentRound)),
    [roundIndex, rounds],
  )

  const isSynonym = currentRound.mode === 'synonym'
  const subtitle = isSynonym
    ? 'Aynı anlama gelen kelimeleri eşleştir!'
    : 'Aynı ses, farklı anlam! İki cümleyi eşleştir.'
  const leftHeader = isSynonym ? 'Kelime' : '1. Cümle'
  const rightHeader = isSynonym ? 'Eş Anlam' : '2. Cümle'
  const homophoneHint =
    !isSynonym && currentRound.homophonePairs
      ? getHomophoneRoundHint(currentRound.homophonePairs)
      : null

  const handleRightSelect = (rightIndex: number) => {
    if (locked || selectedLeft === null) return

    const rightLabel = rightLabels[rightIndex]
    const isCorrect = isCorrectMatch(currentRound, selectedLeft, rightLabel)

    setLocked(true)

    if (isCorrect) {
      recordAnswer(true)
      if (soundEnabled) playSound('correct')
      fireStarBurst()
      const newMatched = new Set(matchedLeft)
      newMatched.add(selectedLeft)
      setMatchedLeft(newMatched)
      setSelectedLeft(null)

      window.setTimeout(() => {
        if (newMatched.size >= 3) {
          if (roundIndex + 1 >= SESSION_QUESTION_COUNT) {
            onComplete()
          } else {
            setRoundIndex((i) => i + 1)
            setMatchedLeft(new Set())
            setSelectedLeft(null)
          }
        }
        setLocked(false)
      }, 800)
    } else {
      recordAnswer(false)
      if (soundEnabled) playSound('wrong')
      setShowWrong(true)
      window.setTimeout(() => {
        setShowWrong(false)
        setSelectedLeft(null)
        setLocked(false)
      }, 1200)
    }
  }

  const progress = { current: roundIndex + 1, total: SESSION_QUESTION_COUNT }

  return (
    <div className="animate-bounce-in rounded-3xl bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-2 text-center text-5xl">{mission.icon}</div>
      <h1 className="mb-1 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
      <p className="mb-2 text-center text-sm text-gray-500">{subtitle}</p>
      <p
        className={`mb-2 text-center text-xs font-bold uppercase tracking-wide ${
          isSynonym ? 'text-emerald-600' : 'text-amber-600'
        }`}
      >
        {isSynonym ? '🤝 Eş Anlamlı Tur' : '🔊 Eş Sesli Tur'}
      </p>
      {!isSynonym && homophoneHint && (
        <p className="mb-4 rounded-2xl bg-amber-50 px-3 py-2 text-center text-xs leading-relaxed text-amber-900">
          {homophoneHint}
        </p>
      )}
      {isSynonym && (
        <p className="mb-4 text-center text-xs text-gray-400">
          Sol kelimeyi seç, sağdaki eş anlamlısını bul.
        </p>
      )}

      <MissionProgressBar current={progress.current} total={progress.total} />
      <WrongFeedback visible={showWrong} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-center text-xs font-bold uppercase text-emerald-600">{leftHeader}</p>
          {leftLabels.map((label, i) => (
            <button
              key={`${label}-${i}`}
              type="button"
              onClick={() => !matchedLeft.has(i) && !locked && setSelectedLeft(i)}
              disabled={matchedLeft.has(i) || locked}
              className={`w-full rounded-2xl px-2 py-4 text-sm font-extrabold transition active:scale-95 disabled:opacity-50 sm:text-base ${
                matchedLeft.has(i)
                  ? 'bg-green-100 text-green-700 line-through'
                  : selectedLeft === i
                    ? 'bg-emerald-200 text-emerald-900 ring-2 ring-emerald-400'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-center text-xs font-bold uppercase text-amber-600">{rightHeader}</p>
          {rightLabels.map((label, i) => (
            <button
              key={`${label}-${i}`}
              type="button"
              onClick={() => handleRightSelect(i)}
              disabled={selectedLeft === null || locked}
              className="w-full rounded-2xl bg-amber-50 px-2 py-4 text-sm font-extrabold text-amber-900 transition hover:bg-amber-100 active:scale-95 disabled:opacity-40 sm:text-base"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function shuffleLabels(labels: string[]): string[] {
  const copy = [...labels]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
